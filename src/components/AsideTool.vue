<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import "leaflet.locatecontrol"
import all from './../assets/styles/all.css'
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
        <!-- <a href="" @click.prevent="location">
            <svg width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor"
                    d="M12 22.95q-.425 0-.712-.287Q11 22.375 11 21.95v-1q-3.125-.35-5.362-2.587Q3.4 16.125 3.05 13h-1q-.425 0-.713-.288q-.287-.287-.287-.712t.287-.713Q1.625 11 2.05 11h1q.35-3.125 2.588-5.363Q7.875 3.4 11 3.05v-1q0-.425.288-.713q.287-.287.712-.287t.713.287q.287.288.287.713v1q3.125.35 5.363 2.587Q20.6 7.875 20.95 11h1q.425 0 .713.287q.287.288.287.713t-.287.712q-.288.288-.713.288h-1q-.35 3.125-2.587 5.363Q16.125 20.6 13 20.95v1q0 .425-.287.713q-.288.287-.713.287ZM12 19q2.9 0 4.95-2.05Q19 14.9 19 12q0-2.9-2.05-4.95Q14.9 5 12 5Q9.1 5 7.05 7.05Q5 9.1 5 12q0 2.9 2.05 4.95Q9.1 19 12 19Zm0-3q-1.65 0-2.825-1.175Q8 13.65 8 12q0-1.65 1.175-2.825Q10.35 8 12 8q1.65 0 2.825 1.175Q16 10.35 16 12q0 1.65-1.175 2.825Q13.65 16 12 16Z">
                </path>
            </svg>
        </a> -->
        <p class="qaz">Click on the Vite and Vue logos to learn more</p>
    </div>
</template>

<style lang="scss">
.qaz{
  // color: $blue;
}
// .aside {
//   background: red;
//   width: 50px;
//   height: 50px;
// }
</style>

