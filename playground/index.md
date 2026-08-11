---
layout: home

hero:
  name: '@cnguu/watermark'
  text: 纯 TS 水印库
  tagline: 零依赖、防篡改、懒加载、高性能，最低兼容 Android 6
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 在线演示
      link: /playground
    - theme: alt
      text: GitHub
      link: https://github.com/cnguu/watermark

features:
  - title: 零依赖
    details: 纯 TypeScript 实现，不引入任何运行时第三方库，体积小巧。
  - title: 防篡改
    details: 通过 MutationObserver 监听内联样式与节点移除，自动恢复水印。
  - title: 多实例
    details: 每个实例拥有独立的 DOM 节点与观察者，互不冲突。
  - title: 高性能
    details: 水印以 CSS 背景图形式平铺，resize 期间无需重绘 canvas。
  - title: 高可定制
    details: 内容、字体、颜色、旋转、间距、透明度、层级、覆盖区域等均可配置。
  - title: 兼容性好
    details: 仅使用 Android 6 (Chrome 44+) 支持的标准 API，无需 polyfill。
---
