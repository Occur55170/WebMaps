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

        function onMapControl(action) {
            emit('onMapControl', {action})
        }

        return {
            onMapControl
        }
    }
}

</script>

<template>
    <div class="d-flex flex-nowrap flex-column">
        <a href="" class="d-none d-sm-block order-1 mb-0" @click.prevent="onMapControl('In')">
            <img src="@/assets/img/icon/zoomIn.svg" alt="zoomIn">
        </a>
        <a href="" class="d-none d-sm-block order-1 mb-2" @click.prevent="onMapControl('Out')">
            <img src="@/assets/img/icon/zoomOut.svg" alt="zoomOut">
        </a>
        <a href="" class="order-1 mb-2" @click.prevent="onMapControl('toNorth')">
            <img src="@/assets/img/icon/compass.svg" alt="compass">
        </a>
        <a href="" class="order-1 mb-2" @click.prevent="onMapControl('moveTo')">
            <img src="@/assets/img/icon/location.svg" alt="location">
        </a>
        <a href="" class="order-1 mb-2" @click.prevent="onMapControl('fullScreen')">
            <img src="@/assets/img/icon/zoom.svg" alt="zoom">
        </a>
    </div>
</template>

