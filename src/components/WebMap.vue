<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import "leaflet.locatecontrol";

export default {
    setup(props, { emit }) {
        const state = reactive({
            pickedContract: '999'
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

            // *** 放置地圖
            let zoom = 17; // 0 - 18
            let center = [24.801583, 120.971859]; // 中心點座標
            var map = L.map('map', {
                zoomControl: false,
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
            // var lc = map.control.locate().addTo(map);
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
    <div id="map">

        <a href="" @click.prevent="location" class="aaa">
            <svg width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor"
                    d="M12 22.95q-.425 0-.712-.287Q11 22.375 11 21.95v-1q-3.125-.35-5.362-2.587Q3.4 16.125 3.05 13h-1q-.425 0-.713-.288q-.287-.287-.287-.712t.287-.713Q1.625 11 2.05 11h1q.35-3.125 2.588-5.363Q7.875 3.4 11 3.05v-1q0-.425.288-.713q.287-.287.712-.287t.713.287q.287.288.287.713v1q3.125.35 5.363 2.587Q20.6 7.875 20.95 11h1q.425 0 .713.287q.287.288.287.713t-.287.712q-.288.288-.713.288h-1q-.35 3.125-2.587 5.363Q16.125 20.6 13 20.95v1q0 .425-.287.713q-.288.287-.713.287ZM12 19q2.9 0 4.95-2.05Q19 14.9 19 12q0-2.9-2.05-4.95Q14.9 5 12 5Q9.1 5 7.05 7.05Q5 9.1 5 12q0 2.9 2.05 4.95Q9.1 19 12 19Zm0-3q-1.65 0-2.825-1.175Q8 13.65 8 12q0-1.65 1.175-2.825Q10.35 8 12 8q1.65 0 2.825 1.175Q16 10.35 16 12q0 1.65-1.175 2.825Q13.65 16 12 16Z">
                </path>
            </svg>
        </a>
    </div>
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
.aaa{
    position: relative;
    z-index: 999;
    font-size: 30px;
}

.leaflet-control-locate a.leaflet-bar-part div {
	background-position: left 8px top 8px;
	background-repeat: no-repeat;
	width: 30px;
	height: 30px;
}
.leaflet-control-locate a.leaflet-bar-part div.loading {
	background-image: url(https://rawcdn.githack.com/gravitystorm/openstreetmap-carto/eae09090b64c361be3ff7bfd1975be7638a6b36c/symbols/man_made/tower_lattice_communication.svg);
}
.leaflet-control-locate a.leaflet-bar-part div.locate {
	background-image: url(https://rawcdn.githack.com/gravitystorm/openstreetmap-carto/eae09090b64c361be3ff7bfd1975be7638a6b36c/symbols/man_made/tower_lattice.svg);
}
</style>
