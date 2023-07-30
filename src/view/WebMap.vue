<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

import { Map, View, Feature } from 'ol'
import Select from 'ol/interaction/Select';
import { click } from 'ol/events/condition';

import { ImageArcGISRest, OSM } from 'ol/source.js'
import TileWMS from 'ol/source/TileWMS'
import { IGC, WFS, } from 'ol/format'
import * as ol from 'ol';
import { TileArcGISRest } from 'ol/source.js'

import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector.js'
import { Icon, Fill, Stroke, Style } from 'ol/style.js'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import ImageWMS from 'ol/source/ImageWMS.js';
import TileGrid from 'ol/layer/Tile.js';

import PerspectiveMap from "ol-ext/map/PerspectiveMap"

import EsriJSON from 'ol/format/EsriJSON.js'
import { createXYZ } from 'ol/tilegrid.js'
import { bbox, tile as tileStrategy } from 'ol/loadingstrategy.js'
import { Circle, Polygon, Point } from 'ol/geom.js'
import Projection from 'ol/proj/Projection.js'
import GeoJSON from 'ol/format/GeoJSON.js'

import OLCesium from 'olcs/OLCesium.js';
import VectorImageLayer from 'ol/layer/VectorImage.js';
import TileState from 'ol/TileState.js';

import 'ol/ol.css'

import mapLayerList from '@/config/mapLayerList'
import baseMapList, { getBaseMapAll } from '@/config/baseMapList'

import 'ol-ext/dist/ol-ext.css'
import * as olTilecoord from 'ol/tilecoord'
import { get as getProjection } from 'ol/proj'
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo.js'
import Overlay from 'ol/Overlay.js'


import { toPng } from "html-to-image";

