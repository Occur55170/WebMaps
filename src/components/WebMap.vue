<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import "leaflet.locatecontrol";
import '@bepo65/leaflet.fullscreen/Control.FullScreen';
import '@bepo65/leaflet.fullscreen/Control.FullScreen.css';


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
            var lc = L.control.locate({
                position: "topright",
                strings: {
                    title: "Show me where I am, yo!"
                }
            }).addTo(map);
        }

        onMounted(() => {
            // 放置地圖
            let zoom = 17; // 0 - 18
            let center = [24.801583, 120.971859]; // 中心點座標
            var map = L.map('map', {
                zoomControl: false,
                fullscreenControl: true,
                fullscreenControlOptions: {
                  position: 'bottomright',
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

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            L.control.locate({
                position: "bottomright",
                icon: 'locate',
                iconLoading: 'loading',
                iconElementTag: 'div'
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
    <div id="map"></div>
</template>

<style>
#map {
    width: 100%;
    height: 100%;
}

/* .leaflet-top.leaflet-right {
    top:50%;
    transform: translate(-50%, 0%);
} */
.locationA {
    position: relative;
    z-index: 999;
    font-size: 30px;
    right: 0;
    top: 50%;
}

.leaflet-control-locate a.leaflet-bar-part div {
    background-position: left 8px top 8px;
    background-repeat: no-repeat;
    width: 30px;
    height: 30px;
}

.leaflet-control-locate a.leaflet-bar-part div.loading {
    background-image: url(https://i0.wp.com/www.letswrite.tw/wp-content/uploads/2022/03/letswritw_logo_u_512.png?fit=512%2C512&ssl=1);
}

.leaflet-control-locate a.leaflet-bar-part div.locate {
    background-image: url(https://rawcdn.githack.com/gravitystorm/openstreetmap-carto/eae09090b64c361be3ff7bfd1975be7638a6b36c/symbols/man_made/tower_lattice.svg);
    /* background-image: url(/assets/img/IconoirPosition.svg); */
}
</style>
