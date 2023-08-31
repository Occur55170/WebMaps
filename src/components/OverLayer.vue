<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import router from '@/router/index.js'
import $ from 'jquery'
export default {
    props: {
        text: {
            type: String,
            default: ''
        },
    },
    setup(props, { emit }) {
        const overLayCom = ref(null)

        const state = reactive({
            overLayerHeight: computed(()=>{
                return overLayCom?.value?.offsetHeight + 10
            }),
            overLayerWidth: computed(()=>{
                return overLayCom?.value?.offsetWidth + 10
            }),
            windowStatus: computed(()=>{
                // FIXME: 關閉方塊
                return window.initStatus == false ? 10 : 9
            }),
            accordionListRef: null,
            accordionListRefHeight: computed(()=>{
                return state.accordionListRef?.offsetHeight
            }),
            accordionListRefWidth: computed(()=>{
                return state.accordionListRef?.offsetWidth
            })
        })
        function showClick(params) {
            console.log($('.initOverLay').parent())
            console.log(state.accordionListRefHeight)
            console.log(state.accordionListRefWidth)
        }

        onMounted(()=>{
            $('.initOverLay').parent().addClass('position-relative')
        })
        return {
            state,
            props,
            overLayCom,
            showClick
        }
    }
}
</script>

<template>
    <div class="initOverLay"
    :style="{
        height: state.overLayerHeight + 'px',
        width: state.overLayerWidth + 'px',
    }"
    :ref="(e) => {
        state.accordionListRef = e
    }">
        <!-- <div class="text-white">{{ props.text }}</div> -->
    </div>
</template>

<style lang="sass">
.initOverLay
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    border: 3px solid #fff
    z-index: 99999
</style>