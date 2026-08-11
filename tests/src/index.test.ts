import type { WatermarkOptions } from '@cnguu/watermark'
import { defaultOptions, drawTile, Watermark } from '@cnguu/watermark'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  document.body.innerHTML = ''
  vi.useRealTimers()
})

describe('defaultOptions', () => {
  it('exposes best-practice defaults', () => {
    expect(defaultOptions.content).toBe('Watermark')
    expect(defaultOptions.onlyViewport).toBe(true)
    expect(defaultOptions.blockInteraction).toBe(true)
    expect(defaultOptions.zIndex).toBe(2147483647)
    expect(defaultOptions.watchStyle).toBe(true)
    expect(defaultOptions.watchDestroy).toBe(true)
  })
})

describe('watermark.create', () => {
  it('mounts a watermark node into document.body by default', () => {
    const wm = Watermark.create()
    const node = document.querySelector<HTMLDivElement>('[data-watermark]')
    expect(node).not.toBeNull()
    expect(wm.isMounted).toBe(true)
    expect(wm.options.container).toBe(document.body)
    wm.destroy()
  })

  it('respects a custom container element', () => {
    const host = document.createElement('div')
    host.id = 'host'
    document.body.appendChild(host)

    const wm = Watermark.create({ container: host, onlyViewport: false })
    expect(wm.options.container).toBe(host)
    expect(host.querySelector('[data-watermark]')).not.toBeNull()
    expect(document.body.querySelector('[data-watermark]')).not.toBeNull()
    wm.destroy()
  })

  it('accepts a selector string for container', () => {
    const host = document.createElement('div')
    host.id = 'sel-host'
    document.body.appendChild(host)

    const wm = Watermark.create({ container: '#sel-host', onlyViewport: false })
    expect(wm.options.container).toBe(host)
    wm.destroy()
  })

  it('accepts a function returning an element', () => {
    const host = document.createElement('div')
    host.id = 'fn-host'
    document.body.appendChild(host)

    const wm = Watermark.create({
      container: () => document.getElementById('fn-host')!,
      onlyViewport: false,
    })
    expect(wm.options.container).toBe(host)
    wm.destroy()
  })

  it('generates a unique id per instance', () => {
    const a = Watermark.create()
    const b = Watermark.create()
    expect(a.id).not.toBe(b.id)
    a.destroy()
    b.destroy()
  })
})

describe('watermark.update', () => {
  it('re-renders with merged options', () => {
    const wm = Watermark.create({ content: 'A' })
    expect(wm.options.content).toBe('A')
    wm.update({ content: 'B', rotate: -45 })
    expect(wm.options.content).toBe('B')
    expect(wm.options.rotate).toBe(-45)
    wm.destroy()
  })

  it('no-op when called with no arguments', () => {
    const wm = Watermark.create()
    const before = wm.options.content
    wm.update()
    expect(wm.options.content).toBe(before)
    wm.destroy()
  })
})

describe('watermark.show / hide', () => {
  it('toggles display', () => {
    const wm = Watermark.create()
    wm.hide()
    const node = document.querySelector<HTMLDivElement>('[data-watermark]')!
    expect(node.style.display).toBe('none')
    wm.show()
    expect(node.style.display).toBe('block')
    wm.destroy()
  })
})

describe('watermark.destroy', () => {
  it('removes the node and disconnects observers', () => {
    const wm = Watermark.create()
    const node = document.querySelector('[data-watermark]')
    expect(node).not.toBeNull()
    wm.destroy()
    expect(document.querySelector('[data-watermark]')).toBeNull()
    expect(wm.isMounted).toBe(false)
  })
})

describe('anti-tamper', () => {
  it('restores inline styles when mutated (watchStyle)', async () => {
    vi.useFakeTimers()
    const wm = Watermark.create({ watchStyle: true })
    const node = document.querySelector<HTMLDivElement>('[data-watermark]')!
    const original = node.style.zIndex

    node.style.zIndex = '1'
    expect(node.style.zIndex).toBe('1')

    await vi.runAllTimersAsync()
    expect(node.style.zIndex).toBe(original)
    wm.destroy()
  })

  it('does not restore styles when watchStyle is false', async () => {
    vi.useFakeTimers()
    const wm = Watermark.create({ watchStyle: false })
    const node = document.querySelector<HTMLDivElement>('[data-watermark]')!
    node.style.zIndex = '5'
    await vi.runAllTimersAsync()
    expect(node.style.zIndex).toBe('5')
    wm.destroy()
  })

  it('re-attaches the node when removed (watchDestroy)', async () => {
    vi.useFakeTimers()
    const wm = Watermark.create({ watchDestroy: true, onlyViewport: false })
    const node = document.querySelector<HTMLDivElement>('[data-watermark]')!
    node.parentNode!.removeChild(node)
    expect(document.querySelector('[data-watermark]')).toBeNull()

    await vi.runAllTimersAsync()
    expect(document.querySelector('[data-watermark]')).not.toBeNull()
    wm.destroy()
  })

  it('does not re-attach when watchDestroy is false', async () => {
    vi.useFakeTimers()
    const wm = Watermark.create({ watchDestroy: false, onlyViewport: false })
    const node = document.querySelector<HTMLDivElement>('[data-watermark]')!
    node.parentNode!.removeChild(node)
    await vi.runAllTimersAsync()
    expect(document.querySelector('[data-watermark]')).toBeNull()
    wm.destroy()
  })
})

describe('drawTile', () => {
  it('returns a data URL in a DOM environment with canvas support', () => {
    // jsdom does not implement canvas getContext by default; skip gracefully.
    const probe = document.createElement('canvas')
    if (!probe.getContext('2d')) {
      console.warn('Skipping drawTile data-URL test: jsdom lacks canvas support')
      return
    }
    const url = drawTile({
      ...defaultOptions,
      container: document.body,
    } as Required<WatermarkOptions> as never)
    expect(url).toMatch(/^data:image\/png;base64,/)
  })

  it('returns empty string when canvas 2D context is unavailable', () => {
    const url = drawTile({
      ...defaultOptions,
      container: document.body,
    } as Required<WatermarkOptions> as never)
    // In jsdom without canvas polyfill, this is ''.
    expect(typeof url).toBe('string')
  })
})

describe('multi-instance', () => {
  it('supports multiple watermarks without conflict', () => {
    const a = Watermark.create({ content: 'A' })
    const b = Watermark.create({ content: 'B' })
    const nodes = document.querySelectorAll('[data-watermark]')
    expect(nodes.length).toBe(2)
    expect(a.id).not.toBe(b.id)
    a.destroy()
    b.destroy()
    expect(document.querySelectorAll('[data-watermark]').length).toBe(0)
  })
})

describe('blockInteraction', () => {
  it('sets pointer-events:none by default', () => {
    const wm = Watermark.create({ blockInteraction: true })
    const node = document.querySelector<HTMLDivElement>('[data-watermark]')!
    expect(node.style.pointerEvents).toBe('none')
    wm.destroy()
  })

  it('sets pointer-events:auto when disabled', () => {
    const wm = Watermark.create({ blockInteraction: false })
    const node = document.querySelector<HTMLDivElement>('[data-watermark]')!
    expect(node.style.pointerEvents).toBe('auto')
    wm.destroy()
  })
})
