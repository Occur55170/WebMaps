<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import Map from 'ol/Map.js'
import OSM from 'ol/source/OSM.js'
import Static from 'ol/source/ImageStatic.js'
import View from 'ol/View.js'
import proj4 from 'proj4'
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer.js'
import {getCenter} from 'ol/extent.js'
import {register} from 'ol/proj/proj4.js'
import {transform} from 'ol/proj.js'

// import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import TileWMS from 'ol/source/TileWMS'
proj4.defs(
  'EPSG:27700',
  '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
    '+x_0=400000 +y_0=-100000 +ellps=airy ' +
    '+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 ' +
    '+units=m +no_defs'
)
proj4.defs("EPSG:3826", "+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
register(proj4);

const imageExtent = [200000, 200000, 3000000, 5000000];
const imageLayer = new ImageLayer();

// var EPSG ='EPSG:3031'; // EPSG:3031 - WGS 84 / Antarctic Polar Stereographic
// proj4.defs([['EPSG:3031','+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs']]);
// proj4.defs('urn:ogc:def:crs:EPSG::3031', proj4.defs(EPSG)); // add alias
// var projection = ol.proj.get(EPSG);
// var extent = ol.proj.transformExtent([-180, -45, 180, -90], 'EPSG:4326', projection);
// var center = ol.proj.transform([180,-90], 'EPSG:4326', projection);
// projection.setExtent(extent);
const map = new Map({
    layers: [
        new TileLayer({
            source: new TileWMS({
            url: 'https://wms.geo.admin.ch/',
            crossOrigin: 'anonymous',
            attributions:
                '© <a href="https://shop.swisstopo.admin.ch/en/products/maps/national/lk1000"' +
                'target="_blank">Pixelmap 1:1000000 / geo.admin.ch</a>',
            params: {
                'LAYERS': 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
                'FORMAT': 'image/jpeg',
            },
            serverType: 'mapserver',
            }),
        }),
        // imageLayer,
    ],
    target: 'map',
    view: new View({
        // center: transform(getCenter(imageExtent), 'EPSG:3826', 'EPSG:3857'),
        // center: transform( getCenter(area.Taiwan) , 'EPSG:3826'),
        center: [120.41670777208755, 24.197957034875305],
        zoom: 4,
    }),
});

// const interpolate = document.getElementById('interpolate');

function setSource(e) {
    // const source = new Static({
    //     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/' + 'British_National_Grid.svg/2000px-British_National_Grid.svg.png',
    //     projection: 'EPSG:3826',
    //     crossOrigin: '',
    //     imageExtent: imageExtent,
    //     // interpolate: interpolate.checked,
    // });

    const source = new TileWMS({
        // projection: 'EPSG:3857', // here is the source projection
        url: 'https://ahocevar.com/geoserver/wms',
        params: {
            'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
        },
    })
    map.addLayer(source);
}
setSource();

// interpolate.addEventListener('change', setSource);
</script>

<template>
    921

    <div id="map" class="map"></div>
    <div>
        <button @click="setSource()">999</button>
        <input type="checkbox" id="interpolate" checked />
        <label for="interpolate">Interpolate</label>
    </div>
</template>
<style>
.map {
    width: 100%;
    height: 400px;
}
</style>
