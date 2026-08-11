<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { Watermark } from '@cnguu/watermark'
import type { WatermarkInstance } from '@cnguu/watermark'

const previewRef = ref<HTMLElement | null>(null)
let wm: WatermarkInstance | null = null

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

function apply() {
  if (!wm || !previewRef.value)
    return
  wm.update({ ...opts, container: previewRef.value })
}

function reset() {
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
  if (!previewRef.value)
    return
  wm = Watermark.create({ ...opts, container: previewRef.value })
})

onBeforeUnmount(() => {
  wm?.destroy()
  wm = null
})
</script>

<template>
  <div class="demo">
    <div
      ref="previewRef"
      class="demo-preview"
    >
      <h3>预览区域</h3>
      <p>
        这是一个相对定位的容器，水印通过 <code>position: absolute</code> 覆盖它。
      </p>
      <p>
        尝试在 DevTools 中修改或删除带 <code>data-watermark</code> 的节点，观察自动恢复行为。
      </p>
      <p>
        开启 <code>blockInteraction</code> 时点击会被水印层拦截；关闭后可选中下层文字。
      </p>
    </div>

    <div class="demo-controls">
      <h3>选项</h3>

      <label>
        <span>内容</span>
        <textarea v-model="opts.content" rows="2" @input="apply" />
      </label>

      <label>
        <span>字号 ({{ opts.fontSize }}px)</span>
        <input type="range" v-model.number="opts.fontSize" min="8" max="80" @input="apply">
      </label>

      <label>
        <span>旋转 ({{ opts.rotate }}°)</span>
        <input type="range" v-model.number="opts.rotate" min="-180" max="180" @input="apply">
      </label>

      <label>
        <span>透明度 ({{ opts.opacity }})</span>
        <input type="range" v-model.number="opts.opacity" min="0.02" max="1" step="0.02" @input="apply">
      </label>

      <label>
        <span>颜色</span>
        <input type="color" v-model="opts.color" @input="apply">
      </label>

      <div class="row">
        <label>
          <span>偏移 X</span>
          <input type="number" v-model.number="opts.offsetX" @change="apply" min="-200" max="200">
        </label>
        <label>
          <span>偏移 Y</span>
          <input type="number" v-model.number="opts.offsetY" @change="apply" min="-200" max="200">
        </label>
      </div>

      <div class="row">
        <label>
          <span>间距 X</span>
          <input type="number" v-model.number="opts.gapX" @change="apply" min="0" max="200">
        </label>
        <label>
          <span>间距 Y</span>
          <input type="number" v-model.number="opts.gapY" @change="apply" min="0" max="200">
        </label>
      </div>

      <div class="row">
        <label>
          <span>瓦片宽</span>
          <input type="number" v-model.number="opts.width" @change="apply" min="50" max="600">
        </label>
        <label>
          <span>瓦片高</span>
          <input type="number" v-model.number="opts.height" @change="apply" min="50" max="600">
        </label>
      </div>

      <div class="row">
        <label class="check">
          <input type="checkbox" v-model="opts.blockInteraction" @change="apply">
          <span>阻挡交互</span>
        </label>
        <label class="check">
          <input type="checkbox" v-model="opts.watchStyle" @change="apply">
          <span>防样式篡改</span>
        </label>
        <label class="check">
          <input type="checkbox" v-model="opts.watchDestroy" @change="apply">
          <span>防节点删除</span>
        </label>
      </div>

      <div class="actions">
        <button class="brand" @click="apply">应用</button>
        <button class="alt" @click="reset">重置</button>
        <button class="alt" @click="() => wm?.hide()">隐藏</button>
        <button class="alt" @click="() => wm?.show()">显示</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  align-items: stretch;
}
.demo-preview {
  flex: 2 1 60%;
  position: relative;
  min-height: 480px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  overflow: hidden;
  background: var(--vp-c-bg);
}
.demo-controls {
  flex: 1 1 280px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  background: var(--vp-c-bg);
}
.demo-controls h3 {
  margin: 0 0 4px;
  font-size: 15px;
}
.demo-controls label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.demo-controls label > span {
  font-weight: 500;
}
.demo-controls input[type='number'],
.demo-controls input[type='text'],
.demo-controls textarea {
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: inherit;
}
.demo-controls input[type='range'] {
  width: 100%;
}
.demo-controls input[type='color'] {
  width: 100%;
  height: 28px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
}
.row {
  display: flex;
  gap: 8px;
}
.row label {
  flex: 1;
}
.check {
  flex-direction: row !important;
  align-items: center;
  gap: 6px;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.actions button {
  flex: 1;
  min-width: 64px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  font: inherit;
  transition: all 0.15s;
}
.actions button.brand {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}
.actions button.alt {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.actions button:hover {
  opacity: 0.85;
}
@media (max-width: 768px) {
  .demo {
    flex-direction: column;
  }
}
</style>
