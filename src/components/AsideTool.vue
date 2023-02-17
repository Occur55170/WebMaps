<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
export default {
    props: {
        id:{
            Type: String,
            default: 0
        },
        map:{}
    },
    setup(props, { emit }){
        setTimeout(()=>{
            console.log(props)
        }, 10000)
        // const emit = defineEmits(['add'])
        const state=reactive({
        })
        // const map = ref(null) // 地圖容器

        function zoomIn() {
            emit('add','add')
            // let view = map.value.getView() // 获取当前视图
            // let zoom = view.getZoom() // 获取当前缩放级别
            // view.setZoom(zoom + 1)
        }

        function zoomOut() {
            // let view = map.value.getView() // 获取当前视图
            // let zoom = view.getZoom() // 获取当前缩放级别
            // view.setZoom(zoom - 1)
        }
        return {
            zoomIn,
            zoomOut
        }
    }
}

</script>

<template>
    <div>
        <a href="" class="asideTool-btn order-1 mb-0" @click.prevent="mapControl('In')">
            <img src="./assets/img/icon/zoomIn.svg" alt="zoomIn">
        </a>
        <a href="" class="asideTool-btn order-1 mb-2" @click.prevent="mapControl('Out')">
            <img src="./assets/img/icon/zoomOut.svg" alt="zoomOut">
        </a>
        <a href="" class="asideTool-btn order-1 mb-2" @click.prevent="mapControl('toNorth')">
            <img src="./assets/img/icon/compass.svg" alt="compass">
        </a>
        <a href="" class="asideTool-btn order-1 mb-2" @click.prevent="layerControl('moveTo')">
            <img src="./assets/img/icon/location.svg" alt="location">
        </a>
        <a href="" class="asideTool-btn order-1 mb-2" @click.prevent="mapControl('fullScreen')">
            <img src="./assets/img/icon/zoom.svg" alt="zoom">
        </a>
    </div>
</template>

<style lang="sass">
.aside
  height: 50px
  font-weight: bold

.a
    background: #fff
    margin: 20px
    padding: 20px
    font-size: 20px
    border: 1px solid #000
</style>

