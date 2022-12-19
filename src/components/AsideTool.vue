<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import "leaflet.locatecontrol"
// import HelloWorldCss from '../assets/styles/helloWorld.module.scss'

export default {
  setup(props, { emit }) {
    const state = reactive({})
    const name = ref()
    function location() {
      // let latlng ={
      //     lat:25.0565767,
      //     lng:121.5712388
      // }
      // L.control.locate({setView: true, maxZoom: 15}).addTo(map);
      var lc = L.control.locate({
        position: "topright",
        strings: {
          title: "Show me where I am, yo!"
        }
      }).addTo(map);
    }

    return {
      state,
      location
    }
  }
}
</script>

<template>
  <div class="aside">
  </div>
</template>

<style lang="scss">
.aside {
  background: red;
  width: 50px;
  height: 50px;
}
</style>

