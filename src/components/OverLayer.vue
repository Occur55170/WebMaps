<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import router from '@/router/index.js'
import $ from 'jquery'
export default {
    props: {
        text: {
            type: String,
            default: '測試'
        },
        textDirection: {
            type: String,
            default: ''
        },
        status: {
            type: Boolean,
            default: true
        }
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
    v-if="props.status"
    :style="{
        height: state.overLayerHeight + 'px',
        width: state.overLayerWidth + 'px',
    }"
    :ref="(e) => {
        state.accordionListRef = e
    }">
        <div class="tipText text-white fw-bold fs-3"
        :class="props.textDirection"
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
    left: 0px
    width: 200px
</style>