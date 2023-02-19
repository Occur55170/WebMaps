<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
export default {
    props: {
        currentLayerNames: {
            type: Array,
            default: []
        }
    },
    setup(props, { emit }) {
        const state = reactive({
            test: computed(()=>{
                return props.currentLayerNames
            })
        })

        function onMapControl(action, value) {
            emit('onMapControl', { action, value })
        }

        function onLayerControl(action, value, layerName) {
            emit('onLayerControl', { action, value, layerName })
        }

        return {
            props,
            state,
            onMapControl,
            onLayerControl
        }
    }
}
</script>

<template>
    <div class="">
        <div class="text-center p-2">圖層選項</div>
        <div class="LayerType row flex-nowrap mx-0">
           <a href="" class="py-1 px-3 col text-center text-white text-decoration-none">核心圖層</a>
           <a href="" class="py-1 px-3 col text-center text-white text-decoration-none">衛星影像</a>
           <a href="" class="py-1 px-3 col text-center text-white text-decoration-none">航空照片</a>
           <a href="" class="py-1 px-3 col text-center text-white text-decoration-none">核心圖層 </a>
        </div>
        <div class="py-4 px-4">
            <div>
                行政及土地區界
                <ul>
                    <li></li>
                    <li></li>
                </ul>
            </div>
            <div>
                路網與地標
                <ul>
                    <li></li>
                    <li></li>
                </ul>
            </div>
            <div>

            </div>
            <div>

            </div>
        </div>
        <div class="head">圖層選項</div>
        {{ props.currentLayerNames }}
        <p>地圖狀態 {{ state.targetNum }} : </p>
        <p>1.點擊
            <div class="text-blue" @click.prevent="onMapControl('moveTo', { xAxis: -98.144457, yAxis: 26.178938 })">前往示範案例
            </div>
        </p>
        <p>
            <input type="checkbox" name="example" id="example" @change="(e) => {
                onLayerControl('mapMode', {
                    checked: e.target.checked,
                    layerName: 'america',
                })
            }">
        </p>
        <p>
            <input type="checkbox" name="example" id="example" @change="(e) => {
                onLayerControl('mapMode', {
                    checked: e.target.checked,
                    layerName: 'EsriJSON',
                })
            }">
            <label for="example">3.開啟圖層</label>
        </p>
    </div>
</template>

<style lang="sass" scoped>
@import '../assets/styles/all.module.scss'
.LayerType
    a
        background: $blue-steel
        &:hover
            background: #90ee90
</style>