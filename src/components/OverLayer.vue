<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'
import router from '@/router/index.js'
import { useStore } from 'vuex'

export default {
    props: {
        text: {
            type: String,
            default: '測試'
        },
        styles: {
            type: String,
            default: ''
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    setup(props, { emit }) {
        const store = useStore()
        const route = router

        // 透過ref綁定此元件，元件再以position的方式黏貼在父層上，在抓取此元件寬高做出白邊線效果
        const overLayCom = ref(null)

        const state = reactive({
            overLayerHeight: computed(()=>{
                return overLayCom?.value?.offsetHeight + 10
            }),
            overLayerWidth: computed(()=>{
                return overLayCom?.value?.offsetWidth + 10
            }),
            accordionListRef: null,
            accordionListRefHeight: computed(()=>{
                return state.accordionListRef?.offsetHeight
            }),
            accordionListRefWidth: computed(()=>{
                return state.accordionListRef?.offsetWidth
            })
        })

        onMounted(()=>{
            $('.initOverLay').parent().addClass('position-relative')
        })
        return {
            state,
            props,
            store,
            route,
            overLayCom,
        }
    }
}
</script>
<template>
    <div class="initOverLay"
    v-if="store.state.isInit"
    @click="store.dispatch('updateLayerStatus', false)"
    :style="{
        height: state.overLayerHeight + 'px',
        width: state.overLayerWidth + 'px',
    }"
    :ref="(e) => {
        state.accordionListRef = e
    }">
        <div class="tipText text-white fw-bold fs-3"
        :style="props.styles"
        >{{ props.text }}</div>
    </div>
</template>
<style lang="sass">
.initOverLay
    position: absolute
    top: -5px
    left: -5px
    width: calc(100% + 10px)
    height: calc(100% + 10px)
    border: 3px solid #fff
    z-index: 99999
.tipText
    position: absolute
    top: 100%
    width: 300px
</style>