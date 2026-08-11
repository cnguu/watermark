# @cnguu/watermark

[![npm version](https://img.shields.io/npm/v/@cnguu/watermark.svg)](https://www.npmjs.com/package/@cnguu/watermark)
[![license](https://img.shields.io/npm/l/@cnguu/watermark.svg)](./LICENSE)

> 纯 TypeScript、零运行时依赖的 DOM 水印库，最低兼容 Android 6。

- **零依赖** — 不引入任何运行时第三方库，体积小巧
- **防篡改** — MutationObserver 监听样式与节点变化，自动恢复
- **多实例** — 每个实例独立 DOM 节点与观察者，互不冲突
- **高性能** — Canvas 仅绘制一次，CSS 背景平铺覆盖，resize 无重绘
- **高可定制** — 内容、字体、颜色、旋转、间距、透明度、层级等均可配置
- **懒加载 / 树摇** — `sideEffects: false`，工具函数按需导入
- **兼容性好** — 仅使用 Android 6 (Chrome 44+) 支持的标准 API

## 安装

```bash
pnpm add @cnguu/watermark
# or
npm i @cnguu/watermark
```

## 快速开始

```ts
import { Watermark } from '@cnguu/watermark'

const wm = Watermark.create({
  content: '© 2024 Acme Inc.',
})

wm.update({ rotate: -30, fontSize: 18 })
wm.hide()
wm.show()
wm.destroy()
```

## 主要选项

| 选项 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `content` | `string` | `'Watermark'` | 水印文字，支持 `\n` 多行 |
| `container` | `element \| selector \| function` | `() => document.body` | 挂载容器 |
| `onlyViewport` | `boolean` | `true` | 仅覆盖可视区域 |
| `blockInteraction` | `boolean` | `true` | 阻挡水印层交互 |
| `zIndex` | `number` | `2147483647` | 层级 |
| `watchStyle` | `boolean` | `true` | 防样式篡改 |
| `watchDestroy` | `boolean` | `true` | 防节点删除 |
| `opacity` | `number` | `0.12` | 透明度 |
| `rotate` | `number` | `-22` | 旋转角度 |
| `fontSize` | `number` | `16` | 字号 |
| `color` | `string` | `'#000000'` | 文字颜色 |
| `gapX` / `gapY` | `number` | `20` | 瓦片间距 |
| `offsetX` / `offsetY` | `number` | `20` | 文字偏移 |
| `disableObserver` | `boolean` | `false` | 禁用 observer |

完整选项见 [文档](https://cnguu.github.io/watermark/guide/options)。

## 实例方法

```ts
const wm = Watermark.create()

wm.render() // 强制重绘
wm.update(next) // 合并选项并重绘
wm.show() // 显示
wm.hide() // 隐藏（保留 observer）
wm.destroy() // 永久销毁
wm.id // 唯一 id
wm.options // 已解析选项
wm.isMounted // 是否挂载
```

## 文档

- [指南](https://cnguu.github.io/watermark/guide/getting-started)
- [API](https://cnguu.github.io/watermark/api/watermark)
- [在线演示](https://cnguu.github.io/watermark/playground)

## 开发

```bash
pnpm install
pnpm dev          # 监听构建 core
pnpm play         # 启动文档站点
pnpm test         # 运行测试
pnpm typecheck    # 类型检查
pnpm lint:fix     # 修复 lint
pnpm build        # 构建 core
```

## License

[Apache-2.0](./LICENSE) © cnguu