export default {
    props: {},
    setup(props, { emit }) {
        const getMapLayers = mapLayerList
        const baseMaps = baseMapList
        const state = reactive({
            // defaultCenter: [120.971859, 24.801583],
            // defaultCenterZoom: 14,
            defaultCenter: [121.326776, 24.655499],
            defaultCenterZoom: 9,
            targetNum: 1,
            conditionWrap: false,
            layerSelect: false,
            currentLayers: [],
            layers: [],
            mapLayers: computed(() => {
                return state.layers.map((node, index) => {
                    return {
                        label: node.group_title,
                        value: node.value,
                        layers: node.group_layers,
                        groupClass: node.group_class
                    }
                })
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
            areaData: {
                nodeRef: null,
                overlay: null,
                tribeAreaData: {},
            },
            comSize: {
                wrapHeight: '',
                wrapWidth: '',
                conditionCom: {},
            },
            selectLayerOption: {}
        })

        let ol3d = null

        const defaultView = new View({
            projection: 'EPSG:4326',
            center: state.defaultCenter,
            zoom: state.defaultCenterZoom,
        })

        // 初始化地圖
        function initMap() {
            state.map1 = new Map({
                target: 'map1',
                layers: [
                    baseMapList.getBaseMapData(0)
                ],
                view: defaultView,
                controls: [],
            })

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
                        // FIXME: 圖片連結需修改
                        src: 'https://www.ockert-cnc.de/wp-content/uploads/2016/12/map-marker-icon-100x100.png',
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
                        if (targetLayer.get('label').includes('雷達回波預測')) {
                            var source = targetLayer.getSource();
                            var iconFeature = source.getFeatures()[0]
                            const extent = state.layers[value.nodeIndex].group_layers[value.subNodeIndex].image_options.image_extent

                            const gifUrl = 'http://localhost:5173/Map_Demo/forecast.gif';
                            const gif = gifler(gifUrl);

                            const extentWidth = extent[2] - extent[0];
                            const extentHeight = extent[3] - extent[1];

                            gif.frames(
                                document.createElement('canvas'),
                                function (ctx, frame) {
                                    const scaleX = extentWidth / frame.width;
                                    const scaleY = extentHeight / frame.height;
                                    const baseScale = Math.min(scaleX, scaleY);

                                    // 獲取當前地圖的解析度
                                    const currentResolution = state.map1.getView().getResolution();

                                    iconFeature.setStyle(
                                        new Style({
                                            image: new Icon({
                                                img: ctx.canvas,
                                                imgSize: [frame.width, frame.height],
                                                opacity: 0.8,
                                                scale: baseScale / currentResolution
                                            }),
                                        })
                                    );

                                    ctx.clearRect(0, 0, frame.width, frame.height);
                                    ctx.drawImage(frame.buffer, frame.x, frame.y);

                                    target.render();
                                },
                                true
                            );
                        }

                        if (state.layers[value.nodeIndex].group_layers.some(node => node.layer_type === "WFS")) {
                            // FIXME: 結構優化
                            mapClickEvent(target, value.id)
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
                        // FIXME: 盡量不要抓id
                        if (value.id.includes('node9_subNode0_nestedSubNode')) {
                            removeLayersById('node9_subNode0_nestedSubNode');
                        } else if (value.id.includes('node12_subNode1_nestedSubNode')) {
                            removeLayersById('node12_subNode1_nestedSubNode');
                        } else {
                            const layerToRemove = layersAry.find(element => element.get('id') === value.id);
                            if (layerToRemove) {
                                target.removeLayer(layerToRemove);
                            }
                        }

                        if (state.layers[value.nodeIndex].group_layers.some(node => node.layer_type === "WFS")) {
                            // FIXME: 結構優化
                            addSelectElement(value)

                            state.areaData.tribeAreaData = {}
                            target.removeOverlay(state.areaData.overlay)
                            state.areaData.overlay = null
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
                case 'changeMapCount':
                    if (state.mapCount === value.qty) { return }
                    let otherMap = state.targetNum !== 1 ? 'map1' : 'map2'
                    state.mapCount = value.qty
                    let otherLayers = state[`${otherMap}LayerStatus`].filter(node => node !== '3D')
                    let otherLayersData = otherLayers.map(item => mapLayerList.getLayerIndex(item))
                    if (value.qty === 2) {
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
                    if (value.qty === 1) {
                        state[otherMap] = null
                        const element = document.getElementById(otherMap)
                        while (element.firstChild) {
                            element.removeChild(element.firstChild)
                        }
                    }
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

        function changeTarget(value) {
            state.targetNum = value
            let delToMap = state.targetNum !== 1 ? 'map1' : 'map2'
            if (state.mapCount === 1) {
                // 目標地圖為空
                if (!state[`map${value}`]) {
                    let otherLayers = state[`map${value}LayerStatus`].filter(node => node !== '3D')

                    // TODO: 優化，靶node0_subNode4_nestedSubNodeundefined移到最後面
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

                    // FIXME: 切換3D會有問題跳回平面
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
            console.log(layers)
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

        function mapClickEvent(target, vid = 'node0_subNode4_nestedSubNodeundefined') {
            let selector = new Select({
                layers: target?.getLayers()?.getArray(),
                condition: click
            })
            target.addInteraction(selector)
            selector.on('select', (event) => {
                // TODO: 截圖結構修改
                let selectedFeatures = event.selected
                if (event.selected[0]) {
                    state.areaData.overlay = new Overlay({
                        element: state.areaData.nodeRef,
                        autoPan: true,
                        autoPanAnimation: {
                            duration: 250
                        }
                    });
                    target.addOverlay(state.areaData.overlay);
                    state.areaData.overlay.setPosition(event.mapBrowserEvent.coordinate)
                    // TODO: 重置area小地圖id
                    state.areaData.tribeAreaData = {}
                    // TODO: 優化結構，獲取state.areaData.overlay方式修正，考慮整包selectedFeatures放進去
                    if (selectedFeatures[0].get('編號') === undefined) {
                        state.areaData.tribeAreaData = selectedFeatures[0]
                    } else {
                        selectedFeatures.forEach((feature) => {
                            let properties = feature.getProperties()
                            Object.entries(properties).forEach(node => {
                                const key = node[0], value = node[1]
                                state.areaData.tribeAreaData[key] = value
                            })
                        })
                    }
                } else {
                    state.areaData.tribeAreaData = {}
                    target.removeOverlay(state.areaData.overlay)
                    state.areaData.overlay = null
                }
            })
        }

        function closeMapData() {
            let target = state.targetNum == 1 ? state.map1 : state.map2
            target.removeOverlay(state.areaData.overlay)
            state.areaData.overlay = null
        }

        // FIXME: 優化
        // FIXME: 加入下拉式選單
        function addSelectElement(value) {
            const { checked, id } = value
            if (!checked) { state.selectLayerOption = {}; return }
            if (id === 'node4_subNode0_nestedSubNodeundefined') {
                $.ajax({
                    url: "https://api.edtest.site/tribes",
                    method: 'GET',
                    success: (res) => {
                        state.selectLayerOption[id] = res
                    },
                    error: (res) => {
                        console.log(res)
                    }
                })
            }
            if (id === 'node7_subNode0_nestedSubNodeundefined') {
                $.ajax({
                    url: "https://gis.edtest.site/ogc/temp?VERSION=1.3.0&SERVICE=WFS&REQUEST=GetFeature&OUTPUTFORMAT=application/json&TYPENAME=近年歷史災害82處部落點位&STYLE=default",
                    method: 'GET',
                    success: (res) => {
                        state.selectLayerOption[id] = res.features
                    },
                    error: (res) => {
                        console.log(res.features)
                    }
                })
            }
        }

        function moveToMap(val) {
            // FIXME: node7_subNode0_nestedSubNodeundefined 改成判斷id
            // FIXME: 優化
            if (Object.keys(state.selectLayerOption)[0] === 'node4_subNode0_nestedSubNodeundefined' && state.selectLayerOption['node4_subNode0_nestedSubNodeundefined'][Number(val.target.value)].coordinates.WGS84 !== null) {
                let obj = {
                    action: 'moveTo',
                    value: {
                        xAxis: state.selectLayerOption['node4_subNode0_nestedSubNodeundefined'][Number(val.target.value)].coordinates.WGS84.lng,
                        yAxis: state.selectLayerOption['node4_subNode0_nestedSubNodeundefined'][Number(val.target.value)].coordinates.WGS84.lat
                    }
                }
                mapControl(obj)
            }
            if (Object.keys(state.selectLayerOption)[0] === 'node7_subNode0_nestedSubNodeundefined' && state.selectLayerOption['node7_subNode0_nestedSubNodeundefined'][val.target.value].geometry.coordinates[0] !== null) {
                let obj = {
                    action: 'moveTo',
                    value: {
                        xAxis: state.selectLayerOption['node7_subNode0_nestedSubNodeundefined'][val.target.value].geometry.coordinates[0],
                        yAxis: state.selectLayerOption['node7_subNode0_nestedSubNodeundefined'][val.target.value].geometry.coordinates[1]
                    }
                }
                mapControl(obj)
            }
        }

        function getBaseData() {
            return $.ajax({
                url: 'https://api.edtest.site/underLayers',
                method: 'GET'
            }).done(res => {
                return res
            })
        }

        function getLayerData() {
            return $.ajax({
                url: 'https://api.edtest.site/layers',
                method: "GET"
            }).done(res => {
                return (res)
            })
        }


        onMounted(async () => {
            let a = getBaseData()
            let b = getLayerData()
            Promise.all([a, b]).then((value) => {
                // TODO: pref
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
            window.onresize = (e) => {
                state.comSize.wrapHeight = e.target.innerHeight
                state.comSize.wrapWidth = e.target.innerWidth
            }

        })

        return {
            state,
            props,
            mapControl,
            layerControl,
            changeTarget,
            conditionWrap,
            closeMapData,
            addSelectElement,
            moveToMap,
        }
    }
}
</script>

<template>
    <div>
        <div class="w-100 d-flex flex flex-sm-row flex-wrap flex-sm-nowrap mapWrap" id="mapWrap">
            <!-- TODO: 寬度設定是否調整 -->
            <div id="map1"
                :class="{ 'w-100': state.map1?.getTarget() == 'map1', 'h-100': state.mapCount === 1, 'h-50': state.mapCount === 2 && (state.comSize.wrapWidth < 600) }">
            </div>
            <div class="middleLine" v-if="state.mapCount === 2"></div>
            <div id="map2"
                :class="{ 'w-100': state.map2?.getTarget() == 'map2', 'h-100': state.mapCount === 1, 'h-50': state.mapCount === 2 && (state.comSize.wrapWidth < 600) }">
            </div>
        </div>
        <asideTool class="asideTool position-absolute top-50 translate-middle-y" id="asideTool"
            @onMapControl="({ action, value }) => { mapControl({ action, value }) }" />

        <div class="SearchBar d-none d-sm-block position-absolute">
            <div class="d-flex align-items-center">
                <img src="@/assets/logo.svg" alt="" class="mb-2">
                <ul>
                    <li class="me-2 d-flex align-items-center">
                        <mapSourceOption class="mapSourceOption d-none d-sm-block" :baseMapList="state.temp.baseMapList"
                            :onChangeBaseMaps="({ action, value }) => {
                                layerControl({ action, value })
                            }" />
                    </li>
                </ul>
            </div>
            <SearchBar :dimensionMapStatus="state.toSearchDimensionStatus" :currentLayers="state.currentLayers"
                :mapCount="state.mapCount" :onChangeBaseMaps="({ action, value }) => {
                    layerControl({ action, value })
                }" @onLayerControl="({ action, value }) => { layerControl({ action, value }) }"
                @onChangeTarget="(value) => { changeTarget(value) }" @conditionWrap="(value) => { conditionWrap(value) }" />
        </div>

        <div class="conditionCom d-none d-sm-block position-absolute">
            <div class="mb-2">
                <button class="border-0 w-100 rounded-4 bg-steel text-white text-center p-2 fw-bold fs-5"
                    v-if="!state.conditionWrap" @click="state.conditionWrap = true">
                    圖層選項
                </button>
                <div class="mb-4" style="max-height: 50%;" :ref="(e) => {
                    state.comSize.conditionCom = e
                }" v-if="state.conditionWrap">
                    <condition v-bind="{
                        selectLayerOption: state.selectLayerOption,
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
                    }" @onMapControl="({ action, value }) => { mapControl({ action, value }) }"
                        @onLayerControl="({ action, value }) => { layerControl({ action, value }) }" />
                </div>
            </div>

            <div>
                <button class="border-0 w-100 rounded-4 bg-steel text-white text-center p-2 fw-bold fs-5"
                    v-if="!state.layerSelect" @click="state.layerSelect = true">
                    已選擇的圖層
                </button>
                <div v-if="state.layerSelect">
                    <layerSelect v-bind="{
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
            </div>
        </div>

        <div class="lightWrap w-100 h-100 d-flex justify-content-center align-items-center" v-if="state.deleteLightbox">
            <div class="p-4 rounded bg-white" style="width: 250px;">
                <p class="text-center fw-bold">是否要刪除全部圖層</p>
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

        <div id="popup" class="position-absolute bottom-0" :ref="(e) => {
            state.areaData.nodeRef = e
        }">
            <areaData class="areaData" v-if="state.areaData?.overlay" :closeMapData="() => {
                closeMapData()
            }" :tribeAreaData="state.areaData.tribeAreaData" :maxHeight="500"
                :coordinate="state.areaData.overlay.get('position')" />
        </div>

        <div class="m-Navbar d-flex d-sm-none position-fixed bottom-0 start-0 w-100">
            <condition class="position-absolute bottom-100 w-100" v-if="state.conditionWrap" v-bind="{
                mapLayers: state.mapLayers,
                currentLayers: state.currentLayers,
                onClose: () => {
                    state.conditionWrap = false
                },
                showSelectLayerValue: (val) => {
                    state.selectValueTemp = val
                }
            }" @onMapControl="({ action, value }) => { mapControl({ action, value }) }"
                @onLayerControl="({ action, value }) => { layerControl({ action, value }) }" />

            <div v-if="state.layerSelect">
                <layerSelect class="position-absolute bottom-100 w-100" v-bind="{
                    selectLock: state.selectLock,
                    currentLayers: state.currentLayers,
                    onClose: () => {
                        state.layerSelect = false
                    },
                    onChangLayerVisible: (action) => {
                        layerControl(action)
                    },
                    onChangeOrderLayer: ({ action, value }) => {
                        layerControl({ action, value })
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
                }" :setOpacity="({ action, value }) => {
    layerControl({ action, value })
}" />
            </div>

            <mNavbar :dimensionMapStatus="state.toSearchDimensionStatus" :currentLayers="state.currentLayers"
                :mapCount="state.mapCount" :openConditionWrap="() => {
                    state.conditionWrap = !state.conditionWrap
                    state.layerSelect = false
                }" :openLayerSelect="() => {
    state.layerSelect = !state.layerSelect
    state.conditionWrap = false
}" :onLayerControl="({ action, value }) => {
    layerControl({ action, value })
}" :onChangeTarget="(value) => { changeTarget(value) }"
                @conditionWrap="(value) => { conditionWrap(value) }" />
        </div>
    </div>
</template>

<style lang="sass">
@import '@/assets/styles/all.module.scss'
.mapWrap
    justify-content: space-between
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
.areaData
    width: 450px
    max-height: 550px
    background: #fff
    box-sizing: border-box
    border-radius: 10px
    border: 1px solid #088
@media (max-width: 600px)
    .m-Navbar
        z-index: 222
    .middleLine
        height: 1px
        width: 100%
</style>
