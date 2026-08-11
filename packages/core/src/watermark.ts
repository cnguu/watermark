import type { WatermarkOptions } from './config'
import type { ResolvedOptions, WatermarkInstance } from './types'
import { drawTile } from './canvas'
import { defaultOptions } from './config'
import {
  assign,
  supportsMutationObserver,
  supportsResizeObserver,
  toElement,
  uid,
} from './utils'

/**
 * Lightweight, dependency-free DOM watermark.
 *
 * Features:
 *  - Tiles the watermark as a CSS background-image for cheap rendering.
 *  - MutationObserver guards against inline-style tampering.
 *  - Removal of the node is detected and the watermark is restored.
 *  - ResizeObserver / window resize keeps coverage correct.
 *  - Multi-instance safe: each instance owns its own node + observers.
 *
 * ## Usage
 *
 * ```ts
 * import { Watermark } from '@cnguu/watermark'
 *
 * const wm = Watermark.create({ content: '© Acme' })
 * wm.update({ rotate: -30 })
 * wm.destroy()
 * ```
 *
 * For SSR safety, all DOM access is deferred to {@link Watermark.create}.
 */
export class Watermark {
  /**
   * Create and mount a watermark.
   *
   * Options are merged with {@link defaultOptions}. Pass `container` to
   * scope the watermark to a specific element; otherwise the body is used
   * and only the visible viewport is covered.
   */
  static create(options: WatermarkOptions = {}): WatermarkInstance {
    return new WatermarkImpl(options)
  }

  /** Default options reference (frozen snapshot for introspection). */
  static get defaults(): Readonly<WatermarkOptions> {
    return defaultOptions
  }
}

// ---------------------------------------------------------------------------
// Implementation (not exported directly)
// ---------------------------------------------------------------------------

class WatermarkImpl implements WatermarkInstance {
  readonly id: string
  options: ResolvedOptions

  private node: HTMLDivElement | null = null
  private parent: HTMLElement | null = null
  private mutationObserver: MutationObserver | null = null
  private resizeObserver: ResizeObserver | null = null
  private resizeHandler: (() => void) | null = null
  private restorationTimer: ReturnType<typeof setTimeout> | null = null
  private mounted = false
  private hidden = false
  private reentrancyGuard = false

  constructor(options: WatermarkOptions) {
    this.id = uid('wm')
    this.options = this.resolveOptions(options)
    this.mount()
  }

  get isMounted(): boolean {
    return this.mounted
  }

  // -- public API ----------------------------------------------------------

  render(): void {
    this.paint()
  }

  update(next?: WatermarkOptions): void {
    if (!next)
      return
    this.withGuard(() => {
      this.options = this.resolveOptions({ ...this.options, ...next })
      this.teardownObservers()
      this.mount()
    })
  }

  show(): void {
    if (!this.node)
      return
    this.hidden = false
    this.withGuard(() => {
      this.node!.style.display = 'block'
    })
  }

  hide(): void {
    if (!this.node)
      return
    this.hidden = true
    this.withGuard(() => {
      this.node!.style.display = 'none'
    })
  }

  destroy(): void {
    this.teardownObservers()
    if (this.restorationTimer) {
      clearTimeout(this.restorationTimer)
      this.restorationTimer = null
    }
    if (this.node && this.node.parentNode) {
      this.node.parentNode.removeChild(this.node)
    }
    this.node = null
    this.parent = null
    this.mounted = false
  }

  // -- internals -----------------------------------------------------------

  /** Run a mutation while ignoring the MutationObserver callbacks it triggers. */
  private withGuard<T>(fn: () => T): T {
    this.reentrancyGuard = true
    try {
      return fn()
    }
    finally {
      setTimeout(() => {
        this.reentrancyGuard = false
      }, 0)
    }
  }

  private resolveOptions(input: WatermarkOptions): ResolvedOptions {
    const { container: _inputContainer, ...rest } = input
    void _inputContainer
    const merged = assign(defaultOptions, rest)

    const containerRaw = input.container ?? defaultOptions.container
    const resolved = typeof containerRaw === 'function'
      ? containerRaw()
      : containerRaw
    this.parent = toElement(resolved)
    if (!this.parent && typeof document !== 'undefined') {
      this.parent = document.body
    }

    return { ...merged, container: this.parent } as ResolvedOptions
  }

