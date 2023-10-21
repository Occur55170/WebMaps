<script>
import { onMounted, ref, nextTick } from 'vue'

import { Map, View, Feature } from 'ol'
import 'ol/ol.css'
import { OSM } from 'ol/source.js'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'

import baseMapList, { getBaseMapAll } from '@/config/baseMapList'
import { toPng } from "html-to-image"
import ImageStatic from 'ol/source/ImageStatic'
import TileWMS from 'ol/source/TileWMS'
import ImageWMS from 'ol/source/ImageWMS'
import { Circle, Polygon, Point } from 'ol/geom.js'
import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector.js'
import { Icon, Fill, Stroke, Style } from 'ol/style.js'

export default {
    props: {
    },
    setup(props, { emit }) {
        let map
        onMounted(async () => {
            map = new Map({
                target: 'map',
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                    new TileLayer({
                        title: '网格',
                        source: new XYZ({
                        visible: true,
                        wrapX: true,
                        url: 'http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=49ea1deec0ffd88ef13a3f69987e9a63'
                        })
                    }),
                ],
                view: new View({
                    projection: 'EPSG:4326',
                    center: [121.326776, 24.655499],
                    zoom: 9,
                }),
            })
            addGif()
        })

        function addGif() {
            const iconFeature = new Feature({
                geometry: new Point([121.326776, 24.655499])
            })

            const vectorSource = new VectorSource({
                features: [iconFeature]
            })

            const vectorLayer = new VectorLayer({
                source: vectorSource
            })
            // 'https://openlayers.org/en/latest/examples/data/globe.gif'
            // let url = 'https://openlayers.org/en/latest/examples/data/globe.gif'
            gifler(url).frames(
                document.createElement('canvas'),
                (ctx, frame) => {
                    if (!iconFeature.getStyle()) {
                        iconFeature.setStyle(
                            new Style({
                                image: new Icon({
                                    img: ctx.canvas,
                                    imgSize: [frame.width, frame.height],
                                    opacity: 0.8
                                })
                            })
                        )
                    }
                    ctx.clearRect(0, 0, frame.width, frame.height)
                    ctx.drawImage(frame.buffer, frame.x, frame.y)
                    map.render()
                },
                true
            )
            map.addLayer(vectorLayer)
        }


        return {
            map,
        }
    }
}
</script>

<template>
    <div id="map"></div>
</template>

<style lang="sass" scoped>
#imgMap
    width: 100vw
    height: 1000px
</style>