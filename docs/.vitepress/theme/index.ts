import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 可以在这里添加自定义布局
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 应用级别的配置
  }
} satisfies Theme