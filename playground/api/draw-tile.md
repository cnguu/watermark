# drawTile

```ts
import { drawTile } from '@cnguu/watermark'

function drawTile(options: ResolvedOptions): string
```

将水印绘制为单个瓦片，返回 PNG data URL。

内部由 `Watermark` 调用，但你也可以单独使用以：

- 预览水印外观
- 把瓦片用于其他用途（例如 `<img>`、`<canvas>` 背景）

```ts
import { defaultOptions, drawTile } from '@cnguu/watermark'

const url = drawTile({
  ...defaultOptions,
  content: 'Preview',
  container: document.body,
} as any)

const img = new Image()
img.src = url
document.body.appendChild(img)
```

::: tip
在无 canvas 实现的环境（如 jsdom、SSR）下返回空字符串，不会抛错。
:::
