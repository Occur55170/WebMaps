<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

export default {
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const state = reactive({
            aaa: 0
        })

        onMounted(()=>{
            state.aaa = window.innerHeight
            window.addEventListener('resize', (e)=>{
                state.aaa = e.target.innerHeight
            })
        })

        return {
            window,
            state,
        }
    }
}
</script>

<template>
    <routerView class="wrap"
    :style="{
        'height': state.aaa + 'px'
    }" />
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
