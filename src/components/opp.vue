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
            console.log(1)
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
            let url = 'https://s3.ap-northeast-1.amazonaws.com/common.cwb.images/ncdr/forecast.png?AWSAccessKeyId=ASIAU6XV5PTRE2KIBH4U&Signature=RcnrEKAGbyjgQ3fPd603Ka9m3dk%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0xIkcwRQIgNI3dIZR9iY6vHTC8hZo%2FPiW%2FzTUY4%2F3gVpw43zzom8ICIQDPWXFI8%2BxBtv9uLs4GAfK%2B9jbMr2BJjUFfUJnXjfGImCr5Agg0EAAaDDM0MDg5MTg5Mjk2MiIMSZroc7%2F2rZ%2BU5BjoKtYCfkvoSF5CQc2o8AYjfYDSb1wOzy9vAlu4heZCKlkE3R%2Bme8i2fQ2GOu%2Ftu02shIxbfnECm%2Fq0RqZHYsJmR%2BGUyYblZIyRQwkY3PCrN8ZmY0iiilDXJdr5xILEwSFS05bFntZk6VSYaZXpKW1buf8uGnT2wAR9uJ6525PH2HUSxI8t%2B6Ydlg%2BL9CFjlsjHPggp4mel4M2oCapWIEPybU0jreqd5Tq08mD9wGQyuDqNxTrnA8WGG56Jnpat2aKFgo9OrpV4ToLm2aiWkiQcBBFa4OZY8ImLEbLRn4wDC%2BM9cd%2BPzXh%2BB8K2%2F37bbD7OpwAbd%2BPuWP55nUTz1CXyjOJ0A5s3Mw0szPW2A6R%2FM%2BOKI1In%2B1A2LWxfcqQ6qJV5fhQGqiXj1GvladK8WA74oNZdXfMve0lE53R%2FTrrPbtkR5ox6WRcZvvPVqG7S%2BRhFIa2XpEY%2F%2BDSKMI%2Fcy6UGOp4BtdQiqoKXWK3mmCaZnHXgv8aw81%2BYRTmZBTXiKyLmHNkmIJrIh2bL1z5td14d0nmmItwv5Son%2FOtLRAWbctsPtvt8Vm9N938G3CL%2F5tL58iAt9me97s45jK6KHCqA2ob4TB1VXms%2BjhQMdOwY9fzQtSgVvkEESCVbfa27dsN9HvnB2toE4w4wj%2BZmBb6nfb6Yk9EGLDN3zA8URaUW0lI%3D&Expires=1689448552'
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