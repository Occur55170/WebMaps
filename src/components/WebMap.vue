<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default {
    setup(props, { emit }) {
        const state = reactive({
            pickedContract: '999'
        })


        onMounted(() => {
            var map = L.map('map').setView([24.801583, 120.971859], 17);
            L.marker([24.80340415977538, 120.96884449432741], { alt: '1號門市' }).addTo(map).bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');
            L.marker([24.80315093346662, 120.97174134060748], { alt: '2號門市' }).addTo(map).bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');
            L.marker([24.802030912259397, 120.9689732570909], { alt: '3號門市' }).addTo(map).bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');
            L.marker([24.801027681204214, 120.97517456219623], { alt: '4號門市' }).addTo(map).bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');
            L.marker([24.804533900189952, 120.973543868621], { alt: '5號門市' }).addTo(map).bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');
            L.marker([24.801034199227438, 120.96738707084371], { alt: '6號門市' }).addTo(map).bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');
            L.marker([24.80183734266878, 120.96384710331658], { alt: '7號門市' }).addTo(map).bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');
            L.marker([24.79826565221393, 120.97370317437601], { alt: '8號門市' }).addTo(map).bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
</style>
