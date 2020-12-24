<template>
  <h2>Inline Web Worker</h2>
  <p>
    <button class="test-worker" @click="test">Click to test worker</button>
    <dl>
      <dt>Protocol should be "http:" when served and "blob:" when built -> </dt>
      <dd class="worker-protocol">{{ result.protocol }}</dd>

      <dt>Inlinable asset content should be "pong" -> </dt>
      <dd class="worker-inlinable-asset-content">{{ result.inlinableAssetContent }}</dd>
    </dl>
  </p>
</template>

<script>
import { reactive } from 'vue'
import Worker from './worker?worker'

export default {
  setup() {
    const result = reactive({
      protocol: null,
      inlinableAssetContent: null
    })

    const worker = new Worker()

    function test() {
      worker.postMessage('test')
    }

    worker.addEventListener('message', ({ data: { key, value } }) => {
      result[key] = value
    })

    return { test, result }
  }
}
</script>
