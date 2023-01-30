<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'

// import WebMap from './components/WebMap.vue'
// import Wes from './components/Wes.vue'
// import LayoutTool from './components/LayoutTool.vue'
// import SearchBar from './components/SearchBar.vue'

// import opp from './components/opp.vue'
// import threeDimensionMap from './components/threeDimensionMap.vue'

import createSwitch, { deleteSwitch } from 'switch-button'

export default {
    data() {
        return {
            count: 1,
            targetNum: 1
        }
    },
    methods: {
        controlMap(action, value) {
            this.$refs.mapCom.controlMap(action, value)
        },
        layerControl(action, value) {
            console.log(action)
            const vm = this
            if(action === 'changeLayouts'){
                if (value == 1 && document.getElementById('switchControl')) {
                    document.getElementById('switchControl').remove()
                }
                if (value == 2 && !(document.getElementById('switchControl'))) {
                    const switchControl = document.createElement('button')
                    switchControl.setAttribute('id', 'switchControl')
                    switchControl.setAttribute('class', 'order-0')
                    document.getElementById('asideTool').appendChild(switchControl)
                    const switchBtn = createSwitch(switchControl, {
                        text: ['左', '右'],
                        onChange: (checked) => {
                            vm.targetNum = Number(!checked ? 1 : 2)
                        },
                    })
                }
            }
            this.$refs.mapCom.layerControl(action, value)
        }
    },
    computed: {
        asideToolPosition() {
            return this.count == 1
        },
    },
    setup(props, { emit }) {
        const state = reactive({
            count: 1,
            math: 0,
            targetMap: 1,
            isMapType: '2D',
        })

        return {
            state,
        }
    }
}
</script>

<template>
    <SearchBar class="SearchBar"
        @onMoveTo="layerControl('moveTo', { xAxis: -96.794027, yAxis: 31.624217 })"
        @onMapMode="(value) => layerControl('mapMode', value)"
        @onChangeLayouts="(value) => layerControl('changeLayouts', value)"
        @onChangeDimensionMap="(value) => layerControl('changeDimensionMap', value)"
    />
    <div class="asideTool position-absolute" id="asideTool"
    :class="{
        'top-50 end-0 translate-middle-y': asideToolPosition,
        'd-flex flex-nowrap top-0 start-50 translate-middle-x align-items-center': !asideToolPosition,
    }">
        <div class="asideTool-btn order-1" @click="controlMap('fullScreen')">全螢幕</div>
        <div class="asideTool-btn order-1" @click="layerControl('moveTo')">定位</div>
        <div class="asideTool-btn order-1" @click="controlMap('In')">放大</div>
        <div class="asideTool-btn order-1" @click="controlMap('Out')">縮小</div>
    </div>

    <div class="main">
        <div v-if="state.isMapType === '2D'">
            <Wes ref="mapCom" :targetNum="targetNum" />
            <!-- <WebMap ref="mapCom"  :targetNum="targetNum" /> -->
        </div>
        <div v-if="state.isMapType === '3D'">
            <threeDimensionMap />
        </div>
    </div>

    <!-- <opp /> -->
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

.SearchBar
    position: absolute
    top: 20px
    left: 20px
    z-index: 220


.LayoutTool
    position: absolute
    top: 0
    left: 0
    z-index: 220
.asideTool
    z-index: 220
</style>
