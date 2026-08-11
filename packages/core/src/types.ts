import type { WatermarkOptions } from './config'

export type { WatermarkOptions } from './config'

/** Internal mutable runtime options. */
export interface ResolvedOptions extends Omit<Required<Omit<WatermarkOptions, 'container'>>, 'container'> {
  container: HTMLElement | null
}

/** Public instance handle returned by {@link Watermark.create}. */
export interface WatermarkInstance {
  /** Unique id of the instance. */
  readonly id: string
  /** Current resolved options. */
  readonly options: Readonly<ResolvedOptions>
  /** Whether the watermark is currently mounted. */
  readonly isMounted: boolean
  /** Re-render the watermark in place. */
  render: () => void
  /** Update options (merged) and re-render. */
  update: (next?: WatermarkOptions) => void
  /** Show the watermark. */
  show: () => void
  /** Hide the watermark (keeps observers). */
  hide: () => void
  /** Permanently destroy the instance and release observers. */
  destroy: () => void
}
