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
  <div class="wrap">
    <div class="startCon">
        <img src="@/assets/img/logo.svg" class="logo" alt="">
        <a href="" @click.prevent="route.push({name: 'map'})">
            進入圖臺
        </a>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import '@/assets/styles/all.module.scss'
.wrap
    background-image: url('src/assets/img/indexBackground.svg')
    background-repeat: no-repeat
    background-size: cover
    background-position: bottom
.startCon
    &::before
        content: ''
        background-image: url('src/assets/img/indexHead.svg')
        background-repeat-y: no-repeat
        display: block
        width: 48%
        height: 30px
    &::after
        content: ''
        background-image: url('src/assets/img/indexHead.svg')
        background-repeat-y: no-repeat
        display: block
        width: 26%
        height: 30px
.logo
    width: 200px
.startCon
    color: #000
</style>