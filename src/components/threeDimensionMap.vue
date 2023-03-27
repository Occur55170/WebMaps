<script setup>

import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

// import OLCesium from 'olcs/OLCesium.js';
import * as Cesium from 'cesium'
import { Viewer } from 'cesium'

onMounted(() => {
    // 在元素加载完之后再执行地图初始化
    // initMap()


    // const viewer = new Viewer('cesiumContainer')
    const viewer = new Viewer('cesiumContainer', {
        animation: false, // 动画小组件
        baseLayerPicker: false, // 底图组件，选择三维数字地球的底图（imagery and terrain）。
        fullscreenButton: false, // 全屏组件
        geocoder: false, // 地理编码（搜索）组件
        homeButton: false, // 首页，点击之后将视图跳转到默认视角
        infoBox: false, // 信息框
        sceneModePicker: false, // 场景模式，切换2D、3D 和 Columbus View (CV) 模式。
        selectionIndicator: false, // 是否显示选取指示器组件
        timeline: false, // 时间轴
        navigationHelpButton: false, // 帮助提示，如何操作数字地球。
        scene3DOnly: true,
        clock: new Cesium.Clock(),
        navigationInstructionsInitiallyVisible: false,
        vrButton: false, // VR模式
    })
    const  boundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(120.971859,24.801583,14),200);
    viewer.camera.flyToBoundingSphere(boundingSphere,{
        duration: 0
    })


    // defaultCenter: [120.971859, 24.801583], //lng, lat
    // defaultCenterZoom: 14,
})
</script>
<template>
    <div id="cesiumContainer" class="cesiumContainer"></div>
</template>
