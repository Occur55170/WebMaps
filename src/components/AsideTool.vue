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
    <div class="aside">
        <div class="a" @click="zoomIn">放大</div>
        <div class="a" @click="zoomOut">縮小</div>
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

