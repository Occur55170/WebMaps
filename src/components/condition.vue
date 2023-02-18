<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
export default {
  setup(props, { emit }){
    const state=reactive({
    })

    function onMapControl(action, value) {
        emit('onMapControl', {action, value})
    }

    function onLayerControl(action, value) {
        emit('onLayerControl', {action, value})
    }

    return {
      state,
      onMapControl,
      onLayerControl
    }
  }
}
</script>

<template>
    <div class="p-3">
        <p>地圖狀態 {{ state.targetNum }} : </p>
        <p>1.點擊
        <div class="text-blue" @click.prevent="onMapControl('moveTo', { xAxis: -98.144457, yAxis: 26.178938 })">前往示範案例
        </div>
        </p>
        <div>
            <input type="checkbox" name="example" id="example" @change="(e) => {
                onLayerControl('mapMode', {
                    checked: e.target.checked,
                    layersName: 'america',
                })
            }">
            <label for="example">2.開啟圖層</label>
        </div>
        <p class="">圖層選項</p>
        <div>
            <ul>
                <li><a href="">核心圖層</a></li>
                <li><a href="">衛星影像</a></li>
                <li><a href="">航空照片</a></li>
                <li><a href="">核心圖層 </a></li>
            </ul>
        </div>
    </div>
</template>

<style lang="sass">
</style>