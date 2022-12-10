<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
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
  <div>
  </div>
</template>

<style>
</style>