<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'

import WebMap from './components/WebMap.vue'
import AsideTool from './components/AsideTool.vue'
import LayoutTool from './components/LayoutTool.vue'
import SearchBar from './components/SearchBar.vue'


import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import "leaflet.locatecontrol"
import '@bepo65/leaflet.fullscreen/Control.FullScreen'
import '@bepo65/leaflet.fullscreen/Control.FullScreen.css'

export default {
    setup(props, { emit }) {
        const state = reactive({
        })

        // 跟使用者要位置
        function successGPS(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            center = [lat, lng];
            // 接著寫確認了座標後要執行的事
            triggerLeaflet();
        };
        function errorGPS() {
            window.alert('無法判斷您的所在位置，無法使用此功能。預設地點將為 新竹火車站');
            // 接著寫使用者「封鎖」位置資訊請求後要執行的事
            triggerLeaflet();
        }

        // if (navigator.geolocation) { //
        //     navigator.geolocation.getCurrentPosition(showPosition); //有拿到位置就呼叫 showPosition 函式
        // } else {
        //     m.innerHTML = "您的瀏覽器不支援 顯示地理位置 API ，請使用其它瀏覽器開啟 這個網址";
        // }

        function location() {
            // let latlng ={
            //     lat:25.0565767,
            //     lng:121.5712388
            // }
            // L.control.locate({setView: true, maxZoom: 15}).addTo(map);
            let lc = L.control.locate({
                position: "topright",
            }).addTo(map);
        }

        onMounted(() => {
            // 放置地圖
            const zoom = 17; // 縮放程度
            const center = [24.801583, 120.971859]; // 中心點座標
            const map = L.map('map', {
                zoomControl: false,
                fullscreenControl: true,
                fullscreenControlOptions: {
                    position: 'topright',
                    title: "進入全螢幕",
                    titleCancel: "離開全螢幕",
                    content: null,
                    forceSeparateButton: true,
                    forcePseudoFullscreen: false,
                }
            }).setView(center, zoom);

            L.control.zoom({
                position: 'bottomright'
            }).addTo(map);

            L.marker([24.80340415977538, 120.96884449432741], {
                alt: '1號門市',
            }).addTo(map).bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');

            // 標記來源
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            // 定位點
            L.control.locate({
                position: "bottomright",
                icon: 'locate',
                iconLoading: 'loading',
                iconElementTag: 'div',
                strings: {
                    title: "Show me where I am, yo!"
                }
            }).addTo(map);

        })

        return {
            state,
            location
        }
    }
}

</script>

<template>
    <SearchBar class="SearchBar" />
    <div class="main">
        <LayoutTool class="LayoutTool" />
    </div>
    <AsideTool class="AsideTool" />

    <div id="map"></div>
    <WebMap class="mapContent" />
</template>

<style lang="sass">
.main
    position: fixed
    top: 36px
    left: 36px
    z-index: 10
    padding: 20px
    box-sizing: border-box


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


.AsideTool
    position: absolute
    top: 50%
    right: 0
    z-index: 220


.mapContent
    position: fixed
    top: 0
    left: 0px
    z-index: 0
    outline: none


#map
    position: fixed
    top: 0
    left: 0px
    z-index: 0
    outline: none
    width: 100%
    height: 100%


/* .leaflet-top.leaflet-right
    top:50%
    transform: translate(-50%, 0%)
 */

.leaflet-control-locate a.leaflet-bar-part div
    background-position: left 8px top 8px
    background-repeat: no-repeat
    width: 30px
    height: 30px


.leaflet-control-locate a.leaflet-bar-part div.loading
    background-image: url(https://i0.wp.com/www.letswrite.tw/wp-content/uploads/2022/03/letswritw_logo_u_512.png?fit=512%2C512&ssl=1)


.leaflet-control-locate a.leaflet-bar-part div.locate
    position: relative


.leaflet-touch .leaflet-bar a
    display: flex
    justify-content: center
    align-items: center


.leaflet-control-locate a.leaflet-bar-part div.locate
    width: 18px
    height: 18px
    --un-icon: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7s7 3.13 7 7s-3.13 7-7 7z'/%3E%3C/svg%3E")
    mask: var(--un-icon) no-repeat
    mask-size: 100% 100%
    -webkit-mask: var(--un-icon) no-repeat
    -webkit-mask-size: 100% 100%
    background-color: currentColor

</style>
