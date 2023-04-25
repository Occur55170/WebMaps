<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'

import ImageLayer from 'ol/layer/Image.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { url } from 'inspector';
export default {
    props: {},
    setup(props, { emit }) {

        onMounted(() => {
            const wmsSource = new ImageWMS({
                url: 'https://ahocevar.com/geoserver/wms',
                params: { 'LAYERS': 'ne:ne' },
                serverType: 'geoserver',
                crossOrigin: 'anonymous',
            });

            const wmsLayer = new ImageLayer({
                source: wmsSource,
            });

            const view = new View({
                center: [0, 0],
                zoom: 1,
            });

            const map = new Map({
                layers: [wmsLayer],
                target: 'map',
                view: view,
            });


            map.on('click', (evt) => {
                document.getElementById('info').innerHTML = '';
                const viewResolution = (view.getResolution());
                const url = wmsSource.getFeatureInfoUrl(
                    evt.coordinate,
                    viewResolution,
                    'EPSG:3857',
                    { 'INFO_FORMAT': 'text/html' }
                )
                if (url) {
                    fetch(url)
                        .then((response) => response.text())
                        .then((html) => {
                            document.getElementById('info').innerHTML = html;
                        });
                }
            });

            map.on('pointermove', function (evt) {
                if (evt.dragging) {
                    return;
                }
                const data = wmsLayer.getData(evt.pixel);
                const hit = data && data[3] > 0;
                map.getTargetElement().style.cursor = hit ? 'pointer' : '';
            })

        })
        return {
        }
    }
}
</script>

<template>
        <div id="map" class="map"></div>
        <div id="info">&nbsp;</div>
</template>

<style>
.map {
    width: 100%;
    height: 400px;
}
</style>
