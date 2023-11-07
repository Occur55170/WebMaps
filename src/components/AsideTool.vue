<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
export default {
    props: {
        id:{
            Type: String,
            default: 0
        },
        map:{},
        onChangeTarget: {
            type: Function,
            default: () => {}
        },
    },
    setup(props, { emit }){

        const state = reactive({
            targetNum: 1,
        })

        function onMapControl(action) {
            emit('onMapControl', {action})
        }

        return {
            props,
            state,
            onMapControl,
        }
    }
}

</script>

<template>
    <div class="d-flex flex-nowrap flex-column">
        <OverLayer :text="'地圖操控工具'" />
        <div class="switchControl d-block rounded-4 p-2 mb-2" id="switchControl" style="z-index: 99;">
            <div class="text-white text-center rounded"
            :class="{ 'active': state.targetNum === 1 }"
                @click="() => {
                    state.targetNum = 1
                    props.onChangeTarget(1)
                }">上</div>
                <div class="text-white text-center rounded"
                :class="{ 'active': state.targetNum === 2 }"
                @click="() => {
                    state.targetNum = 2
                    props.onChangeTarget(2)
                }">下</div>
            </div>

        <a href="#" class="d-none d-sm-block order-1 mb-0" @click.prevent="onMapControl('In')">
            <img src="@/assets/img/icon/zoomIn.svg" alt="zoomIn">
        </a>
        <a href="#" class="d-none d-sm-block order-1 mb-2" @click.prevent="onMapControl('Out')">
            <img src="@/assets/img/icon/zoomOut.svg" alt="zoomOut">
        </a>
        <a href="#" class="order-1 mb-2" @click.prevent="onMapControl('toNorth')">
            <img src="@/assets/img/icon/compass.svg" alt="compass">
        </a>
        <a href="#" class="order-1 mb-2" @click.prevent="onMapControl('moveTo')">
            <img src="@/assets/img/icon/location.svg" alt="location">
        </a>
        <a href="#" class="order-1" @click.prevent="onMapControl('fullScreen')">
            <img src="@/assets/img/icon/zoom.svg" alt="zoom">
        </a>
    </div>
</template>

<style lang="sass" scoped>
.switchControl
    background: rgba(30, 30, 30, 0.9)
    box-sizing: border-box
    div
        padding:5px
        cursor: pointer
        box-sizing: border-box
    .active
        background: #247BA0
</style>

