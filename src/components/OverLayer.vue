<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import router from '@/router/index.js'
export default {
  setup(props, { emit }){
    const state=reactive({
    })
    const name = ref()
    return {
      state,
    }
  }
}
</script>

<template>
  <div class="test" style="width: 100%;height: 100%;background: #90ee90">
  </div>
</template>

<style lang="sass">
.test
    position: absolute
    opacity: 0.3
</style>