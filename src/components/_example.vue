<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'
import { useStore } from 'vuex'
import router from '@/router/index.js'

export default {
  setup(props, { emit }){
    const store = useStore()
    const route = router
    const state=reactive({
    })
    const name = ref()
    return {
        state,
        props,
        store,
    }
  }
}
</script>

<template>
  <div>
  </div>
</template>

<style lang="sass">
</style>