# 快速开始

## 安装

```bash
pnpm add @cnguu/watermark
# or
npm i @cnguu/watermark
# or
yarn add @cnguu/watermark
```

## 基础用法

```ts
import { Watermark } from '@cnguu/watermark'

// 创建一个覆盖可视区域的水印
const wm = Watermark.create({
  content: '© 2024 Acme Inc.',
})

// 更新选项（会自动重渲染）
wm.update({ rotate: -30, fontSize: 18 })

// 暂时隐藏（保留观察者，不解除防篡改）
wm.hide()
wm.show()

// 永久销毁并释放所有观察者
wm.destroy()
```

## 在框架中使用

水印库与框架无关，只需在合适的生命周期里创建/销毁实例即可。

::: code-group

```vue [Vue]
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { Watermark } from '@cnguu/watermark'

let wm
onMounted(() => {
  wm = Watermark.create({ content: 'Vue Demo' })
})
onBeforeUnmount(() => wm?.destroy())
</script>
```

```tsx [React]
import { Watermark } from '@cnguu/watermark'
import { useEffect } from 'react'

export function App() {
  useEffect(() => {
    const wm = Watermark.create({ content: 'React Demo' })
    return () => wm.destroy()
  }, [])
  return null
}
```

```ts [Svelte]
import { Watermark } from '@cnguu/watermark'
import { onDestroy, onMount } from 'svelte'

let wm
onMount(() => { wm = Watermark.create({ content: 'Svelte Demo' }) })
onDestroy(() => wm?.destroy())
```

:::

## Tree-shaking

`@cnguu/watermark` 标记了 `sideEffects: false`，且所有工具函数都按具名导出。只引入 `Watermark` 时，未使用的 `drawTile`、`utils` 等会被打包器摇除。
