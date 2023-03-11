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
    <div class="main">
        <!-- <WebMap /> -->
        <Wes />
        <!-- <div v-if="true">
            <WebMap />
        </div>
        <div v-else>
            <threeDimensionMap />
        </div> -->

        <!-- <threeDimensionMap /> -->
    </div>
</template>

<style lang="sass">
@import './assets/styles/all.module.scss'

.mapContent
    height: 100vh
    width: 100vw
.main
    position: fixed
    top: 0
    left: 0
    height: 100%
    width: 100%

.LayoutTool
    position: absolute
    top: 0
    left: 0
    z-index: 220


</style>
