<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'

export default {
    props: {
        currentLayers: {
            type: Array,
            default: []
        }
    },
    setup(props, { emit }) {
        const state = reactive({
            toolSwitch: {
                threeDimensionalBtn: false,
                layerConditionBtn: false,
                splitWindowBtn: false,
            },
            targetNum: 1,
            dimensionMapStatus: '2D',
            switchControl: false,
        })

        function toolSwitch(target, value) {
            if (target === 'threeDimensionalBtn') { state.dimensionMapStatus = value }
            Object.keys(state.toolSwitch).forEach(node => {
                if (node === target) {
                    state.toolSwitch[target] = true
                } else {
                    state.toolSwitch[node] = false
                }
            })
        }
        function onLayerControl(action, value) {
            if (action === 'changeMapCount') {
                if (value == 1 && document.getElementById('switchControl')) {
                    state.targetNum = 1
                    state.switchControl = false
                    emit('onLayerControl', { action, value })
                }
                if (value == 2 && !(document.getElementById('switchControl'))) {
                    state.switchControl = true
                }
            }
            emit('onLayerControl', { action, value })
        }

        function conditionWrap() {
            emit('conditionWrap')
        }

        function onChangeTarget(value) {
            state.targetNum = value
            emit('onChangeTarget', value)
        }

        return {
            props,
            state,
            toolSwitch,
            onLayerControl,
            conditionWrap,
            onChangeTarget
        }
    }
}
</script>

<template>
    <div>
        <ul class="list-unstyled d-flex align-items-center flex-nowrap">
            <li class="me-4 position-relative">
                <div class="MapFeatureBtn text-white">
                    <a href="" v-if="props.currentLayers.findIndex(node=>node.name === 'OSM') == -1"
                    @click.prevent="toolSwitch('threeDimensionalBtn', '3D'), onLayerControl('changeDimensionMap', '3D')">
                        <img src="../assets/img/icon/twoDimensional.svg">
                    </a>
                    <a href="" v-else
                    @click.prevent="toolSwitch('threeDimensionalBtn', '2D'), onLayerControl('changeDimensionMap', '2D')">
                        <img src="../assets/img/icon/threeDimensional.svg">
                    </a>
                </div>
            </li>
            <li class="me-4 position-relative">
                <a href="" class="MapFeatureBtn text-white"
                    @click.prevent="toolSwitch('layerConditionBtn'), conditionWrap()">
                    <img src="../assets/img/icon/baseLayer.svg" alt="">
                </a>
            </li>
            <li class="me-4 position-relative">
                <a href="" class="MapFeatureBtn text-white" @click.prevent="toolSwitch('splitWindowBtn')">
                    <img src="../assets/img/icon/singleWindow.svg" alt="">
                </a>
                <ul class="list-unstyled position-absolute start-0 top-100 p-0" v-if="state.toolSwitch.splitWindowBtn">
                    <li class="mt-2">
                        <a href="" class="text-white MapFeatureBtn" @click.prevent="onLayerControl('changeMapCount', 1)">
                            <img src="../assets/img/icon/singleWindow.svg" alt="">
                        </a>
                    </li>
                    <li class="mt-2">
                        <a href="" class="text-white MapFeatureBtn" @click.prevent="onLayerControl('changeMapCount', 2)">
                            <img src="../assets/img/icon/doubleWindows.svg" alt="">
                        </a>
                    </li>
                </ul>
            </li>
        </ul>

        <div class="switchControl d-flex position-fixed rounded-pill translate-middle-x p-2" id="switchControl"
            v-if="state.switchControl" style="z-index: 99;">
            <div class="fs-3 text-white rounded-pill" :class="{ 'active': state.targetNum === 1 }" @click="() => {
                onChangeTarget(1)
            }">左</div>
            <div class="fs-3 text-white rounded-pill" :class="{ 'active': state.targetNum === 2 }" @click="() => {
                onChangeTarget(2)
            }">右</div>
        </div>
    </div>
</template>

<style lang="sass">
.MapFeatureBtn
    display: block
    border-radius: 10px
    width: 68px
    height: 68px
    box-sizing: border-box
    img
        width: 100%
        height: 100%
        &:hover
            filter: brightness(0.5)
    svg
        font-size: 24px
        width: 100%
        height: 100%

.switchControl
    top: 10px
    left: 50%
    background: rgba(30, 30, 30, 0.9)
    box-sizing: border-box
    div
        padding:5px 28px
        cursor: pointer
        box-sizing: border-box
    .active
        background: #247BA0

</style>