  private mount(): void {
    if (!this.parent)
      return

    if (!this.node) {
      this.node = document.createElement('div')
      this.node.setAttribute('data-watermark', this.id)
      this.node.setAttribute('aria-hidden', 'true')
    }

    this.paint()
    if (this.hidden)
      this.node.style.display = 'none'

    if (this.node.parentNode !== this.parent) {
      // Use appendChild so it stacks above earlier siblings with the same z.
      this.parent.appendChild(this.node)
    }

    this.mounted = true
    this.setupObservers()
  }

  private paint(): void {
    if (!this.node)
      return
    const opts = this.options
    const url = drawTile(opts)

    const cover = opts.onlyViewport ? 'fixed' : 'absolute'
    const pointerEvents = opts.blockInteraction ? 'none' : 'auto'

    const style = this.node.style
    style.position = cover
    style.top = '0'
    style.left = '0'
    style.right = '0'
    style.bottom = '0'
    style.width = '100%'
    style.height = '100%'
    style.zIndex = String(opts.zIndex)
    style.pointerEvents = pointerEvents
    style.backgroundRepeat = 'repeat'
    style.backgroundPosition = '0 0'
    // gap is achieved by inflating the tile; here we tile the raw tile.
    style.backgroundImage = url ? `url(${url})` : ''
    style.backgroundSize = `${opts.width + opts.gapX}px ${opts.height + opts.gapY}px`
    style.opacity = '1' // opacity is baked into the canvas tile already
    style.userSelect = 'none'
    style.display = this.hidden ? 'none' : 'block'
  }

  // -- observers -----------------------------------------------------------

  private setupObservers(): void {
    if (this.options.disableObserver)
      return
    this.setupMutationObserver()
    this.setupResizeObserver()
  }

  private setupMutationObserver(): void {
    if (!this.options.watchStyle && !this.options.watchDestroy)
      return
    if (!supportsMutationObserver())
      return
    if (!this.node || !this.parent)
      return

    this.mutationObserver = new MutationObserver((records) => {
      if (this.reentrancyGuard)
        return
      for (const r of records) {
        // 1. Inline style tampering.
        if (r.type === 'attributes' && r.attributeName === 'style') {
          if (this.options.watchStyle)
            this.scheduleRestore()
          break
        }
        // 2. Node removed from parent.
        if (r.type === 'childList') {
          const removed = Array.from(r.removedNodes)
          if (removed.includes(this.node as Node)) {
            if (this.options.watchDestroy)
              this.scheduleRestore()
            break
          }
        }
      }
    })

    // Observe both the node (style) and its parent (removal).
    this.mutationObserver.observe(this.node, {
      attributes: true,
      attributeFilter: ['style'],
    })
    this.mutationObserver.observe(this.parent, {
      childList: true,
    })
  }

  private setupResizeObserver(): void {
    if (!this.parent)
      return
    if (supportsResizeObserver()) {
      this.resizeObserver = new ResizeObserver(() => {
        // Background tiles auto-cover on resize; nothing to redraw unless
        // onlyViewport changes sizing strategy. We re-apply to be safe.
        // (Cheap: just re-applies inline styles.)
        // Skip to avoid needless work — CSS handles coverage.
      })
      this.resizeObserver.observe(this.parent)
    }
    else if (typeof window !== 'undefined') {
      this.resizeHandler = () => this.paint()
      window.addEventListener('resize', this.resizeHandler, { passive: true })
    }
  }

  private scheduleRestore(): void {
    if (this.restorationTimer)
      clearTimeout(this.restorationTimer)
    // Defer to next tick so we don't fight the user mid-edit.
    this.restorationTimer = setTimeout(() => {
      this.reentrancyGuard = true
      try {
        // Re-attach node if it was removed.
        if (this.options.watchDestroy && this.node && this.parent && !this.parent.contains(this.node)) {
          this.parent.appendChild(this.node)
        }
        // Re-apply styles.
        this.paint()
      }
      finally {
        this.reentrancyGuard = false
      }
    }, 0)
  }

  private teardownObservers(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect()
      this.mutationObserver = null
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
    if (this.resizeHandler && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeHandler)
      this.resizeHandler = null
    }
  }
}
