<template>
  <h2>Inline Web Worker</h2>
  <p>
    <button class="test-worker" @click="test">Click to test worker</button>
    <dl>
      <dt>Response should be "pong" -> </dt>
      <dd class="worker-response">{{ result.response }}</dd>
    </dl>
  </p>
</template>

<script>
import { reactive } from 'vue'
import Worker from './worker?worker'

export default {
  setup() {
    const result = reactive({
      response: null
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
