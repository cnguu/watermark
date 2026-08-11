import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@cnguu/watermark',
  description: 'Pure-TS, dependency-free DOM watermark with anti-tamper resilience.',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API', link: '/api/watermark' },
      { text: '演示', link: '/playground/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '选项', link: '/guide/options' },
            { text: '防篡改', link: '/guide/anti-tamper' },
            { text: '兼容性', link: '/guide/compatibility' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API',
          items: [
            { text: 'Watermark', link: '/api/watermark' },
            { text: 'drawTile', link: '/api/draw-tile' },
            { text: 'Utils', link: '/api/utils' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cnguu/watermark' },
    ],
    footer: {
      message: 'Released under the Apache-2.0 License.',
      copyright: 'Copyright © 2024-present cnguu',
    },
    search: { provider: 'local' },
  },
})
