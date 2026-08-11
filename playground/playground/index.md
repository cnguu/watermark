---
aside: false
---

# 在线演示

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { Watermark } from '@cnguu/watermark'

const previewRef = ref(null)
let wm = null

const opts = reactive({
  content: '@cnguu/watermark',
  width: 300,
  height: 240,
  onlyViewport: false,
  blockInteraction: true,
  zIndex: 2147483647,
  watchStyle: true,
  watchDestroy: true,
  opacity: 0.12,
  rotate: -22,
  fontFamily: 'Arial, "PingFang SC", "Microsoft YaHei", sans-serif',
  fontSize: 16,
  fontWeight: 'normal',
  fontStyle: 'normal',
  color: '#000000',
  offsetX: 20,
  offsetY: 20,
  gapX: 20,
  gapY: 20,
  lineHeight: 1.4,
})

function apply () {
  if (!wm) return
  wm.update({ ...opts, container: previewRef.value })
}

function reset () {
  Object.assign(opts, {
    content: '@cnguu/watermark',
    width: 300,
    height: 240,
    opacity: 0.12,
    rotate: -22,
    fontSize: 16,
    color: '#000000',
    offsetX: 20,
    offsetY: 20,
    gapX: 20,
    gapY: 20,
  })
  apply()
}

onMounted(() => {
  wm = Watermark.create({ ...opts, container: previewRef.value })
})
onBeforeUnmount(() => wm?.destroy())
</script>

<div class="demo-grid">
  <div
    ref="previewRef"
    class="demo-preview"
    style="position: relative; min-height: 480px; border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 16px; overflow: hidden;"
  >
    <h3>预览区域</h3>
    <p>这里是一个相对定位的容器，水印通过 <code>position: absolute</code> 覆盖它。</p>
    <p>尝试在 DevTools 中修改或删除带 <code>data-watermark</code> 的节点，观察自动恢复行为。</p>
    <p>可以选中此区域的文字——水印不会阻挡交互（<code>blockInteraction: false</code> 时），但开启 <code>blockInteraction</code> 时点击会被水印层拦截。</p>
  </div>

  <div class="demo-controls">
    <h3>选项</h3>

    <label>内容 <textarea v-model="opts.content" @input="apply" rows="2"></textarea></label>

    <label>字号 <input type="number" v-model.number="opts.fontSize" @change="apply" min="8" max="80"></label>
    <label>旋转 <input type="number" v-model.number="opts.rotate" @change="apply" min="-180" max="180"></label>
    <label>透明度 <input type="range" v-model.number="opts.opacity" @change="apply" min="0.02" max="1" step="0.02"> <code>{{ opts.opacity }}</code></label>
    <label>颜色 <input type="color" v-model="opts.color" @change="apply"></label>

    <label>偏移 X <input type="number" v-model.number="opts.offsetX" @change="apply" min="-200" max="200"></label>
    <label>偏移 Y <input type="number" v-model.number="opts.offsetY" @change="apply" min="-200" max="200"></label>
    <label>间距 X <input type="number" v-model.number="opts.gapX" @change="apply" min="0" max="200"></label>
    <label>间距 Y <input type="number" v-model.number="opts.gapY" @change="apply" min="0" max="200"></label>

    <label>瓦片宽 <input type="number" v-model.number="opts.width" @change="apply" min="50" max="600"></label>
    <label>瓦片高 <input type="number" v-model.number="opts.height" @change="apply" min="50" max="600"></label>

    <label><input type="checkbox" v-model="opts.blockInteraction" @change="apply"> 阻挡交互</label>
    <label><input type="checkbox" v-model="opts.watchStyle" @change="apply"> 防样式篡改</label>
    <label><input type="checkbox" v-model="opts.watchDestroy" @change="apply"> 防节点删除</label>

    <div class="demo-actions">
      <button class="VPButton medium brand" @click="apply">应用</button>
      <button class="VPButton medium alt" @click="reset">重置</button>
    </div>
  </div>
</div>

<style>
.demo-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-top: 16px;
}
@media (max-width: 768px) {
  .demo-grid { grid-template-columns: 1fr; }
}
.demo-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
}
.demo-controls label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
}
.demo-controls input[type="number"],
.demo-controls input[type="text"],
.demo-controls textarea {
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.demo-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
</style>
