<script>
import { onMounted, reactive } from 'vue'

import { Feature, Map, View } from 'ol'
import 'ol/ol.css'
import { OSM } from 'ol/source'
import TileLayer from 'ol/layer/Tile';
import Vector from 'ol/layer/Vector';



import VectorSource from 'ol/source/Vector'
import { Icon, Style } from 'ol/style'
import { Point } from 'ol/geom'
import { toPng } from 'html-to-image'
import currentPositionImg from '@/assets/img/icon/currentPosition.svg'

export default {
  props: {
    coordinate: {
      type: Object,
      default: {},
    },
  },
  setup(props, { emit }){
    let map
    const state = reactive({
      imgSrc: 'dddd',
    })
    onMounted(async () => {
      map = new Map({
        target: 'imgMap',
        layers: [
          new TileLayer({
            preload: Infinity,
            crossOrigin: 'Anonymous',
            source: new OSM(),
          }),
          new Vector({
            source: new VectorSource({
              features: [
                new Feature({
                  geometry: new Point(props.coordinate),
                  population: 4000,
                  rainfall: 500,
                }),
              ],
            }),
            style: new Style({
              image: new Icon({
                anchor: [0.5, 100],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: currentPositionImg,
              }),
            }),
          }),
        ],
        view: new View({
          projection: 'EPSG:4326',
          center: props.coordinate,
          zoom: 14,
        }),
      })
      map.once('loadend', function(){
        toPng(map.getTargetElement()).then(function(dataURL){
          if (document.getElementById('imgMap') !== null){
            document.getElementById('imgMap').remove()
            state.imgSrc = dataURL
          }
        })
      })
    })
    return {
      props,
      state,
    }
  },
}
</script>

<template>
  <div class="position-relative" style="overflow: hidden">
    <div
        id="imgMap"
        class="position-absolute"
        style="width: 600px; height: 600px"
    ></div>
    <div
        :style="{
        background: `url('${state.imgSrc}')`,
        'background-size': 'cover',
      }"
        style="width: 100%; height: 200px"
    ></div>
  </div>
</template>

<style lang="sass" scoped>
#imgMap
  top: 0
  left: 0
</style>
