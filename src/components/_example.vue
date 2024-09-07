<script>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import router from '@/router/index.js'

export default {
    setup(props, { emit }){
        const store = useStore()
        const route = router
        const state = reactive({})
        const name = ref()
        return {
            state,
            props,
            store,
        }
    },
}
</script>

<template>
  <div>
  </div>
</template>

<style lang="sass">
</style>
