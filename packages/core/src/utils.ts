/**
 * Tiny helpers with no dependencies.
 *
 * All helpers are exported for tree-shaking; consumers who only import the
 * main class will only bundle what they actually use.
 */

let _id = 0
/** Generate a short unique id. */
export function uid(prefix = 'wm'): string {
  _id += 1
  return `${prefix}-${Date.now().toString(36)}-${_id.toString(36)}`
}

/** Determine if value is a function. */
export function isFunction(v: unknown): v is (...args: any[]) => any {
  return typeof v === 'function'
}

/** Resolve a value that may be a function. */
export function resolve<T>(v: T | ((...args: any[]) => T), ...args: any[]): T {
  return isFunction(v) ? (v as (...a: any[]) => T)(...args) : v
}

/** Type-safe `Object.assign` for partial updates. */
export function assign<T extends object>(base: T, patch: Partial<T>): T {
  return Object.assign({}, base, patch)
}

/** Convert degrees to radians. */
export function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180
}

/**
 * Detect whether MutationObserver is available.
 * Android 6 (Chrome 44+) supports MutationObserver natively.
 */
export function supportsMutationObserver(): boolean {
  return typeof MutationObserver !== 'undefined'
}

/**
 * Detect whether ResizeObserver is available.
 * Falls back to window resize events when absent.
 */
export function supportsResizeObserver(): boolean {
  return typeof ResizeObserver !== 'undefined'
}

/** Coerce a CSS length to a number (px). Returns 0 on failure. */
export function cssToPx(v: string): number {
  if (/^\d+(?:\.\d+)?$/.test(v.trim()))
    return Number.parseFloat(v)
  const m = v.match(/^([\d.]+)px$/)
  return m ? Number.parseFloat(m[1]) : 0
}

/** Safely query an element by selector or accept a node. */
export function toElement(el: string | HTMLElement | null | undefined): HTMLElement | null {
  if (!el)
    return null
  if (typeof el === 'string') {
    const node = document.querySelector<HTMLElement>(el)
    return node
  }
  return el
}
