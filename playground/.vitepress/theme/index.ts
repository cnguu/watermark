import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import WatermarkDemo from './components/WatermarkDemo.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('WatermarkDemo', WatermarkDemo)
  },
} satisfies Theme
