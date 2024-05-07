<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'

import mapLayerList from '@/config/mapLayerList'
import baseMapList from '@/config/baseMapList'
import VectorImageLayer from 'ol/layer/VectorImage.js'
import TileState from 'ol/TileState.js'
import { useRouter } from 'vue-router'
import { isEmpty } from '@/methods.js'

import 'ol-ext/dist/ol-ext.css'

export default {
    props: {
        onClose: {
            type: Function,
            default: () => { }
        },
        mapLayers: {
            type: Array,
            default: []
        },
        currentLayers: {
            type: Array,
            default: []
        },
        showSelectLayerValue: {
            type: Function,
            default: () => { }
        },
        tribeQuery: {
            type: Object,
            default: {}
        },
        moveToMap: {
            type: Function,
            default: () => { }
        }
    },
    setup(props, { emit }) {
        const router = useRouter()
        const state = reactive({
            DropDown: null,
            TilesListValue: 0,
            conditionYear: '',
            conditionTown: '',
            selectLayerOption: []
        })

        function onLayerControl(action, value) {
            emit('onLayerControl', { action, value })
        }

        function openLayerList(value) {
            if (state.DropDown !== value) {
                state.DropDown = value
            } else {
                state.DropDown = null
            }
        }

        function LayerCheckBoxChange(e, item) {
            let checked = item.elementSource === 'input' ? e.target.checked : true
            let nodeIndex= item.nodeIndex
            let subNodeIndex= item.subNodeIndex
            let nestedSubNodeIndex = !isEmpty(item.nestedSubNodeIndex) ? item.nestedSubNodeIndex : undefined
            let id = (item.single_tiles || !(e.target.selectedOptions)) ? item.id : e.target.selectedOptions[0].id
            onLayerControl('layerMode', {
                checked,
                nodeIndex,
                subNodeIndex,
                nestedSubNodeIndex,
                // 判斷是否有子層即是勾選的還是下拉
                id
            })
        }

        async function getTribes() {
            const result = await $.ajax(`https://api.edtest.site/tribes?${'years=' + state.conditionYear}&${'township=' + state.conditionTown}`, 'GET')
            state.selectLayerOption = result
        }

        function tribeYear(event) {
            state.conditionYear = event.target.value
            getTribes()
        }

        function tribeTown(event) {
            if(event.target.value !== 'false') {
                state.conditionTown = event.target.value
                getTribes()
            }
        }

        function moveMap(params) {
            if(params.target.value !== 'false') {
                let selectValue = state.selectLayerOption.find(node => node.tribeCode == params.target.value)
                props.moveToMap(selectValue.coordinates)
            }
        }

        function isChecked(subNodeId){
            let anchorStr = subNodeId.replace(/undefined$/, "0")
            return props.currentLayers.some(node => node.id === subNodeId || node.id == anchorStr)
        }

        watch(() => state.TilesListValue, (newVal, oldVal) => {
            props.showSelectLayerValue(newVal)
        })

        return {
            props,
            state,
            router,
            mapLayerList,
            onLayerControl,
            openLayerList,
            LayerCheckBoxChange,
            tribeYear,
            tribeTown,
            moveMap,
            isChecked
        }
    }
}
</script>

