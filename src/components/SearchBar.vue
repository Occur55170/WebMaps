<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
export default {
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
            if(target === 'threeDimensionalBtn') {state.dimensionMapStatus = value}
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
                    // $('.currentMap').removeClass('currentMap')
                }
                if (value == 2 && !(document.getElementById('switchControl'))) {
                    state.switchControl = true
                    // $('.map1').addClass('currentMap')
                }
            }
            // proxy.$refs.mapCom.layerControl(action, value)
            emit('onLayerControl', {action, value})
        }

        function openConditionWrap () {
            emit('openConditionWrap')
        }

        function onChangeTarget (value) {
            state.targetNum = value
            emit('onChangeTarget', value)
        }

        return {
            state,
            toolSwitch,
            onLayerControl,
            openConditionWrap,
            onChangeTarget
        }
    }
}
</script>

<template>
    <div>
        <ul class="list-unstyled d-flex align-items-center flex-nowrap">
            <li class="me-4 position-relative">
                <a href="" class="MapFeatureBtn text-white">
                    <img src="../assets/img/icon/twoDimensional.svg" v-if="state.dimensionMapStatus == '2D'"
                        @click.prevent="toolSwitch('threeDimensionalBtn', '3D'), onLayerControl('changeDimensionMap', '3D')">
                    <img src="../assets/img/icon/threeDimensional.svg" v-else
                        @click.prevent="toolSwitch('threeDimensionalBtn', '2D'), onLayerControl('changeDimensionMap', '2D')">
                </a>
            </li>
            <li class="me-4 position-relative">
                <a href="" class="MapFeatureBtn text-white"
                    @click.prevent="toolSwitch('layerConditionBtn'), openConditionWrap()">
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

        <div class="switchControl d-flex position-fixed rounded-pill translate-middle-x" id="switchControl"
            v-if="state.switchControl" style="z-index: 99;padding: 5px;">
            <div class="fs-3 text-white rounded-pill" :class="{ 'active': state.targetNum === 1 }" @click="() => {
                onChangeTarget(1)
                // $(`.map1`).addClass('currentMap')
                // $(`.map2`).removeClass('currentMap')
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

// 當前選取地圖樣式
.currentMap
    position: relative
    // &::after
    //     content: ''
    //     position: absolute
    //     top: 0
    //     left: 0
    //     width: 100%
    //     height: 100%
    //     border: 5px solid red
    //     box-sizing: border-box
</style>