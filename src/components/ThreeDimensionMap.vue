<script>
import { reactive } from 'vue'

export default {
    props: {},
    setup(props){
        const state = reactive({})
        // const viewer = new Cesium.Viewer('cesiumContainer', {
        //     terrain: Cesium.Terrain.fromWorldTerrain(),
        // })

        return {
            state,
            props,
        }
    },
}
</script>

<template>
  <div id="cesiumContainer" class="fullSize"></div>
</template>

<style>
/* @import url(../templates/bucket.css); */
#toolbar {
  background: rgba(42, 42, 42, 0.8);
  padding: 4px;
  border-radius: 4px;
}

#toolbar input {
  vertical-align: middle;
  padding-top: 2px;
  padding-bottom: 2px;
}

#toolbar .header {
  font-weight: bold;
}
</style>
