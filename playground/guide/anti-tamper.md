# 防篡改

水印库内置了对前端手动篡改的防护，默认全部开启。

## 样式恢复

当用户通过 DevTools 修改水印节点的 `style` 属性（例如把 `z-index` 改为 `0`、把 `display` 改为 `none`），`MutationObserver` 会捕获变化并在下一事件循环里恢复原有内联样式。

```ts
Watermark.create({ watchStyle: true }) // 默认即为 true
```

如需关闭：

```ts
Watermark.create({ watchStyle: false })
```

## 节点恢复

当用户从 DOM 中移除水印节点（`node.remove()` 或 `parent.removeChild(node)`），观察父节点的 `childList` 变化会触发自动重新挂载。

```ts
Watermark.create({ watchDestroy: true }) // 默认即为 true
```

::: warning
`watchDestroy` 依赖 `MutationObserver`。在不支持该 API 的环境（极旧浏览器）下无法生效，可通过 [`disableObserver: true`](./options#disableobserver) 显式关闭以节省开销。
:::

## 多实例互不干扰

每个实例拥有独立的 `MutationObserver`，只监听自身节点与父节点。同时创建多个水印不会相互影响：

```ts
const a = Watermark.create({ content: 'A' })
const b = Watermark.create({ content: 'B' })
// 修改 a 不会触发 b 的恢复
a.destroy()
// b 仍然正常工作
```

## 性能考量

- 恢复动作通过 `setTimeout(0)` 异步执行，避免在用户连续操作时阻塞主线程。
- 恢复时设置重入保护（`reentrancyGuard`），防止自身修改触发循环。
- Canvas 仅在 `create`/`update` 时绘制一次，resize 期间通过 CSS 背景平铺覆盖，无重绘开销。
