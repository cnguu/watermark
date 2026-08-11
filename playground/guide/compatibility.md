# 兼容性

## 目标平台

- **最低兼容 Android 6**（Chrome 44+，WebView 44+）
- 现代桌面浏览器（Chrome / Edge / Firefox / Safari）
- Node.js 16+（SSR 安全，DOM 操作会被跳过）

## 使用的 Web API

| API | 最低支持 | 说明 |
| --- | --- | --- |
| `document.createElement` | Android 2.1+ | 核心挂载 |
| `Canvas 2D` + `toDataURL` | Android 2.1+ | 瓦片绘制 |
| `MutationObserver` | Android 5+ (Chrome 18+) | 防篡改监听，Android 6 完全支持 |
| `ResizeObserver` | Android 5+ (Chrome 64+ polyfill) | 可选，缺失时回退到 `window.resize` |
| `requestAnimationFrame` | Android 4.4+ | 未使用 |

## 不需要的 polyfill

- 不使用 `OffscreenCanvas`（Android 6 不支持）
- 不使用 `URL.createObjectURL`（部分旧 WebView 有限制）
- 不使用 ES2015+ `Proxy` / `Reflect`（兼容性问题）

## SSR

在 Node 等非浏览器环境下调用 `Watermark.create()` 不会抛错，但水印不会挂载。你应当在客户端激活阶段调用：

```ts
// 仅在浏览器端运行
if (typeof document !== 'undefined') {
  Watermark.create({ content: 'SSR Safe' })
}
```

## 已知限制

- jsdom 等无 canvas 实现的环境下，`drawTile` 返回空字符串，水印不可见但不会报错。
- 在某些严格 CSP 策略下，`canvas.toDataURL` 可能受限，请确保允许 `img-src data:`。
