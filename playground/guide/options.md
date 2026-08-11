# 选项

所有选项均为可选，未传入时使用[最佳实践默认值](#默认值)。

## content

- 类型: `string`
- 默认: `'Watermark'`

水印文字。支持多行，使用 `\n` 分隔。

```ts
Watermark.create({ content: '机密\n仅供内部使用' })
```

## width / height

- 类型: `number`
- 默认: `300` / `240`

单个水印瓦片的尺寸（像素）。瓦片会被平铺以覆盖整个区域。

## container

- 类型: `(() => HTMLElement | string | null) | HTMLElement | string | null`
- 默认: `() => document.body`

水印挂载的目标容器。可以是元素、选择器字符串，或返回上述内容的函数。

```ts
Watermark.create({ container: '#app' })
Watermark.create({ container: () => document.querySelector('.sensitive') })
```

## onlyViewport

- 类型: `boolean`
- 默认: `true`

为 `true` 时使用 `position: fixed`，水印仅覆盖可视区域；为 `false` 时使用 `position: absolute`，覆盖整个 `container` 的可滚动区域。

## blockInteraction

- 类型: `boolean`
- 默认: `true`

是否阻挡水印层上的鼠标/触摸交互。开启时设置 `pointer-events: none`。

## zIndex

- 类型: `number`
- 默认: `2147483647`（32 位有符号整数最大值）

水印层的 z-index，默认保证置顶。

## watchStyle

- 类型: `boolean`
- 默认: `true`

监听水印节点的 `style` 属性变化，被修改后自动恢复。

## watchDestroy

- 类型: `boolean`
- 默认: `true`

监听水印节点是否被从父节点移除，被移除后自动重新挂载。

## opacity

- 类型: `number`
- 默认: `0.12`

水印透明度（0-1）。

## rotate

- 类型: `number`
- 默认: `-22`

旋转角度（度）。

## fontFamily / fontSize / fontWeight / fontStyle

- 默认字体栈: `'Arial, "Helvetica Neue", Helvetica, "PingFang SC", "Microsoft YaHei", sans-serif'`
- 默认字号: `16`
- 默认字重: `'normal'`
- 默认样式: `'normal'`

```ts
Watermark.create({
  fontFamily: 'monospace',
  fontSize: 20,
  fontWeight: 'bold',
  fontStyle: 'italic',
})
```

## color

- 类型: `string`
- 默认: `'#000000'`

文字颜色，任意 CSS 颜色字符串。

## textAlign / textBaseline

- 默认: `'left'` / `'middle'`

对应 Canvas 的 `ctx.textAlign` 与 `ctx.textBaseline`。

## offsetX / offsetY

- 类型: `number`
- 默认: `20` / `20`

文字在瓦片内的偏移（像素）。

## gapX / gapY

- 类型: `number`
- 默认: `20` / `20`

瓦片之间的额外间距（像素），通过 CSS `background-size` 实现。

## lineHeight

- 类型: `number`
- 默认: `1.4`

多行文本的行高倍数。

## background

- 类型: `string`
- 默认: `'transparent'`

瓦片背景色，通常无需设置。

## disableObserver

- 类型: `boolean`
- 默认: `false`

完全禁用 `MutationObserver` 与 `ResizeObserver`，适用于极旧引擎或希望手动控制的场景。

## 默认值

```ts
{
  content: 'Watermark',
  width: 300,
  height: 240,
  container: () => document.body,
  onlyViewport: true,
  blockInteraction: true,
  zIndex: 2147483647,
  watchStyle: true,
  watchDestroy: true,
  opacity: 0.12,
  rotate: -22,
  fontFamily: 'Arial, "Helvetica Neue", Helvetica, "PingFang SC", "Microsoft YaHei", sans-serif',
  fontSize: 16,
  fontWeight: 'normal',
  fontStyle: 'normal',
  color: '#000000',
  textAlign: 'left',
  textBaseline: 'middle',
  offsetX: 20,
  offsetY: 20,
  gapX: 20,
  gapY: 20,
  lineHeight: 1.4,
  background: 'transparent',
  disableObserver: false,
}
```
