<script>
import { getCurrentInstance, onMounted, reactive } from 'vue'

export default {
    setup(props, { emit }){
        const { proxy } = getCurrentInstance()
        const state = reactive({
            innerHeight: 0,
        })

        onMounted(() => {
            state.innerHeight = window.innerHeight
            window.addEventListener('resize', (e) => {
                state.innerHeight = e.target.innerHeight
            })
        })

        return {
            window,
            state,
        }
    },
}
</script>

<template>
  <routerView class="wrap"
              :style="{
        'height': state.innerHeight + 'px'
    }"/>
</template>

<style lang="sass">
.wrap
  // height: 100vh
  width: 100%

.lightWrap
  z-index: 999
  position: fixed
  top: 0
  left: 0
  background: rgb(0, 0, 0, 0.1)

  .lightbox
    background: #fff
</style>
