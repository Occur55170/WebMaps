<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'
import { useStore } from 'vuex'

import { Map, View, Feature } from 'ol'
import XYZ from 'ol/source/XYZ'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import WMTS from 'ol/source/WMTS'
import TilegridWMTS from 'ol/tilegrid/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS.js'
import {get as getProjection} from 'ol/proj.js'
import {getTopLeft, getWidth} from 'ol/extent.js'
import Select from 'ol/interaction/Select'
import { click } from 'ol/events/condition'
import { ScaleLine } from 'ol/control.js'
import VectorSource from 'ol/source/Vector.js'
import { Point } from 'ol/geom.js'
import { Icon, Style } from 'ol/style.js'

import OLCesium from 'olcs/OLCesium.js'

import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'
import Overlay from 'ol/Overlay.js'
import currentPositionImg from '@/assets/img/icon/currentPosition.svg'

import mapLayerList from '@/config/mapLayerList'
import baseMapList, { getBaseMapAll } from '@/config/baseMapList'

export default {
    props: {},
    setup(props, { emit }) {
        const getMapLayers = mapLayerList
        const baseMaps = baseMapList
        const store = useStore()
        const state = reactive({
            // defaultCenter: [120.971859, 24.801583],
            // defaultCenterZoom: 14,
            defaultCenter: [121.326776, 24.655499],
            defaultCenterZoom: 14,
            targetNum: 1,
            conditionWrap: false,
            layerSelect: false,
            currentLayers: [],
            layers: [],
            mapLayers: computed(() => {
                const result = state.layers.map((node, index) => {
                    return {
                        label: node.group_title,
                        value: node.value,
                        layers: node.group_layers,
                        groupClass: node.group_class
                    }
                })
                console.log(result)
                return result
            }),
            selectLock: false,
            mapCount: 1,
            map1: null,
            map2: null,
            map1LayerStatus: [],
            map2LayerStatus: [],
            temp: {
                map1BaseStatus: 0,
                map2BaseStatus: 0,
            },
            deleteLightbox: false,
            // 目前地圖狀態為2D or 3D
            dimensionMap: {
                map1: '2D',
                map2: '2D'
            },
            toSearchDimensionStatus: computed(() => {
                let target = state.targetNum == 1 ? 'map1' : 'map2'
                return state.dimensionMap[target] === '2D'
            }),
            ol3d: null,
            selectValueTemp: 0,
            popup: {
                nodeRef: null,
                overlay: null,
                popupId: 0,
                coordinate: [],
                popupData: '',
            },
            comSize: {
                wrapHeight: '',
                wrapWidth: '',
            },
            tribeQuery: {},
        })

        let ol3d = null

        const defaultView = new View({
            projection: 'EPSG:4326',
            center: state.defaultCenter,
            zoom: state.defaultCenterZoom,
        })

        // 初始化地圖
        function initMap() {
            const projection = getProjection('EPSG:3857');
            const projectionExtent = projection.getExtent();
            const size = getWidth(projectionExtent) / 256;
            const resolutions = new Array(19);
            const matrixIds = new Array(19);
            for (let z = 0; z < 19; ++z) {
                resolutions[z] = size / Math.pow(2, z);
                matrixIds[z] = z;
            }
            console.log(123)

            state.map1 = new Map({
                target: 'map1',
                layers: [
                    baseMapList.getBaseMapData(0),
                    // new TileLayer({
                    //     opacity: 0.7,
                    //     source: new WMTS({
                    //         url: 'https://mrdata.usgs.gov/mapcache/wmts',
                    //         layer: 'sgmc2',
                    //         matrixSet: 'GoogleMapsCompatible',
                    //         format: 'image/png',
                    //         projection: projection,
                    //         tileGrid: new WMTSTileGrid({
                    //         origin: getTopLeft(projectionExtent),
                    //         resolutions: resolutions,
                    //         matrixIds: matrixIds,
                    //         }),
                    //         style: 'default',
                    //         wrapX: true,
                    //     }),
                    // }),
                ],
                view: defaultView,
                controls: [],
            })

            state.map1.addControl(new ScaleLine({
                units: 'metric', // 比例尺單位
            }));
        }

        function addPoint(targetLng, targetLat) {
            const marker = new Vector({
                source: new VectorSource({
                    features: [
                        new Feature({
                            geometry: new Point([targetLng, targetLat]),
                            population: 4000,
                            rainfall: 500,
                        })
                    ]
                }),
                style: new Style({
                    image: new Icon({
                        anchor: [0.5, 100],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        src: currentPositionImg,
                    }),
                })
            })

            let target = state.targetNum == 1 ? 'map1' : 'map2'
            state[target].addLayer(marker)
        }

        function mapControl({ action, value }) {
            let mainMap = state.map1?.getTarget() == null ? 'map2' : 'map1'
            let View = state[mainMap].getView()
            switch (action) {
                case 'In':
                    View.animate({
                        zoom: View.getZoom() + 1,
                    })
                    break;
                case 'Out':
                    View.animate({
                        zoom: View.getZoom() - 1,
                    })
                    break;
                case 'toNorth':
                    View.animate({
                        rotation: 0,
                    })
                    break;
                case 'moveTo':
                    if (value) {
                        const { xAxis, yAxis } = value
                        View.animate({
                            center: [xAxis, yAxis],
                            zoom: 17,
                            duration: 100,
                        });
                    } else {
                        navigator.geolocation.getCurrentPosition(function (pos) {
                            View.animate({
                                center: [pos.coords.longitude, pos.coords.latitude],
                                zoom: 17,
                                duration: 100,
                            });
                            addPoint(pos.coords.longitude, pos.coords.latitude)
                        })
                    }
                    break;
                case 'fullScreen':
                    let target = document.getElementById(`map${state.targetNum}`)
                    if (target.requestFullscreen) {
                        target.requestFullscreen()
                    } else if (target.msRequestFullscreen) {
                        target.msRequestFullscreen()
                    } else if (target.mozRequestFullScreen) {
                        target.mozRequestFullScreen()
                    } else if (target.webkitRequestFullscreen) {
                        target.webkitRequestFullscreen()
                    }
                    break;
            }
        }

        function layerControl({ action, value }) {
            let target = state.targetNum == 1 ? state.map1 : state.map2
            let targetLayers = target?.getLayers()
            switch (action) {
                case 'layerMode':
                    if (value.checked) {
                        // 避免加到有群組的母層
                        if (!(state.layers[value.nodeIndex].group_layers[value.subNodeIndex].single_tiles)) {
                            let layersAry = targetLayers.getArray()
                            layersAry.forEach(element => {
                                if (!(element.get('id'))) { return }
                                if (element.get('id').includes(`node${value.nodeIndex}_subNode${value.subNodeIndex}_nestedSubNode`)) {
                                    target.removeLayer(element)
                                }
                            })
                            onMapLayerStatus('delete', target.getTarget(), value.id)
                        }
                        let nestedSubNodeIndex = value.nestedSubNodeIndex || state.selectValueTemp
                        let targetLayer = getMapLayers.getLayer(state.layers[value.nodeIndex].group_layers[value.subNodeIndex], nestedSubNodeIndex, value.id)
                        target.addLayer(targetLayer)
                        if (targetLayer.get('label')?.includes('雷達回波預測')) {
                            var source = targetLayer.getSource();
                            var iconFeature = source.getFeatures()[0]
                            const extent = state.layers[value.nodeIndex].group_layers[value.subNodeIndex].image_options.image_extent

                            // TODO: 等待api 確定後切換成api路徑
                            const gifUrl = targetLayer.get('extra').url;
                            const gif = gifler(gifUrl);

                            const extentWidth = extent[2] - extent[0];
                            const extentHeight = extent[3] - extent[1];

                            // 创建一个单独的 Canvas 来处理 GIF 帧
                            const gifCanvas = document.createElement('canvas');
                            let giflerContext = null; // 用于存储 gifler 的上下文

                            gifler(gifUrl).frames(gifCanvas, function (ctx, frame) {
                                // 只在第一次时设置 gifler 的上下文
                                if (!giflerContext) {
                                    giflerContext = ctx;
                                }

                                const scaleX = extentWidth / frame.width;
                                const scaleY = extentHeight / frame.height;
                                const baseScale = Math.min(scaleX, scaleY);

                                const currentResolution = state.map1.getView().getResolution();

                                // 动态样式函数
                                iconFeature.setStyle(function (feature, resolution) {
                                    let scale = baseScale / resolution;
                                    // 你可以根据需要设置一个最小的缩放值，以确保图标在所有分辨率下都可见
                                    scale = Math.max(scale, 0.0000001);

                                    return new Style({
                                        image: new Icon({
                                            img: giflerContext.canvas,
                                            imgSize: [frame.width, frame.height],
                                            opacity: 0.8,
                                            scale: scale
                                        }),
                                    });
                                });

                                    ctx.clearRect(0, 0, frame.width, frame.height);
                                    ctx.drawImage(frame.buffer, frame.x, frame.y);

                                    target.render();
                                },
                                true
                            );
                        }
                        if (['新竹縣原住民部落範圍', '近年歷史災害82處部落點位', '雨量站', '工程鑽探', '土石流潛勢溪流', '落石分布'].includes(targetLayer.get('label'))) {
                            mapClickEvent(target, targetLayer.label)
                            addSelectElement(value)
                        }
                        onMapLayerStatus('add', target.getTarget(), value.id)
                    } else {
                        let layersAry = targetLayers.getArray()
                        function removeLayersById(id) {
                            const toRemoveLayerId = layersAry.filter(element => element?.get('id')?.includes(id));
                            toRemoveLayerId.forEach((node) => {
                                target.removeLayer(node);
                            });
                        }

                        const idMappings = {
                            'node9_subNode0_nestedSubNode': 'node9_subNode0_nestedSubNode',
                            'node12_subNode1_nestedSubNode': 'node12_subNode1_nestedSubNode',
                        };
                        const idToRemove = idMappings[value.id] || value.id;
                        removeLayersById(idToRemove);
                        if (state.layers[value.nodeIndex].group_layers[value.subNodeIndex].layer_type === "WFS") {
                            // FIXME: popup 修改
                            // TODO: 結構優化
                            addSelectElement(value);
                            state.popup.popupId = 0
                            state.popup.popupData = '';
                            if (state.popup.overlay) {
                                target.removeOverlay(state.popup.overlay);
                                state.popup.overlay = null;
                            }
                        }

                        onMapLayerStatus('delete', target.getTarget(), value.id)
                    }
                    break;
                case 'selectLayerMode':
                    if (state.selectLock) { return }
                    if (value.layerName === 'all') {
                        let layersAry = targetLayers.getArray()
                        let layersToRemove = layersAry.filter(node => !(node.get('id') === undefined))
                        layersToRemove.forEach((node) => {
                            target.removeLayer(node)
                        })
                    } else {
                        let layersAry = targetLayers.getArray()
                        layersAry.forEach(element => {
                            if (element.get('id') == value.id) {
                                target.removeLayer(element)
                            }
                        })
                    }
                    break;
                case 'changeOrder':
                    if (state.selectLock) { return }
                    let { nodeIndex, subNodeIndex, nestedSubNodeIndex } = getMapLayers.getLayerIndex(value.id)
                    let nowTileLayer = getMapLayers.getLayer(state.layers[nodeIndex].group_layers[subNodeIndex], nestedSubNodeIndex, value.id)
                    if (value.movement === 'up') {
                        if (value.key + 1 == targetLayers.getArray().length) { return }
                        let obj = {
                            checked: false,
                            nodeIndex: nodeIndex,
                            subNodeIndex: subNodeIndex,
                            nestedSubNodeIndex: nestedSubNodeIndex,
                            id: value.id
                        }
                        layerControl({ action: 'layerMode', value: obj })
                        targetLayers.insertAt(value.key + 1, nowTileLayer)
                    }
                    if (value.movement === 'down') {
                        if (value.key - 1 == 0) { return }
                        let obj = {
                            checked: false,
                            nodeIndex: nodeIndex,
                            subNodeIndex: subNodeIndex,
                            nestedSubNodeIndex: nestedSubNodeIndex,
                            id: value.id
                        }
                        layerControl({ action: 'layerMode', value: obj })
                        targetLayers.insertAt(value.key - 1, nowTileLayer)
                    }
                    break;
                case 'changeLayerVisible':
                    if (state.selectLock) { return }
                    let visibleStatus = !(targetLayers.getArray()[value.key].getVisible())
                    targetLayers.getArray()[value.key].setVisible(visibleStatus)
                    break;
                case 'baseMap':
                    state.temp[`map${state.targetNum}BaseStatus`] = value.baseId
                    let newTileLayer = new Tile({
                        preload: Infinity,
                        name: value.name,
                        label: value.label,
                        type: value.mapType,
                        baseId: value.baseId,
                        source: new XYZ({
                            url: value.url
                        }),
                        crossOrigin: 'anonymous',
                    })
                    let layersAry = target?.getLayers().getArray()
                    targetLayers.insertAt(0, newTileLayer)

                    layersAry.forEach(element => {
                        if (element.get('type') == 'base' && element.get('baseId') !== value.baseId) {
                            target.removeLayer(element)
                        }
                        return true
                    })
                    break;
                case 'changeDimensionMap':
                    let ta = state.targetNum == 1 ? 'map1' : 'map2'
                    state.dimensionMap[ta] = value
                    if (value === '3D') {
                        // 先移除82處部落，後面補回
                        let layersArray = targetLayers.getArray()
                        const layerToRemove = layersArray.find(element => element.get('label').includes('近年歷史災害82處部落點位'))
                        if (layerToRemove) {
                            state[`map${state.targetNum}`].removeLayer(layerToRemove);
                        }
                        ol3d = new OLCesium({
                            map: target,
                        })
                        ol3d.setEnabled(true)
                        Cesium.Ion.defaultAccessToken = import.meta.env.VITE_Ol3D_TOKEN
                        let scene = ol3d.getCesiumScene({})
                        scene.terrainProvider = Cesium.createWorldTerrain({})
                        state[`${ta}LayerStatus`].push('3D')
                    } else {
                        ol3d.setEnabled(false)
                        state[`${ta}LayerStatus`] = state[`${ta}LayerStatus`].filter(node => node !== '3D')
                        state[`map${state.targetNum}LayerStatus`].forEach(node => {
                            let { nodeIndex, subNodeIndex, nestedSubNodeIndex } = getMapLayers.getLayerIndex(node)
                            let nowTileLayer = getMapLayers.getLayer(state.layers[nodeIndex].group_layers[subNodeIndex], nestedSubNodeIndex, value.id)
                            if (nowTileLayer.get('label').includes('近年歷史災害82處部落點位')) {
                                layerControl({
                                    action: 'layerMode', value: {
                                        checked: true,
                                        nodeIndex: nodeIndex,
                                        subNodeIndex: subNodeIndex,
                                        nestedSubNodeIndex: nestedSubNodeIndex,
                                        id: node
                                    }
                                })
                            }
                            return node
                        })
                    }
                    break;
                case 'setOpacity':
                    targetLayers.getArray()[value.key].setOpacity(Number(value.value))
                    break;
            }
            getCurrentMapData()
        }

        function changeMapCount(qty) {
            if (state.mapCount === qty) { return }
            let otherMap = state.targetNum !== 1 ? 'map1' : 'map2'
            state.mapCount = qty
            let otherLayers = state[`${otherMap}LayerStatus`].filter(node => node !== '3D')
            let otherLayersData = otherLayers.map(item => mapLayerList.getLayerIndex(item))
            if (qty === 2) {
                state[otherMap] = new Map({
                    target: otherMap,
                    layers: [
                        baseMapList.getBaseMapData(0),
                        ...otherLayersData.map(node => getMapLayers.getLayer(state.layers[node.nodeIndex].group_layers[node.subNodeIndex], node.nestedSubNodeIndex, node.id))
                    ],
                    view: defaultView,
                    controls: [],
                })
                if (state[`${otherMap}LayerStatus`]?.indexOf('3D') !== -1) {
                    ol3d = new OLCesium({
                        map: state[otherMap],
                    })
                    ol3d.setEnabled(true)
                    Cesium.Ion.defaultAccessToken = import.meta.env.VITE_Ol3D_TOKEN
                    let scene = ol3d.getCesiumScene({})
                    scene.terrainProvider = Cesium.createWorldTerrain({})
                }
            }
            if (qty === 1) {
                state[otherMap] = null
                const element = document.getElementById(otherMap)
                while (element.firstChild) {
                    element.removeChild(element.firstChild)
                }
            }
        }

        function changeTarget(value) {
            state.targetNum = value
            let delToMap = state.targetNum !== 1 ? 'map1' : 'map2'
            if (state.mapCount === 1) {
                // 目標地圖為空
                if (!state[`map${value}`]) {
                    let otherLayers = state[`map${value}LayerStatus`].filter(node => node !== '3D')

                    // TODO: 優化，把node0_subNode4_nestedSubNodeundefined移到最後面
                    if (otherLayers.includes('node0_subNode4_nestedSubNodeundefined')) {
                        let a = otherLayers.filter(node => node !== 'node0_subNode4_nestedSubNodeundefined')
                        otherLayers = [...a, 'node0_subNode4_nestedSubNodeundefined']
                    }

                    let otherLayersData = otherLayers.map(item => mapLayerList.getLayerIndex(item))
                    state[`map${value}`] = new Map({
                        target: `map${value}`,
                        layers: [
                            baseMapList.getBaseMapData(state.temp[`map${state.targetNum}BaseStatus`]),
                            ...otherLayersData.map(node => getMapLayers.getLayer(state.layers[node.nodeIndex].group_layers[node.subNodeIndex], node.nestedSubNodeIndex, node.layeredIndex))
                        ],
                        view: defaultView,
                        controls: [],
                    })

                    mapClickEvent(state[`map${value}`])
                    if (state[`map${value}LayerStatus`]?.indexOf('3D') !== -1) {
                        ol3d = new OLCesium({
                            map: state[`map${value}`],
                        })
                        ol3d.setEnabled(true)
                    }

                }
                // 非目標地圖的刪除
                if (state[delToMap]) {
                    state[delToMap] = null
                    const element = document.getElementById(delToMap)
                    while (element.firstChild) {
                        element.removeChild(element.firstChild)
                    }
                }
            }
            nextTick(() => {
                getCurrentMapData()
            })
        }

        function getCurrentMapData() {
            let target = state.targetNum == 1 ? state.map1 : state.map2
            const layers = target?.getLayers()?.getArray()
            state.currentLayers = layers?.map(layer => {
                return {
                    label: layer.get('label'),
                    id: layer.get('id'),
                    visible: layer.getVisible(),
                }
            })
        }

        function conditionWrap() {
            state.conditionWrap = !state.conditionWrap
        }

        function onMapLayerStatus(action, target, id) {
            if (action === 'add') {
                state[`${target}LayerStatus`].push(id)
            } else if (action === 'delete') {
                let a = state[`${target}LayerStatus`].findIndex(node => node === id)
                state[`${target}LayerStatus`].splice(a, 1)
            } else {
                console.log('error')
            }
        }

        function mapClickEvent(target) {
            let selector = new Select({
                layers: target?.getLayers()?.getArray(),
                condition: click,
            })
            target.addInteraction(selector)
            selector.on('select', (event) => {
                let selectedFeatures = event.selected[0]
                if (selectedFeatures) {
                    state.popup.overlay = new Overlay({
                        element: state.popup.nodeRef,
                        autoPan: true,
                        autoPanAnimation: {
                            duration: 250
                        }
                    })
                    state.popup.overlay.setPosition(event.mapBrowserEvent.coordinate)
                    target.addOverlay(state.popup.overlay)
                    // TODO: 截圖結構修改
                    // TODO: 優化結構，獲取state.popupId.overlay方式修正，考慮整包selectedFeatures放進去
                    // selectedFeatures.getKeys().forEach(key => console.log(`${key} -> ${selectedFeatures.get(key)}`))

                    let selectIds = (selectedFeatures.getId() ?? selectedFeatures.getGeometryName()).split('.')

                    console.log('id :' + selectIds[0])
                    state.popup.popupData = selectIds[0]
                    state.popup.coordinate = event.mapBrowserEvent.coordinate
                    if (selectIds[0] === '新竹縣原住民部落範圍') {
                        state.popup.popupId = selectedFeatures.get('編號')
                        return
                    }
                    if (selectIds[0] === '近年歷史災害82處部落點位') {
                        state.popup.popupId = selectIds[1]
                        return
                    }
                    if (selectIds[0] === '雨量站') {
                        state.popup.popupId = selectedFeatures.get('Name')
                        return
                    }
                    if (selectIds[0] === '工程鑽探') {
                        console.log('選到工程鑽探')
                        state.popup.popupId = selectedFeatures.get('name').split('_')[0]
                        return
                    }
                    if (selectIds[0] === '土石流潛勢溪流') {
                        state.popup.popupId = selectedFeatures.get('ID')
                        state.popup.temp = selectedFeatures
                        return
                    }
                    if (selectIds[0] === '落石分布') {
                        state.popup.popupId = selectedFeatures.get('DATA_ID')
                        state.popup.temp = selectedFeatures
                        return
                    }
                } else {
                    target.removeOverlay(state.popup.overlay)
                    state.popup.overlay = null
                    state.popup = {
                        nodeRef: null,
                        overlay: null,
                        popupId: 0,
                        coordinate: [],
                        popupData: '',
                    }
                }
            })
        }

        function closeAreaData() {
            let target = state.targetNum == 1 ? state.map1 : state.map2
            target.removeOverlay(state.popup.overlay)
            state.popup.overlay = null
        }

        // TODO: 優化 移除id判斷?
        function addSelectElement(value) {
            const { checked, id } = value
            if (!checked) { state.selectLayerOption = {}; return }
            if (id === 'node4_subNode0_nestedSubNodeundefined') {
                $.ajax({
                    url: 'https://api.edtest.site/tribeQuery',
                    method: 'GET',
                    success: (res) => {
                        state.tribeQuery = res
                    },
                    error: (res) => {
                        console.log(res)
                    }
                })
            }
        }

        function moveToMap(val) {
            let obj = {
                action: 'moveTo',
                value: {
                    xAxis: val.WGS84.lng,
                    yAxis: val.WGS84.lat
                }
            }
            mapControl(obj)
        }

        onMounted(async () => {
            let getBaseData = $.ajax({
                url: 'https://api.edtest.site/underLayers',
                method: 'GET',
            }).done(res => {
                return res
            })

            let getLayerData = $.ajax({
                url: 'https://api.edtest.site/layers',
                method: 'GET',
            }).done(res => {
                return res
            })

            Promise.all([getBaseData, getLayerData]).then((value) => {
                // TODO: 優化
                let result = value[0].data.map((node, nodeIndex) => {
                    return {
                        mapType: 'base',
                        baseId: nodeIndex,
                        onCurrent: false,
                        ...node
                    }
                })
                baseMapList.setBaseMapData(result)
                state.temp.map1BaseStatus = 0
                state.temp.baseMapList = getBaseMapAll()

                state.layers = value[1].map((node, index) => {
                    node.group_layers.forEach((sub, subIndex) => {
                        let subNodeIndex = subIndex, nestedSubNodeIndex = undefined
                        sub.id = `node${index}_subNode${subNodeIndex}_nestedSubNode${nestedSubNodeIndex}`

                        if (!(sub.single_tiles)) {
                            sub.tiles_list.forEach((nestedSub, nestedSubIndex) => {
                                nestedSubNodeIndex = nestedSubIndex
                                nestedSub.id = `node${index}_subNode${subNodeIndex}_nestedSubNode${nestedSubNodeIndex}`
                            })
                        }
                    })
                    return {
                        ...node,
                        value: index,
                    }
                })

                nextTick(() => {
                    initMap()
                    getCurrentMapData()
                })
            })
            state.comSize.wrapHeight = window.innerHeight
            state.comSize.wrapWidth = window.innerWidth
            store.dispatch('updateWindowWidth', window.innerWidth)
            window.onresize = (e) => {
                state.comSize.wrapHeight = e.target.innerHeight
                state.comSize.wrapWidth = e.target.innerWidth
                store.dispatch('updateWindowWidth', window.innerWidth)
            }
        })

        return {
            state,
            props,
            store,
            mapControl,
            layerControl,
            changeTarget,
            conditionWrap,
            closeAreaData,
            moveToMap,
            changeMapCount,
        }
    }
}
</script>

