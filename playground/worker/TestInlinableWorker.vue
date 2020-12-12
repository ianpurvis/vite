<template>
  <p>
    <button class="test-inlinable-worker" @click="test">Click to test inlinable worker</button>
    <dl>
      <dt>Protocol should be "http:" when served and "blob:" when built -> </dt>
      <dd class="inlinable-worker-protocol">{{ result.protocol }}</dd>

      <dt>Inlinable asset content should be "pong" -> </dt>
      <dd class="inlinable-worker-inlinable-asset-content">{{ result.inlinableAssetContent }}</dd>

      <dt>Asset content should be "🍄" x 1024 -> </dt>
      <dd class="inlinable-worker-asset-content">{{ result.assetContent }}</dd>
    </dl>
  </p>
</template>

<script>
import { reactive } from 'vue'
import Worker from './inlinable-worker?worker'

export default {
  setup() {
    const result = reactive({
      protocol: null,
      inlinableAssetContent: null,
      assetContent: null
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
