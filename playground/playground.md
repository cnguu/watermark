---
aside: false
---

# 在线演示

<WatermarkDemo />

## 使用方法

```ts
import { Watermark } from '@cnguu/watermark'

const wm = Watermark.create({
  content: '© 2024 Acme Inc.',
  container: document.getElementById('app'),
  onlyViewport: false,
})

wm.update({ rotate: -30, fontSize: 18 })
wm.hide()
wm.show()
wm.destroy()
```

更多选项请查阅 [选项文档](/guide/options)。
