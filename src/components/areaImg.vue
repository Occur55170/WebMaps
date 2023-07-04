<script>
import { onMounted, reactive, nextTick } from 'vue'

import { Map, View, Feature } from 'ol'
import 'ol/ol.css'
import { OSM } from 'ol/source.js'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'

import VectorSource from 'ol/source/Vector.js'
import { Icon, Fill, Stroke, Style } from 'ol/style.js'
import { Circle, Polygon, Point } from 'ol/geom.js'
import { toPng } from "html-to-image";

export default {
    props: {
        coordinate: {
            type: Object,
            default: {}
        },
    },
    setup(props, { emit }) {
        let map
        const state = reactive({
            imgSrc: 'dddd'
        })
        onMounted(async () => {
            console.log(props.coordinate)
            map = new Map({
                target: 'imgMap',
                layers: [
                    new TileLayer({
                        preload: Infinity,
                        crossOrigin: "Anonymous",
                        source: new OSM(),
                    }),
                    new Vector({
                        source: new VectorSource({
                            features: [
                                new Feature({
                                    geometry: new Point(props.coordinate),
                                    name: 'Null Island',
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
                                // 圖片連結需修改
                                src: 'https://www.ockert-cnc.de/wp-content/uploads/2016/12/map-marker-icon-100x100.png',
                            }),
                        })
                    })
                ],
                view: new View({
                    projection: 'EPSG:4326',
                    center: props.coordinate,
                    zoom: 14,
                }),
            })
            map.once('loadend', function () {
                toPng(map.getTargetElement()).then(function (dataURL) {
                    console.log(dataURL)
                    // document.getElementById('imgMap').remove()
                    // state.imgSrc = dataURL
                })
            })
        })
        return {
            props,
            state,
        }
    }
}
</script>

<template>
    <div>
        {{ props.coordinate }}
        <div id="imgMap" style="width: 600px; height: 100px;"></div>
        <!-- <img :src="state.imgSrc" alt="" class="w-100"> -->
    </div>
</template>
