<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'
import twoDimensional from '../assets/img/icon/twoDimensional.svg'
import threeDimensional from '../assets/img/icon/threeDimensional.svg'
import baseLayer from '../assets/img/icon/baseLayer.svg'
import singleWindow from '../assets/img/icon/singleWindow.svg'
import doubleWindows from '../assets/img/icon/doubleWindows.svg'

export default {
    name: 'LayerControl',
    props: {
        mapStatus: {
            type: Array,
            default: []
        }
    },
    setup(props, { emit }) {
        const state = reactive({
            selectFeature: '',
            toolSwitch: {
                threeDimensionalBtn: false,
                layerConditionBtn: false,
                splitWindowBtn: false,
            },
            // dimensionMapStatus: computed(() => props.mapStatus.find(node => node.name === 'DimensionMap')?.uid),
            dimensionMapStatus: '2D',
            hasLayers: computed(() => props.mapStatus.filter(node => node.name !== 'DimensionMap'))
        })
        function toolSwitch(target) {
            state.selectFeature = target
        }

        function onChangeMapCount(value) {
            emit('onChangeMapCount', value)
        }
        function onMoveTo() {
            emit('onMoveTo')
        }
        function onExampleChange(e) {
            let value = {
                checked: e.target.checked,
                layersName: 'america',
            }
            emit('onMapMode', value)
        }
        function onChangeDimensionMap(value) {
            state.dimensionMapStatus = value
            emit('onChangeDimensionMap', value)
        }
        return {
            props,
            state,
            twoDimensional,
            threeDimensional,
            baseLayer,
            singleWindow,
            doubleWindows,
            toolSwitch,
            onChangeMapCount,
            onChangeDimensionMap,
            onExampleChange,
            onMoveTo
        }
    }
}
</script>

<template>
    <div class="row flex-wrap mx-0">
        <ul class="list-unstyled d-flex align-items-center flex-nowrap">
            <li class="me-4 position-relative">
                <a href="" class="MapFeatureBtn text-white"
                v-if="state.dimensionMapStatus == '2D'"
                @click.prevent="toolSwitch('threeDimensionalBtn'), onChangeDimensionMap('3D')">
                    <img src="../assets/img/icon/twoDimensional.svg" alt="">
                </a>
                <a href="" class="MapFeatureBtn text-white"
                v-if="state.dimensionMapStatus == '3D'"
                @click.prevent="toolSwitch('threeDimensionalBtn'), onChangeDimensionMap('2D')">
                    <img src="../assets/img/icon/threeDimensional.svg" alt="">
                </a>
            </li>
            <li class="me-4 position-relative">
                <a href="" class="MapFeatureBtn text-white" @click.prevent="toolSwitch('layerConditionBtn')">
                    <img src="../assets/img/icon/baseLayer.svg" alt="">
                </a>
                <div class="condition bg-white position-absolute start-0 top-100 mt-2"
                    v-if="state.selectFeature == 'layerConditionBtn'">
                    <div class="p-3">
                        <p>地圖一狀態 {{ state.hasLayers }}</p>
                        <p>1.點擊
                        <div class="text-blue" @click="onMoveTo">前往示範案例</div>
                        </p>
                        <div>
                            <input type="checkbox" name="example" id="example" @change="onExampleChange">
                            <label for="example">2.開啟圖層</label>
                        </div>
                        <p class="">圖層選項</p>
                        <div>
                            <ul>
                                <li><a href="">核心圖層</a></li>
                                <li><a href="">衛星影像</a></li>
                                <li><a href="">航空照片</a></li>
                                <li><a href="">核心圖層 </a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </li>
            <li class="me-4 position-relative">
                <a href="" class="MapFeatureBtn text-white" @click.prevent="toolSwitch('splitWindowBtn')">
                    <img src="../assets/img/icon/singleWindow.svg" alt="">
                </a>
                <ul class="list-unstyled position-absolute start-0 top-100 p-0"
                    v-if="state.selectFeature == 'splitWindowBtn'">
                    <li class="mt-2">
                        <a href="" class="text-white MapFeatureBtn" @click.prevent="onChangeMapCount(1)">
                            <img src="../assets/img/icon/singleWindow.svg" alt="">
                        </a>
                    </li>
                    <li class="mt-2">
                        <a href="" class="text-white MapFeatureBtn" @click.prevent="onChangeMapCount(2)">
                            <img src="../assets/img/icon/doubleWindows.svg" alt="">
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<style lang="sass" scoped>
@import '../assets/styles/all.module.scss'
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
.condition
    width: 500px
    // height: 500px


</style>
