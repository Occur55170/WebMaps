<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'

export default {
    props: {
        currentLayers: {
            type: Array,
            default: []
        },
        mapCount: {
            type: Number,
            default: 1
        },
        dimensionMapStatus: {
            type: Boolean,
            default: false
        },
        openConditionWrap: {
            type: Function,
            default: () => {}
        },
        openLayerSelect: {
            type: Function,
            default: () => {}
        },
        onLayerControl: {
            type: Function,
            default: () => {}
        },
        onChangeTarget: {
            type: Function,
            default: () => {}
        },
    },
    setup(props, { emit }) {
        const state = reactive({
            toolSwitch: {
                threeDimensionalBtn: false,
                layerConditionBtn: false,
                splitWindowBtn: false,
            },
            targetNum: 1,
        })

        function toolSwitch(target, value) {
            // 其他全部關掉
            Object.keys(state.toolSwitch).forEach(node => {
                if (node === target) {
                    if(state.toolSwitch[target]) {
                        state.toolSwitch[target] = false
                    } else {
                        state.toolSwitch[target] = true
                    }
                } else {
                    state.toolSwitch[node] = false
                }
            })
        }
        function onLayerControl(action, value) {
            if (action === 'changeMapCount') {
                state.toolSwitch['splitWindowBtn'] = false
            }
            props.onLayerControl({ action, value })
        }

        function conditionWrap() {
            emit('conditionWrap')
        }

        // console.log(props.openLayerSelect)

        return {
            props,
            state,
            toolSwitch,
            onLayerControl,
            conditionWrap,
        }
    }
}
</script>

<template>
    <div class="w-100">
        <div class="position-fixed top-0 w-100 d-flex justify-content-end flex-wrap">
            <img src="@/assets/logo.svg" class="w-100" alt="">
            <div class="switchControl me-2 d-block rounded-4 p-2" id="switchControl" style="z-index: 99;">
                <div class="text-white rounded-pill" :class="{ 'active': state.targetNum === 1 }"
                @click="() => {
                    state.targetNum = 1
                    props.onChangeTarget(1)
                }">上</div>
                <div class="text-white rounded-pill" :class="{ 'active': state.targetNum === 2 }"
                @click="() => {
                    state.targetNum = 2
                    props.onChangeTarget(2)
                }">下</div>
            </div>
        </div>

        <ul class="list-unstyled d-flex align-items-center justify-content-between flex-nowrap w-100 bg-white mb-0">
            <li class="me-4 position-relative">
                <div class="text-white">
                    <a href="" v-if="props.dimensionMapStatus"
                    @click.prevent="toolSwitch('threeDimensionalBtn'), onLayerControl('changeDimensionMap', '3D')">
                        <img src="@/assets/img/icon/twoDimensional.svg">
                    </a>
                    <a href="" v-else
                    @click.prevent="toolSwitch('threeDimensionalBtn'), onLayerControl('changeDimensionMap', '2D')">
                        <img src="@/assets/img/icon/threeDimensional.svg">
                    </a>
                </div>
            </li>
            <li class="me-4 position-relative">
                <div class="text-white" @click="props.openConditionWrap()">
                    <img src="@/assets/img/icon/baseLayer.svg" alt="">
                </div>
            </li>
            <li class="me-4 position-relative">
                <button class="border-0 w-100 rounded-4 bg-steel text-white text-center p-2 fw-bold fs-5" @click="props.openLayerSelect()">
                    已選圖層
                </button>
            </li>
            <li class="me-4 position-relative">
                <div class="text-white">
                    <a href="" class="text-white" v-if="props.mapCount === 1" @click.prevent="props.onLayerControl({action:'changeMapCount', value: {qty: 2}})">
                        <img src="@/assets/img/icon/singleWindow.svg" alt="">
                    </a>
                    <a href="" class="text-white" v-if="props.mapCount === 2" @click.prevent="props.onLayerControl({action:'changeMapCount', value: {qty: 1}})">
                        <img src="@/assets/img/icon/doubleWindows.svg" alt="">
                    </a>
                </div>
            </li>
        </ul>
    </div>
</template>

<style lang="sass">
.switchControl
    background: rgba(30, 30, 30, 0.9)
    box-sizing: border-box
    div
        padding:5px
        cursor: pointer
        box-sizing: border-box
    .active
        background: #247BA0
</style>