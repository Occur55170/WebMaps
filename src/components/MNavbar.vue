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
        onChangeMapCount: {
            type: Function,
            default: ()=>{}
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

        // TODO: 手機板打開燈箱點擊燈箱外關閉

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
        <!-- <div class="position-fixed top-0 w-100 px-3 mt-3 d-flex justify-content-between justify-content-sm-end flex-wrap"> -->
            <!-- <img src="@/assets/logo.svg" class="w-50 w-lg-100"> -->
            <!-- <mapSourceOption class="mapSourceOption d-none d-sm-block"
                :baseMapList="state.temp.baseMapList"
                :onChangeBaseMaps="({ action, value }) => {
                    layerControl({ action, value })
                }" /> -->
        <!-- </div> -->

        <ul class="list-unstyled d-flex align-items-center justify-content-around py-2 flex-nowrap w-100 bg-white mb-0">
            <li>
                <div>
                    <div class="navbarBtn" v-if="props.dimensionMapStatus"
                    @click.prevent="toolSwitch('threeDimensionalBtn'), onLayerControl('changeDimensionMap', '3D')">
                        <img src="@/assets/img/icon/2D-m.svg">
                    </div>
                    <div class="navbarBtn" v-else
                    @click.prevent="toolSwitch('threeDimensionalBtn'), onLayerControl('changeDimensionMap', '2D')">
                        <img src="@/assets/img/icon/3D-m.svg">
                    </div>
                </div>
            </li>
            <li>
                <div class="navbarBtn" @click="props.openConditionWrap()">
                    <img src="@/assets/img/icon/vector-m.svg">
                </div>
            </li>
            <li>
                <div class="navbarBtn" @click="props.openLayerSelect()">
                    <img src="@/assets/img/icon/selectVector-m.svg">
                </div>
            </li>
            <li>
                <div class="text-white">
                    <div class="navbarBtn" v-if="props.mapCount === 1" @click.prevent="props.onChangeMapCount(2)">
                        <img src="@/assets/img/icon/singleWindow-m.svg">
                    </div>
                    <div class="navbarBtn" v-if="props.mapCount === 2" @click.prevent="props.onChangeMapCount(1)">
                        <img src="@/assets/img/icon/doubleWindow-m.svg">
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style lang="sass">
ul
    li
        .navbarBtn
            width: 60px
            height: 60px
            img
                width: 100%
                height: 100%
        &:nth-Child(1) .navbarBtn, &:nth-Child(4) .navbarBtn
            width: 50px
            height: 50px
</style>