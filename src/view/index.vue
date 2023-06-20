<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import router from '@/router/index.js'

export default {
  setup(props, { emit }){
    const state=reactive({
    })
    const route = router
    const name = ref()
    return {
      state,
      route,
    }
  }
}
</script>

<template>
  <div>
    index
    <a href="" @click.prevent="route.push({name: 'map'})">
        進入圖臺
    </a>
  </div>
</template>

<style lang="sass">
</style>