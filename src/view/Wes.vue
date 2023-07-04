<script>
import { onMounted, ref, nextTick } from 'vue'

import { Map, View } from 'ol'
import 'ol/ol.css'
import { OSM } from 'ol/source.js'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'

import baseMapList, { getBaseMapAll }  from '@/config/baseMapList'
import { toPng } from "html-to-image";

export default {
    props: {
        // cord: {
        //     type: Array,
        //     default: []
        // },
    },
    setup(props, { emit }) {
        const imgSrc = ''
        let map
        onMounted(async () => {
            console.log(1)
            map = new Map({
                target: 'imgMap',
                layers: [
                    new TileLayer({
                        preload: Infinity,
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    projection: 'EPSG:4326',
                    center: [121.326776, 24.655499],
                    zoom: 14,
                }),
            })
            nextTick(()=>{
                map.once('rendercomplete', function () {
                    toPng(map.getTargetElement()).then(function (dataURL) {
                        console.log(dataURL)
                        imgSrc = dataURL
                    })
                })
            })
        })


        return {
            imgSrc,
            map,
        }
    }
}
</script>

<template>
    <div>
        <div id="imgMap"></div>
        <img :src="imgSrc" alt="">
    </div>
</template>

<style lang="sass" scoped>
#imgMap
    // position: fixed
    // top: -99999px
    // left: -99999px
    width: 600px
    height: 600px
</style>
