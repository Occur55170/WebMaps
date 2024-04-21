<script>
import { reactive, ref } from 'vue'

export default {
    setup(props, { emit }){
        const state = reactive({})
        const name = ref()
        return {
            state,
        }
    },
}
</script>

<template>
  <div>
    我是全域組建
  </div>
</template>

<style lang="sass">
</style>
