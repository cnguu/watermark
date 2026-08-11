# Watermark

主入口类，提供静态工厂方法。

```ts
import { Watermark } from '@cnguu/watermark'
```

## Watermark.create

```ts
static create(options?: WatermarkOptions): WatermarkInstance
```

创建并挂载一个水印实例。

```ts
const wm = Watermark.create({
  content: 'Hello',
  rotate: -30,
})
```

## Watermark.defaults

```ts
static get defaults(): Readonly<WatermarkOptions>
```

返回默认选项的只读快照，便于内省。

```ts
console.log(Watermark.defaults.fontSize) // 16
```

## WatermarkInstance

`Watermark.create` 返回的实例对象。

### id

```ts
readonly id: string
```

实例的唯一标识，形如 `wm-xxxxx-1`。

### options

```ts
readonly options: Readonly<ResolvedOptions>
```

当前已解析的运行时选项（`container` 已解析为 `HTMLElement | null`）。

### isMounted

```ts
readonly isMounted: boolean
```

实例是否已挂载到 DOM。

### render

```ts
render(): void
```

强制重新绘制水印（通常无需手动调用，`update` 会自动触发）。

### update

```ts
update(next?: WatermarkOptions): void
```

合并新选项并重新挂载 + 重绘。不传参数为 no-op。

```ts
wm.update({ content: 'New', color: '#ff0000' })
```

### show / hide

```ts
show(): void
hide(): void
```

显示 / 隐藏水印。隐藏时仅设置 `display: none`，**保留** MutationObserver，防篡改仍生效。

### destroy

```ts
destroy(): void
```

永久销毁实例：

- 断开所有 observer
- 移除 DOM 节点
- 清理定时器

销毁后不应再调用其他方法。
