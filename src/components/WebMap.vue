<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default {
    setup(props, { emit }) {
        const state = reactive({
            pickedContract: '999'
        })

        // // 跟使用者要位置
        // function successGPS(position) {
        //     console.log(position)
        //     const lat = position.coords.latitude;
        //     const lng = position.coords.longitude;
        //     center = [lat, lng];
        //     // 接著寫確認了座標後要執行的事
        // };
        // function errorGPS() {
        //     console.log('無法判斷您的所在位置，無法使用此功能。預設地點將為 台北市動物園')
        //     // window.alert('無法判斷您的所在位置，無法使用此功能。預設地點將為 台北市動物園');
        //     // 接著寫使用者「封鎖」位置資訊請求後要執行的事
        // }
        // if(navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(successGPS, errorGPS);
        // } else {
        //     window.alert('您的裝置不具備GPS，無法使用此功能');
        // // 接著寫使用者裝置不支援位置資訊時要執行的事
        // }

        // onMounted(() => {
        //     let map = L.map('map').setView([24.801583, 120.971859], 17);
        //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //         attribution: '© OpenStreetMap', // 商用時必須要有版權出處
        //         zoomControl: false , // 是否秀出 - + 按鈕
        //     }).addTo(map);

        //     const customIcon = L.icon({
        //         iconUrl: 'https://member.ithome.com.tw/avatars/132673?s=ithelp',
        //         iconSize: [42, 42],
        //     });
        //     L.marker([24.79826565221393, 120.97370317437601], {
        //         icon: customIcon,
        //         alt: '8號門市',
        //     }).addTo(map).bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');

        //     // L.marker([[24.79826565221393, 120.97370317437601]], {
        //     //     alt: '8號門市',
        //     // }).bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');
        //     // const marker = L.marker([[24.79826565221393, 120.97370317437601]], {
        //         // icon: customIcon,
        //         // alt: '跟 <a> 的 title 一樣', // 跟 <a> 的 title 一樣
        //         // opacity: 1.0
        //     // }).addTo(map).bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');

        //     // var mapbox = L.tileLayer(mapboxUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution});

        //     // var baseLayers = {
        //     //     "Mapbox": mapbox,
        //     //     "OpenStreetMap": osm
        //     // };

        //     // var overlays = {
        //     //     "Marker": marker,
        //     //     "Roads": roadsLayer
        //     // };
        //     // L.control.layers(baseLayers, overlays).addTo(map);
        // })

        // var map = L.map('map', {
        //     maxZoom: 20,
        //     minZoom: 6,
        //     zoomControl: false
        // });

        // L.control.zoom({
        //     position: 'bottomright'
        // }).addTo(map);
        onMounted(() => {
            var map = L.map('map',{
                zoomControl: false
            }).setView([24.801583, 120.971859], 17);
            L.control.zoom({
                position: 'topleft'
            }).addTo(map);
            L.marker([24.80340415977538, 120.96884449432741], {
                alt: '1號門市',
            }).addTo(map).bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

        })

        return {
            state,
        }
    }
}
</script>

<template>
    <div id="map">
    </div>
</template>

<style scoped>
#map {
    width: 100%;
    height: 100%;
}
.leaflet-top{
    position: fixed;
    bottom: 0;
    top:50%;
    transform: translateY(-50%);
}
</style>