<template>
    <div>
        <!-- TODO: 寬度設定是否調整 -->
        <div class="w-100 d-flex justify-content-between flex-sm-row flex-wrap flex-sm-nowrap mapWrap" id="mapWrap">
            <div id="map1" :class="{
                'w-100': state.map1?.getTarget() == 'map1',
                'h-100': state.mapCount === 1,
                'h-50': state.mapCount === 2 && (state.comSize.wrapWidth < 600),
                'middleMap': state.map1?.getTarget()
            }">
            </div>
            <div class="middleLine" v-if="state.mapCount === 2"></div>
            <div id="map2" :class="{
                'w-100': state.map2?.getTarget() == 'map2',
                'h-100': state.mapCount === 1,
                'h-50': state.mapCount === 2 && (state.comSize.wrapWidth < 600),
                'middleMap': state.map2?.getTarget()
            }">
            </div>
        </div>
        <asideTool class="asideTool position-absolute top-50 translate-middle-y" id="asideTool"
            :onChangeTarget="(value) => { changeTarget(value) }"
            @onMapControl="({ action, value }) => { mapControl({ action, value }) }" />

        <div class="SearchBar d-block d-sm-block position-fixed w-100 w-sm-auto position-sm-absolute p-3 p-sm-0">
            <div class="d-flex align-items-center justify-content-between justify-content-sm-start">
                <img src="@/assets/logo.svg" alt="" class="logo col-5 col-sm-auto me-0 me-sm-5">
                <mapSourceOption class="mapSourceOption col-5 col-sm-auto d-block d-sm-block"
                :baseMapList="state.temp.baseMapList"
                :onChangeBaseMaps="({ action, value }) => {
                    layerControl({ action, value })
                }" />
            </div>
            <SearchBar class="mt-4 d-none d-sm-block" v-bind="{
                dimensionMapStatus: state.toSearchDimensionStatus,
                currentLayers: state.currentLayers,
                mapCount: state.mapCount,
                onChangeBaseMaps: ({ action, value }) => {
                    layerControl({ action, value })
                },
                onChangeMapCount: (qty) => {
                    changeMapCount(qty)
                }
            }"
            @onLayerControl="({ action, value }) => {
                layerControl({action, value})
            }"
            @conditionWrap="(value) => {
                conditionWrap(value)
            }" />
        </div>

        <div class="conditionCom d-none d-sm-block position-absolute">
            <div class="mb-4">
                <button class="border-0 w-100 rounded-4 bg-steel text-white text-center p-2 fw-bold fs-5"
                    v-if="!state.conditionWrap" @click="state.conditionWrap = true">
                    圖層選項
                </button>
                <div class="mb-4" v-if="state.conditionWrap">
                    <Condition v-bind="{
                        tribeQuery: state.tribeQuery,
                        mapLayers: state.mapLayers,
                        currentLayers: state.currentLayers,
                        onClose: () => {
                            state.conditionWrap = false
                        },
                        showSelectLayerValue: (val) => {
                            state.selectValueTemp = val
                        },
                        moveToMap: (val) => {
                            moveToMap(val)
                        }
                    }"
                    @onLayerControl="({ action, value }) => { layerControl({ action, value }) }" />
                </div>
                <OverLayer :text="'可選擇要加入的圖層'" :styles="'right: 105%;top: 0;text-align: right;'" />
            </div>

            <div>
                <button class="border-0 w-100 rounded-4 bg-steel text-white text-center p-2 fw-bold fs-5"
                    v-if="!state.layerSelect" @click="state.layerSelect = true">
                    已選擇的圖層
                </button>
                <div v-if="state.layerSelect">
                    <LayerSelector v-bind="{
                        selectLock: state.selectLock,
                        currentLayers: state.currentLayers,
                        onClose: () => {
                            state.layerSelect = false
                        },
                        onLockLayer: () => {
                            state.selectLock = !state.selectLock
                        },
                        onDeleteLayer: ({ action, value }) => {
                            if (value.layerName == 'all') {
                                state.deleteLightbox = true
                            } else {
                                layerControl({ action, value })
                            }
                        },
                        onDeleteLayerAll: () => {
                            state.deleteLightbox = true
                        },
                        onLayerControl: ({ action, value }) => {
                            layerControl({ action, value })
                        },
                    }" />
                </div>
                <OverLayer :text="'顯示已經選擇的圖層'" :styles="'right: 105%;top: 0;text-align: right;'" />
            </div>
        </div>

        <div class="m-Navbar d-flex d-sm-none position-relative w-100">
            <div class="position-absolute bottom-100 w-100" style="max-height: 70vh;overflow-y: scroll;">
                <Condition class="w-100" v-if="state.conditionWrap" v-bind="{
                    mapLayers: state.mapLayers,
                    currentLayers: state.currentLayers,
                    onClose: () => {
                        state.conditionWrap = false
                    },
                    showSelectLayerValue: (val) => {
                        state.selectValueTemp = val
                    }
                }" @onLayerControl="({ action, value }) => { layerControl({ action, value }) }" />
            </div>
            <div v-if="state.layerSelect">
                <LayerSelector class="position-absolute bottom-100 w-100" v-bind="{
                    selectLock: state.selectLock,
                    currentLayers: state.currentLayers,
                    onClose: () => {
                        state.layerSelect = false
                    },
                    onLockLayer: () => {
                        state.selectLock = !state.selectLock
                    },
                    onDeleteLayer: ({ action, value }) => {
                        if (value.layerName == 'all') {
                            state.deleteLightbox = true
                        } else {
                            layerControl({ action, value })
                        }
                    },
                    onDeleteLayerAll: () => {
                        state.deleteLightbox = true
                    },
                    onChangLayerVisible: (action) => {
                        layerControl(action)
                    },
                    onChangeOrderLayer: ({ action, value }) => {
                        layerControl({ action, value })
                    },
                    onLayerControl: ({ action, value }) => {
                        layerControl({ action, value })
                    },
                }" />
            </div>
            <mNavbar v-bind="{
                dimensionMapStatus: state.toSearchDimensionStatus,
                currentLayers: state.currentLayers,
                mapCount: state.mapCount,
                openConditionWrap: () => {
                    state.conditionWrap = !state.conditionWrap
                    state.layerSelect = false
                },
                openLayerSelect: () => {
                    state.layerSelect = !state.layerSelect
                    state.conditionWrap = false
                },
                onLayerControl: ({ action, value }) => {
                    layerControl({ action, value })
                },
                onChangeMapCount: (qty) => {
                    changeMapCount(qty)
                },
                onChangeTarget: (value) => {
                    changeTarget(value)
                }
            }" @conditionWrap="(value) => { conditionWrap(value) }" />
        </div>

        <div class="lightWrap w-100 h-100 d-flex justify-content-center align-items-center" v-if="state.deleteLightbox">
            <div class="p-4 rounded bg-white" style="width: 250px;">
                <p class="text-center fw-bold">是否要取消全部圖層</p>
                <div class=" d-flex justify-content-around">
                    <button class="rounded px-3 py-1 bg-steel text-white border-0" @click="() => {
                        layerControl({
                            action: 'selectLayerMode',
                            value: {
                                layerName: 'all'
                            }
                        })
                        state.deleteLightbox = false
                    }">確定</button>
                    <button class="rounded px-3 py-1 bg-secondary bg-gradient text-white border-0" @click="() => {
                        state.deleteLightbox = false
                    }">取消</button>
                </div>
            </div>
        </div>

        <div id="popup" class="popup position-absolute bottom-0" :ref="(e) => {
            state.popup.nodeRef = e
        }">
            <areaData class="areaData" v-if="state.popup.popupId !== 0" :closeAreaData="() => {
                closeAreaData()
            }" :popup="state.popup" :maxHeight="500" />
        </div>

        <div class="stepOverLayer position-absolute top-0 start-0 w-100 h-100 bg-black opacity-50" id="firstEnter"
            v-if="store.state.isInit" @click="() => {
                store.dispatch('updateLayerStatus', false)
            }"></div>
    </div>
</template>

<style lang="sass">
@import '@/assets/styles/all.module.scss'
.mapWrap
    height: 100vh
.mapWrap .ol-viewport
    height: 100vh
    width: 100vw
.asideTool
    z-index: 220
    left: 20px
.SearchBar
    top: 20px
    left: 20px
    z-index: 220
.conditionCom
    width: 480px
    right: 1%
    bottom: 5%
.middleLine
    width: 5px
    background: $blue-steel
.popup
    z-index: 9999
.areaData
    width: 450px
    max-height: 550px
    background: #fff
    box-sizing: border-box
    border-radius: 10px
    border: 1px solid #088
.middleMap
    position: relative
    &::after
        content: ''
        position: absolute
        display: block
        border: 2px solid #000
        width: 40px
        height: 40px
        top: calc((100% - 40px)/2)
        left: calc((100% - 40px)/2)
@media (max-width: 600px)
    .mapWrap
        height: 92vh
    .m-Navbar
        z-index: 222
    .SearchBar
        top: 0
        left: 0
        .logo
            width: 180px

    .asideTool
        left: 5px
    .middleLine
        height: 1px
        width: 100%
    .areaData
        width: 85vw
</style>
