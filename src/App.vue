<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

export default {
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const state = reactive({})

        return {
            state,
        }
    }
}
</script>

<template>
    <routerView />
    <!-- <div class="main"> -->
        <!-- <WebMap /> -->
    <!-- </div> -->
    <!-- <mapDetails /> -->

</template>

<style lang="sass">
.main
    position: fixed
    top: 0
    left: 0
    height: 100%
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
