<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
export default {
  setup(props, { emit }){
    const state=reactive({
    })
    return {
      state,
    }
  }
}
</script>

<template>
  <div>
    <input type="text">
  </div>
</template>

<style>
</style>