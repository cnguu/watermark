# Utils

底层工具函数，按需导出，未使用时会被 tree-shaking 移除。

```ts
import {
  assign,
  cssToPx,
  deg2rad,
  isFunction,
  resolve,
  supportsMutationObserver,
  supportsResizeObserver,
  toElement,
  uid,
} from '@cnguu/watermark'
```

## uid

```ts
function uid(prefix?: string): string
```

生成短唯一 id，例如 `wm-lq2k3r-1`。

## isFunction

```ts
function isFunction<T>(v: unknown): v is (...args: any[]) => T
```

类型守卫，判断值是否为函数。

## resolve

```ts
function resolve<T>(v: T | ((...args: any[]) => T), ...args: any[]): T
```

若 `v` 是函数则调用并返回结果，否则原样返回。

## assign

```ts
function assign<T extends object>(base: T, patch: Partial<T>): T
```

类型安全的 `Object.assign` 浅拷贝封装。

## deg2rad

```ts
function deg2rad(deg: number): number
```

角度转弧度。

## supportsMutationObserver

```ts
function supportsMutationObserver(): boolean
```

当前环境是否支持 `MutationObserver`。

## supportsResizeObserver

```ts
function supportsResizeObserver(): boolean
```

当前环境是否支持 `ResizeObserver`。

## cssToPx

```ts
function cssToPx(v: string): number
```

将 CSS 长度字符串（如 `'12px'`、`'12'`）解析为像素数值。失败返回 `0`。

## toElement

```ts
function toElement(el: string | HTMLElement | null | undefined): HTMLElement | null
```

接受选择器字符串或元素，统一返回 `HTMLElement | null`。
