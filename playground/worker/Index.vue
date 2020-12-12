<template>
  <h2>Web Workers</h2>
  <TestWorker/>
  <TestInlinableWorker/>
</template>

<script>
import TestWorker from './TestWorker.vue'
import TestInlinableWorker from './TestInlinableWorker.vue'

export default {
  components: {
    TestWorker,
    TestInlinableWorker
  }
}
</script>
