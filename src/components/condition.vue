<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'

import mapLayerList, { initLayers } from '@/config/mapLayerList'
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
        })

        function onMapControl(action, value) {
            emit('onMapControl', { action, value })
        }

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
            let defaultChecked = e.target.checked || ((typeof e.target.checked == 'undefined') ? true : false )
            onLayerControl('layerMode', {
                checked: defaultChecked,
                nodeIndex: item.nodeIndex,
                subNodeIndex: item.subNodeIndex,
                nestedSubNodeIndex: String(item.nestedSubNodeIndex) ? item.nestedSubNodeIndex : undefined,
                // 判斷是否有子層即是勾選的還是下拉
                id: (item.single_tiles || !(e.target.selectedOptions)) ? item.id : e.target.selectedOptions[0].id
            })
        }

        function checkTribe(e) {
            let defaultChecked = e.target.checked || ((typeof e.target.checked == 'undefined') ? true : false )
            onLayerControl('layerMode', {
                checked: defaultChecked,
            })
        }

        watch(()=>state.TilesListValue, (newVal , oldVal)=>{
            props.showSelectLayerValue(newVal)
        })


        return {
            props,
            state,
            router,
            mapList,
            onMapControl,
            onLayerControl,
            openLayerList,
            LayerCheckBoxChange,
            checkTribe,
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
        <div class="py-3 px-4 content">
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
                    <!-- 1
                    {{ props.tribeQuery }}
                    2
                    {{ props.selectLayerOption }} -->
                    <div class="ms-3 mb-1" v-for="(subNode, subNodeIndex) in node.layers" v-if="state.DropDown == nodeIndex">
                        <div v-if="subNode.single_tiles">
                            <input type="checkbox"
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
                            {{ subNode.title }}
                            <!-- TODO: 優化 -->
                            <div v-if="props.selectLayerOption[subNode.id] !== undefined && subNode.id === 'node4_subNode0_nestedSubNodeundefined'">
                                <select name="" id="" @change="props.moveToMap">
                                    <option :value="key" :data-coordinates="item.tribeCode" v-for="(item, key) in props.selectLayerOption[subNode.id]">
                                        {{ item.tribeName }}
                                    </option>
                                </select>
                            </div>
                            <div v-if="props.selectLayerOption[subNode.id] !== undefined && subNode.id === 'node7_subNode0_nestedSubNodeundefined'">
                                <select name="" id="" @change="props.moveToMap">
                                    <option :value="key" :data-coordinates="item.geometry.coordinates" v-for="(item, key) in props.selectLayerOption[subNode.id]">
                                        {{ item.properties['事件'] }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div v-else>
                            <input type="checkbox"
                            :checked="props.currentLayers.some(node=> {
                                let subNodeIds = mapList.getLayerIndex(node.id)
                                return  subNodeIds.nodeIndex == nodeIndex && subNodeIds.subNodeIndex == subNodeIndex
                            })"
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
                                {{ subNode.title }}
                                <select name="" id="" class="ms-3"
                                v-model="state.TilesListValue"
                                @change="(e) => {
                                    LayerCheckBoxChange(e, {
                                        nodeIndex: nodeIndex,
                                        subNode: subNode,
                                        subNodeIndex: subNodeIndex,
                                        nestedSubNodeIndex: state.TilesListValue,
                                        single_tiles: subNode.single_tiles,
                                        id: subNode.id
                                    })
                                }">
                                    <option :value="key" :id="item.id" v-for="(item, key) in subNode.tiles_list">{{ item.title }}</option>
                                </select>
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