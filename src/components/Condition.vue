<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'

import mapLayerList from '@/config/mapLayerList'
import baseMapList from '@/config/baseMapList'
import VectorImageLayer from 'ol/layer/VectorImage.js'
import TileState from 'ol/TileState.js'
import { useRouter } from 'vue-router'


import 'ol-ext/dist/ol-ext.css'

export default {
    props: {
        onClose: {
            type: Function,
            default: () => {}
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
            default: () => {}
        },
        selectLayerOption: {
            type: Object,
            default: {}
        },
        tribeQuery: {
            type: Object,
            default: {}
        },
        moveToMap: {
            type: Function,
            default: () => {}
        }
    },
    setup(props, { emit }) {
        const mapList = mapLayerList
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
            let defaultChecked = item.single_tiles ? e.target.checked : true
            onLayerControl('layerMode', {
                checked: defaultChecked,
                nodeIndex: item.nodeIndex,
                subNodeIndex: item.subNodeIndex,
                nestedSubNodeIndex: String(item.nestedSubNodeIndex) ? item.nestedSubNodeIndex : undefined,
                // 判斷是否有子層即是勾選的還是下拉
                id: (item.single_tiles || !(e.target.selectedOptions)) ? item.id : e.target.selectedOptions[0].id
            })
        }

        function tribeYear(event) {
            state.conditionYear = event.target.value
            getTribes()
        }

        function tribeTown(event) {
            state.conditionTown = event.target.value
            getTribes()
        }

        async function getTribes() {
            const result = await $.ajax(`https://api.edtest.site/tribes?${ 'years=' + state.conditionYear }&${ 'township=' + state.conditionTown }`, 'GET')
            state.selectLayerOption = result
        }

        function moveMap(params) {
            let selectValue = state.selectLayerOption.find(node=>node.tribeCode === params.target.value)
            props.moveToMap(selectValue.coordinates)
        }

        watch(()=>state.TilesListValue, (newVal , oldVal)=>{
            props.showSelectLayerValue(newVal)
        })

        return {
            props,
            state,
            router,
            mapList,
            onLayerControl,
            openLayerList,
            LayerCheckBoxChange,
            tribeYear,
            tribeTown,
            moveMap
        }
    }
}
</script>

<template>
    <div class="condition bg-white">
        <div class="row mx-0 align-items-center flex-nowrap text-center p-2 fw-bold border-bottom">
            <p class="mb-0 fs-5">圖層選項</p>
            <a href="#" class="closeBtn bg-dark text-decoration-none rounded-circle position-absolute d-flex align-items-center justify-content-center" @click.prevent="props.onClose"></a>
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
                    <div class="ms-3 my-2" v-for="(subNode, subNodeIndex) in node.layers" v-if="state.DropDown == nodeIndex">
                        <div v-if="subNode.single_tiles">
                            <input type="checkbox"
                            :id="subNode.id"
                            :checked="props.currentLayers.some(node=> node.id === subNode.id)"
                            @change="(e) => {
                                LayerCheckBoxChange(e, {
                                    nodeIndex: nodeIndex,
                                    subNode: subNode,
                                    subNodeIndex: subNodeIndex,
                                    nestedSubNodeIndex: '',
                                    single_tiles: subNode.single_tiles,
                                    id: subNode.id
                                })
                            }">
                            <label :for="subNode.id">
                                <span class="me-2">
                                    {{ subNode.title }}
                                </span>
                                <img :src="subNode.icon" alt="">
                            </label>
                            <!-- TODO: 優化 -->
                            <div v-if="true">
                                <div v-if="subNode.id === 'node4_subNode0_nestedSubNodeundefined'">
                                    <select class="me-2"
                                    v-if="props.tribeQuery['years'] !== undefined" @change="tribeYear" placeholder="請選擇年度">
                                        <option :value="item" v-for="(item, key) in props.tribeQuery['years']">
                                            {{ item }}
                                        </option>
                                    </select>
                                    <select class="me-2"
                                    v-if="props.tribeQuery['township'] !== undefined" @change="tribeTown" placeholder="請選擇鄉鎮">
                                        <option :value="item" v-for="(item, key) in props.tribeQuery['township']">
                                            {{ item }}
                                        </option>
                                    </select>
                                    <select class="me-2"
                                    v-if="state.selectLayerOption.length !== 0" @change="moveMap">
                                        <option :value="item.tribeCode" v-for="(item, key) in state.selectLayerOption">
                                            {{ item.tribeName }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="my-2">
                                <input type="checkbox"
                                :checked="props.currentLayers.some(node=> {
                                    let subNodeIds = mapList.getLayerIndex(node.id)
                                    return subNodeIds.nodeIndex == nodeIndex && subNodeIds.subNodeIndex == subNodeIndex
                                })"
                                @change="(e) => {
                                    LayerCheckBoxChange(e, {
                                        nodeIndex: nodeIndex,
                                        subNode: subNode,
                                        subNodeIndex: subNodeIndex,
                                        nestedSubNodeIndex: '',
                                        single_tiles: true,
                                        id: subNode.id
                                    })
                                }">
                                    {{ subNode.title }}
                                    <select name="" id="" class="mx-2"
                                    v-model="state.TilesListValue"
                                    @change="(e) => {
                                        LayerCheckBoxChange(e, {
                                            nodeIndex: nodeIndex,
                                            subNode: subNode,
                                            subNodeIndex: subNodeIndex,
                                            nestedSubNodeIndex: state.TilesListValue,
                                            single_tiles: subNode.single_tiles,
                                            id: subNode.id,
                                        })
                                    }">
                                        <option :value="key" :id="item.id" v-for="(item, key) in subNode.tiles_list">{{ item.title }}</option>
                                    </select>
                                    <span class="bg-grey text-white py-1 px-2 rounded">說明</span>
                                </div>
                                <div class="d-flex flex-wrap px-2 pt-1" style="background: #f4f4f4;">
                                    <span  class="me-2 d-flex flex-wrap align-items-center mb-1"
                                    v-for="(iconSrc) in subNode.info_box.items_group">
                                        <img :src="iconSrc.icon" alt="" class="me-1">
                                        <span class="fw-bold">{{ iconSrc.text }}</span>
                                    </span>
                                </div>
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