<template>
    <div class="condition bg-white">
        <div class="row mx-0 align-items-center flex-nowrap text-center p-2 fw-bold border-bottom">
            <p class="mb-0 fs-5">圖層選項</p>
            <a href="#" class="closeBtn bg-dark text-decoration-none rounded-circle position-absolute d-flex align-items-center justify-content-center"
            @click.prevent="props.onClose"></a>
        </div>
        <div class="py-3 px-4 content" style="max-height: 40vh;overflow-y: scroll;">
            <div class="mb-2 landBoundary">
                <div v-for="(node, nodeIndex) in props.mapLayers" class="mb-2">
                    <div class="title d-flex align-items-center fw-bold text-black order-1 mb-1 text-decoration-none"
                        @click="openLayerList(nodeIndex)">
                        <div :class="node.groupClass"></div>
                        <div>{{ node.label }}</div>
                        <svg viewBox="0 0 24 24" :class="{ 'openTitle': state.DropDown == nodeIndex }">
                            <path fill="currentColor" d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <div class="ms-3 my-2"
                    v-for="(subNode, subNodeIndex) in node.layers"
                    v-if="state.DropDown == nodeIndex">
                        <div class="d-flex flex-wrap" v-if="subNode.single_tiles && subNode.info_box == null">
                            <input type="checkbox" class="me-2"
                            :id="subNode.id"
                            :checked="isChecked(subNode.id)"
                            @change="(e) => {
                                LayerCheckBoxChange(e, {
                                    nodeIndex: nodeIndex,
                                    subNode: subNode,
                                    subNodeIndex: subNodeIndex,
                                    nestedSubNodeIndex: '',
                                    single_tiles: subNode.single_tiles,
                                    elementSource: 'input',
                                    id: subNode.id
                                })
                            }" />
                            <label :for="subNode.id">
                                <span class="me-2">
                                    {{ subNode.title }}
                                </span>
                                <img alt="" :src="subNode.icon" v-if="subNode.icon">
                            </label>
                            <div v-if="subNode.title === '新竹縣原住民部落範圍'" class="w-100">
                                <select class="me-2" placeholder="請選擇年度" v-if="props.tribeQuery['years'] !== undefined"
                                    @change="tribeYear">
                                    <option :value="item" v-for="(item, key) in props.tribeQuery['years']">
                                        {{ item }}
                                    </option>
                                </select>
                                <select class="me-2" placeholder="請選擇鄉鎮"
                                    v-if="props.tribeQuery['township'] !== undefined"
                                    @change="tribeTown">
                                    <option :value="false">請選擇</option>
                                    <option :value="item" v-for="(item, key) in props.tribeQuery['township']">
                                        {{ item }}
                                    </option>
                                </select>
                                <select class="me-2" v-if="state.selectLayerOption.length !== 0" @change="moveMap">
                                    <option :value="false">請選擇</option>
                                    <option :value="item.tribeCode" v-for="(item, key) in state.selectLayerOption">
                                        {{ item.tribeName }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div v-else>
                            <div class="my-2">
                                <input type="checkbox"
                                :checked="props.currentLayers.some(node => {
                                    let subNodeIds = mapLayerList.getLayerIndex(node.id)
                                    return subNodeIds.nodeIndex == nodeIndex && subNodeIds.subNodeIndex == subNodeIndex
                                })"
                                @change="(e) => {
                                    LayerCheckBoxChange(e, {
                                        nodeIndex: nodeIndex,
                                        subNode: subNode,
                                        subNodeIndex: subNodeIndex,
                                        nestedSubNodeIndex: '',
                                        single_tiles: true,
                                        elementSource: 'input',
                                        id: subNode.id
                                    })
                                }">
                                {{ subNode.title }}
                                <select name="" id="" class="mx-2" v-model="state.TilesListValue"
                                    v-if="subNode.tiles_list != null" @change="(e) => {
                                        LayerCheckBoxChange(e, {
                                            nodeIndex: nodeIndex,
                                            subNode: subNode,
                                            subNodeIndex: subNodeIndex,
                                            nestedSubNodeIndex: state.TilesListValue,
                                            single_tiles: subNode.single_tiles,
                                            elementSource: 'select',
                                            id: subNode.id,
                                        })
                                    }">
                                    <option :value="key" :id="item.id"
                                    v-for="(item, key) in subNode.tiles_list"
                                    v-bind:key="key">{{ item.title }}</option>
                                </select>
                            </div>
                            <div class="d-flex flex-wrap px-2 pt-1" style="background: #f4f4f4;">
                                <span class="me-2 d-flex flex-wrap align-items-center mb-1"
                                    v-for="(iconSrc) in subNode.info_box.items_group" v-bind:key="iconSrc">
                                    <img :src="iconSrc.icon" alt="" class="me-1" v-if="iconSrc.icon">
                                    <span class="fw-bold">{{ iconSrc.text }}</span>
                                </span>
                            </div>
                        </div>

                        <!-- TODO 修改樣式 -->
                        <div class="d-flex flex-wrap px-2 pt-1" style="background: #f4f4f4;" v-if="subNode.legend">
                            <a class="me-1" :href="subNode.legend" target="_blank" style="text-decoration: none; color: #a87777;">圖例連結</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.condition
    border-radius: 10px
.closeBtn
    right:10px
    width: 20px
    height: 20px
    padding: 0
    &::after
        content: ''
        background: #fff
        height: 2px
        width: 60%
        display: block
.content
    overflow-y: scroll
    background: #fff
    .landBoundary
        max-height: 500px
    .title
        cursor: pointer
        svg
            transform: rotateZ(0)
        .openTitle
            transform: rotateZ(90deg)
    svg
        width: 20px
        height: 20px
    img
        width: 16px
        height: 16px
    .wrap
        display: none
@media (max-width: 600px)
    .condition
        border-radius: 0

</style>