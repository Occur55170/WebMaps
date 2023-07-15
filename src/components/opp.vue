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
        center: [120.41670777208755, 24.197957034875305],
        zoom: 4,
    }),
})

// {
//     group_title: "即時預測",
//     group_icon: null,
//     group_class: null,
//     group_layers: [
//         {
//             title: "雷達回波預測",
//             help_btn_display: false,
//             help_memo: "",
//             minzoom: 4,
//             maxzoom: 18,
//             layer_type: "Image",
//             figure_type: "Surface",
//             single_tiles: true,
//             tiles_url: "https://s3.ap-northeast-1.amazonaws.com/common.cwb.images/ncdr/forecast.png?AWSAccessKeyId=ASIAU6XV5PTRDZMDPUXB&Signature=KCx%2BU6HxCmMHcslpU2Epbd7fpug%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEJ7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0xIkcwRQIhAOfUJKB%2B0XKZdWPNmuknzVlrAYjAvjk8i4qK7pTKxxEQAiBuGZCkssBgtviyEAVBORaortxdP2gOKIjtmqCeUKHICir5AggnEAAaDDM0MDg5MTg5Mjk2MiIMB2YP5hVKFfBSei0WKtYCkFKH8ICWeVfSTZ4UJRrsJHaDWzCgW1rFFqqB7ovoeJJb5cbWglmM1BFTDU7iecL2t%2Fl2cRSgwDE9nC4KBkRKUOUrgzQdzQS66t9vSTmDtgMwXr%2F7MbTfWauX37VO3XPUbPoW0ico3yY73Im07hXyfzKNajgEkxqm%2BQiNi%2Fy6aiC22E9LbvqZoPWsKXFb16dW%2F5Uo3xfWc3P0W%2B8suEjHS7QBflSaI0bYP2jzt6Da%2BeXBvZg8l9RGp9me%2FGYfwf1WMWohoTfh9qgHYq8XS3FXLz%2BAiQx34XVRHvfMXGl%2Fq8dA9s6gOSVSOGTARYveZ%2B0HJwUJARbnZvRJAaeba0bWNTYiHnf2%2BEyeWJ68bLUNJq6GKYBtoyBtgDLcyKzzntlVKAGlWnXGZcmdhXttWnV5MWUg2MMRJO8e2aAd0Z8CK89X5m86UQUimKWSRNJfVmlt03Zp%2Fl4OMNDsyKUGOp4BHRpdUY18O5lPk2lGe92aIeT3EEV%2FPznNtcAeoRnhIjYeNJ92GpjkpYEbuKxAOSJsUHLFjaAv4yXaR72h9Om2emdh399NH54XOhI%2BR6qRvwfn927aefjE7iCcpxhkexyagNcn03DnGOPkwBQjTfJOllwGUkUDT6pU5pPTuNh6CzgaclpBPPoypWJ%2FciBtBPcc3Nn%2BQV6kJIn9GSOsa%2Bs%3D&Expires=1689401702",
//             tiles_list_description: "",
//             image_options: {
//                 image_extent: [
//                     117.1595,
//                     21.2646,
//                     123.9804,
//                     26.5353
//                 ]
//             }
//         }
//     ]
// }
</script>

<template>
    921

    <div id="map" class="map"></div>
</template>
<style>
.map {
    width: 100%;
    height: 400px;
}
</style>
