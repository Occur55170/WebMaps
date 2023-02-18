<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'


export default {
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const state = reactive({
            CurrentMapLayers: [],
        })

        function showMapStatus() {
            // console.log(proxy.$refs.mapCom.getCurrentMapLayers())
        }
        return {
            state,
            showMapStatus,
        }
    }
}
</script>

<template>
    <div class="position-absolute top-50 translate-middle-y d-flex flex-nowrap flex-column" id="asideTool">
        <div class="asideTool-btn order-1 mb-2 bg-white" style="z-index: 999;cursor: pointer;"
        @click="showMapStatus">123</div>
        <div class="asideTool-btn order-1 mb-2 bg-white" style="z-index: 999;cursor: pointer;"
        @click="getCurrentMapLayers()">getCurrentMap</div>
        <div>{{ CurrentMapLayers }}</div>
    </div>
    <div class="main">
        <div v-if="true">
            <!-- <Wes ref="mapCom"
                    :targetNum="state.targetNum"
                /> -->
                <!-- @addMapLayersStatus=""
                @delMapLayersStatus=""
                @getMapLayersStatus="" -->
            <WebMap ref="mapCom" />
        </div>
        <div v-else>
            <threeDimensionMap />
        </div>
    </div>
    <div class="mapSourceOption">
        <mapSourceOption />
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
.mapSourceOption
    position: fixed
    top: 0
    right: 0

.LayoutTool
    position: absolute
    top: 0
    left: 0
    z-index: 220

.asideTool
    z-index: 220
    left: 20px
.SearchBar
    position: absolute
    top: 20px
    left: 20px
    z-index: 220
.condition
    width: 500px
</style>
