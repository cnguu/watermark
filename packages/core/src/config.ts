/**
 * Watermark default options.
 *
 * Best-practice values tuned for readability, anti-tamper resilience,
 * and minimal visual intrusion.
 */
export const defaultOptions = {
  /** Watermark text. Multi-line strings are split on `\n`. */
  content: 'Watermark',
  /** Width of the generated watermark tile (px). */
  width: 300,
  /** Height of the generated watermark tile (px). */
  height: 240,
  /** Element (or selector) to mount the watermark into. Defaults to viewport. */
  container: () => document.body,
  /** Cover only the visible viewport area instead of the full container. */
  onlyViewport: true,
  /** Block pointer interactions over the watermark region. */
  blockInteraction: true,
  /** z-index of the watermark layer. */
  zIndex: 2147483647,
  /** Auto-recover when watermark styles are mutated. */
  watchStyle: true,
  /** Auto-recover when the watermark node is removed. */
  watchDestroy: true,
  /** Render opacity 0-1. */
  opacity: 0.12,
  /** Rotate angle (deg). */
  rotate: -22,
  /** Font family stack. */
  fontFamily: 'Arial, "Helvetica Neue", Helvetica, "PingFang SC", "Microsoft YaHei", sans-serif',
  /** Font size (px). */
  fontSize: 16,
  /** Font weight (numeric or keyword). */
  fontWeight: 'normal',
  /** Font style. */
  fontStyle: 'normal',
  /** Text color. */
  color: '#000000',
  /** Horizontal text alignment inside the tile. */
  textAlign: 'left' as CanvasTextAlign,
  /** Text baseline. */
  textBaseline: 'middle' as CanvasTextBaseline,
  /** Horizontal offset of the text inside the tile (px). */
  offsetX: 20,
  /** Vertical offset of the text inside the tile (px). */
  offsetY: 20,
  /** Horizontal spacing between tiles (px). */
  gapX: 20,
  /** Vertical spacing between tiles (px). */
  gapY: 20,
  /** Extra line height multiplier for multi-line content. */
  lineHeight: 1.4,
  /** Custom background drawn behind the text (rarely needed). */
  background: 'transparent',
  /** Disable MutationObserver entirely (for very old engines). */
  disableObserver: false,
}

/** The container option accepts a function, element, or selector string. */
export type ContainerInput
  = | (() => HTMLElement | string | null)
    | HTMLElement
    | string
    | null
    | undefined

/** User-facing options. `container` is resolved internally. */
export type WatermarkOptions = Omit<Partial<typeof defaultOptions>, 'container'> & {
  container?: ContainerInput
}
