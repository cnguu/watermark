import type { ResolvedOptions } from './types'
import { deg2rad } from './utils'

/**
 * Render the watermark tile to a data URL using canvas.
 *
 * The returned image is a single tile (width × height) containing the
 * (possibly multi-line) text drawn with the configured style. The tile is
 * then tiled as a CSS `background-image` across the watermark layer, which
 * is significantly cheaper than redrawing canvas on every resize.
 *
 * On environments without `document.createElement('canvas')` (SSR), this
 * function returns an empty string and the layer is skipped gracefully.
 *
 * Android 6 compatibility notes:
 *  - Canvas 2D is fully supported.
 *  - `toDataURL('image/png')` is supported.
 *  - No `OffscreenCanvas`, so we always use a regular canvas element.
 */
export function drawTile(opts: ResolvedOptions): string {
  if (typeof document === 'undefined')
    return ''

  const canvas = document.createElement('canvas')
  // Tile is lightweight: CSS scales it via background-repeat.
  canvas.width = opts.width
  canvas.height = opts.height

  const ctx = canvas.getContext('2d')
  if (!ctx)
    return ''

  ctx.clearRect(0, 0, opts.width, opts.height)

  if (opts.background && opts.background !== 'transparent') {
    ctx.fillStyle = opts.background
    ctx.fillRect(0, 0, opts.width, opts.height)
  }

  ctx.globalAlpha = opts.opacity
  ctx.fillStyle = opts.color
  ctx.font = `${opts.fontStyle} ${opts.fontWeight} ${opts.fontSize}px / ${opts.lineHeight} ${opts.fontFamily}`
  ctx.textAlign = opts.textAlign
  ctx.textBaseline = opts.textBaseline

  const lines = String(opts.content).split('\n')
  const lineHeightPx = opts.fontSize * opts.lineHeight
  const totalHeight = lines.length * lineHeightPx
  // Vertical centering, then apply user offset.
  const startY = (opts.height - totalHeight) / 2 + lineHeightPx / 2 + opts.offsetY

  ctx.save()
  ctx.translate(opts.offsetX, 0)
  ctx.rotate(deg2rad(opts.rotate))
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], 0, startY + i * lineHeightPx)
  }
  ctx.restore()

  // Keep tile lightweight; CSS handles coverage via background-repeat.

  return canvas.toDataURL('image/png')
}
