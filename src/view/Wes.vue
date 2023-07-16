<script>
import { onMounted, ref, nextTick } from 'vue'

import { Map, View } from 'ol'
import 'ol/ol.css'
import { OSM } from 'ol/source.js'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'

import baseMapList, { getBaseMapAll } from '@/config/baseMapList'
import { toPng } from "html-to-image"
import TileWMS from 'ol/source/TileWMS'
import ImageWMS from 'ol/source/ImageWMS';
import ImageStatic from 'ol/source/ImageStatic'

import proj4 from 'proj4'
import { register } from 'ol/proj/proj4.js'
proj4.defs(
    'EPSG:3826',
    '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
proj4.defs("ESRI:54032","+proj=aeqd +lat_0=52.346900 +lon_0=19.092600 +x_0=800 +y_0=800 +ellps=sphere +datum=WGS84 +units=m +no_defs");

register(proj4)
export default {
    props: {
    },
    setup(props, { emit }) {
        const imgSrc = ''
        let map
        onMounted(async () => {
            console.log(1)
            map = new Map({
                target: 'imgMap',
                layers: [
                    // 圖層列表
                    new Image({
                        source: new ImageStatic({
                            url: 'https://s3.ap-northeast-1.amazonaws.com/common.cwb.images/ncdr/forecast.png?AWSAccessKeyId=ASIAU6XV5PTRKHMVTCOZ&Signature=%2FUgC8R6j9iVv8HrsJfURm0hh6bY%3D&x-amz-security-token=IQoJb3JpZ2luX2VjELX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0xIkcwRQIgH%2F7%2Bg%2FPNJ05zh7nXL5BVzIom9c38Rk35TfqEv7NyusUCIQCmu1MLjqV5uX4rmkemKB83MDaqxvtwsRVpIz%2BprkBtGir5Agg%2FEAAaDDM0MDg5MTg5Mjk2MiIMRpUznShdTqAAAuEXKtYCijNJn8wZpnTgg5k6wpBRjGAS0jtbZ%2B9VslCkZVI5jsBLhxwl5PfBLDfsDnq0odPNGMwi1iCrusgcXgTq6%2BpmgPAkhxKiCGFZVCd2lPjpkJWbczUHclanSvxisCrjWmCExZAvFwk3Oaa7S8Ac4vabO6k3DFOACbWijeuMics%2FIcLBX8OUchVM43%2BQyw6yUNJ7uPyay2n83%2Bm8hns3%2FEetfEagH7r6%2FAUuNOCzu2Symr0dmmRmgaJbZ%2F73qTF%2FvzANbfBlbnkVKhNDGUejUlkS%2Bthk7vf1eAWIufqvK0%2BUx7uUTOn95wCYtKvmi3N22yh7vQ1LlOcfpyuzPtfHJw%2BiXxp5i%2FTjBxzWdOvftOVVK76DdR5hyn6FVoAKInKRIb0My1zJIlqfatkeOUMjI6gMPCW9NuLesdeyqGC1DIRk9XNsNTFlP%2FNtfKJmq54vKRbt9Wa%2BDNp5MID%2FzaUGOp4BX4A7s%2B1UJ%2FhdYWlLEEcPpbeLnV0uiu%2FgV8Vz0%2FXhPRQ8hcIi%2BiUY5tjgDkbmv%2Fla4951B6FoCfi%2BveT%2BufzBQBih%2BKfAPF%2BS16dVAvo5rVKk6mOtVDOrODiSg0mX2Er1WYBoFtAkiReOgero8gJWLKAG0du9UPqBuJ%2FXcnWz6ayp3rLbclC%2BfpElAsqnnKBXsOmXqlFJccg3%2B%2F4cyJU%3D&Expires=1689486029',
                            imageExtent: [117.1595, 21.2646, 123.9804, 26.5353], // 圖片範圍
                            projection: 'EPSG:3857', // 圖片投影，根據需求更改
                            imageLoadFunction: function(image, src) {
                                var img = new Image();
                                img.onload = function() {
                                    // 將圖片資料複製到畫布上
                                    var canvas = document.createElement('canvas');
                                    canvas.width = img.width;
                                    canvas.height = img.height;
                                    var context = canvas.getContext('2d');
                                    context.drawImage(img, 0, 0);
                                    image.getImage().src = canvas.toDataURL('image/png');
                                };
                                img.src = src;
                            }
                        })
                    })
                ],
                view: new View({
                    center: [0, 0], // 地圖中心點
                    zoom: 10 // 初始縮放級別
                })
            })
        })
        function adLayer() {
            let vectorLayer = new Image({
                extent: [117.1595, 21.2646, 123.9804, 26.5353],
                source: new ImageStatic({
                    url:'https://s3.ap-northeast-1.amazonaws.com/common.cwb.images/ncdr/forecast.png?AWSAccessKeyId=ASIAU6XV5PTRGHWTMCUZ&Signature=9m8wgJy2euxdf97Dk2YYg3%2FY5pk%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEKT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0xIkYwRAIgCM0K0IVNVd1tEPV0kWgdZcEXP2Q%2BWB00LociiWdidyoCIA2uAbFxfbYXIXDui3u%2FhMYGS5RFHHsl8p5tUqofPnG%2FKvkCCC0QABoMMzQwODkxODkyOTYyIgw2FMys6aWbEEk6vp0q1gIuXf8S0NWoVzGFXSJyZMA4LyMqZChFNlFyaJNL64ZR7XXLphL6%2FCpgO2benzgkXvCNp9LD5wUT6Nx2qOfsqo9pKtOTqg6n%2F0Fy%2FMP0amUEuAqd%2FnhV9g5P6bdRSa%2FyRw5BSQlfbbyYhaoiudmxkLrVR2NRY4QfPx6jryzX1beFDhDoEvaaNYKBR3Z4ArZPvNiC50ykm6iEYEqKtBTAHwWnzZe%2FA391kbpndn6BU%2Bq67wOY4DIpC32bpkyIrf8pynPzaHRouNj40e%2BBUoGbk3kITQgL0mgwVTBmGQu8iO5lioslJL0kgvin1pBKFel739R8y51NsEtcp1hySiSvGRBUqqlmPPNArVrh%2F2O%2F2Cds62SPF6RQ0JgvstHodwRVmrhKcdC5ZgP9bdUomO6iRw%2BWeT6H1xFJTRqtIM%2FhY8xgsB7RKkwMTzTyJewMDDzOzpyH1lz6K5Ywk5XKpQY6nwEmsaR73%2B8GzFgW2%2F9zSLrXZHii0Glo301nTJrfeuvf6EKbszFn6Zwb2d8piXZo0EeQkpY6naZFy68lKAjXHztDN0f3XhzB1%2FrSnJgLZL5Sq%2Fl%2BIgA%2BXNgtCRle8Swk5pMQn6NcD0HBr99fdHmmKwLOFF%2FTg5nFVT%2F8N7Yr1l3vfxCPBdzRhIgwr8P%2FK2SR9J9i8uwmZcqLa%2FZbw5w1LH0%3D&Expires=1689423084',
                    projection: "EPSG:3857",
                    imageExtent: [117.1595, 21.2646, 123.9804, 26.5353]
                }),
            })

            map.addLayer(vectorLayer)
        }

        function shlayer () {
            console.log(map.getLayers())
        }

        return {
            map,
            adLayer,
            shlayer
        }
    }
}
</script>

<template>
    <div>
        <div id="imgMap"></div>
        <button @click="adLayer()">21</button>
        <button @click="shlayer()">00</button>
    </div>
</template>

<style lang="sass" scoped>
#imgMap
    // position: fixed
    // top: -99999px
    // left: -99999px
    width: 100vw
    height: 1000px
</style>

<!-- https://s3.ap-northeast-1.amazonaws.com/common.cwb.images/ncdr/forecast.png?
AWSAccessKeyId=ASIAU6XV5PTRDZMDPUXB
Signature=KCx%2BU6HxCmMHcslpU2Epbd7fpug%3D
x-amz-security-token=IQoJb3JpZ2luX2VjEJ7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0xIkcwRQIhAOfUJKB%2B0XKZdWPNmuknzVlrAYjAvjk8i4qK7pTKxxEQAiBuGZCkssBgtviyEAVBORaortxdP2gOKIjtmqCeUKHICir5AggnEAAaDDM0MDg5MTg5Mjk2MiIMB2YP5hVKFfBSei0WKtYCkFKH8ICWeVfSTZ4UJRrsJHaDWzCgW1rFFqqB7ovoeJJb5cbWglmM1BFTDU7iecL2t%2Fl2cRSgwDE9nC4KBkRKUOUrgzQdzQS66t9vSTmDtgMwXr%2F7MbTfWauX37VO3XPUbPoW0ico3yY73Im07hXyfzKNajgEkxqm%2BQiNi%2Fy6aiC22E9LbvqZoPWsKXFb16dW%2F5Uo3xfWc3P0W%2B8suEjHS7QBflSaI0bYP2jzt6Da%2BeXBvZg8l9RGp9me%2FGYfwf1WMWohoTfh9qgHYq8XS3FXLz%2BAiQx34XVRHvfMXGl%2Fq8dA9s6gOSVSOGTARYveZ%2B0HJwUJARbnZvRJAaeba0bWNTYiHnf2%2BEyeWJ68bLUNJq6GKYBtoyBtgDLcyKzzntlVKAGlWnXGZcmdhXttWnV5MWUg2MMRJO8e2aAd0Z8CK89X5m86UQUimKWSRNJfVmlt03Zp%2Fl4OMNDsyKUGOp4BHRpdUY18O5lPk2lGe92aIeT3EEV%2FPznNtcAeoRnhIjYeNJ92GpjkpYEbuKxAOSJsUHLFjaAv4yXaR72h9Om2emdh399NH54XOhI%2BR6qRvwfn927aefjE7iCcpxhkexyagNcn03DnGOPkwBQjTfJOllwGUkUDT6pU5pPTuNh6CzgaclpBPPoypWJ%2FciBtBPcc3Nn%2BQV6kJIn9GSOsa%2Bs%3D
Expires=1689401702 -->
