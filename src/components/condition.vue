<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'

export default {
    props: {
        onClose: {
            type: Function,
            default: ()=>{}
        },
        mapLayers: {
            type: Array,
            default: []
        },
        currentLayers: {
            type: Array,
            default: []
        },
    },
    setup(props, { emit }) {
        const state = reactive({
            currentConditionPage: 'coreLayer',
            currentLayers: computed(()=>{
                // needFix
                return props.currentLayers.map(node=>node)
            }),
            currentLayerNames: computed(()=>{
                // needFix
                return props.currentLayers.map(node=>node.name)
            })
        })

        function onMapControl(action, value) {
            emit('onMapControl', { action, value })
        }

        function onLayerControl(action, value, layerName) {
            emit('onLayerControl', { action, value, layerName })
        }
        function open (value){
            // needFix
            if (!$(`.${value} .title`).find('svg').hasClass('openTitle')) {
                $(`.${value} .wrap`).slideDown()
                $(`.${value} .title`).find('svg').addClass('openTitle')
            } else {
                $(`.${value} .wrap`).slideUp()
                $(`.${value} .title`).find('svg').removeClass('openTitle')
            }
        }

        return {
            props,
            state,
            onMapControl,
            onLayerControl,
            open
        }
    }
}
</script>

<template>
    <div class="rounded-4 bg-white">
        <div class="row mx-0 align-items-center flex-nowrap text-center p-2 fw-bold">
            <p class="mb-0">圖層選項</p>
            <a href="" class="closeBtn position-absolute col-auto" @click.prevent="props.onClose">
                <svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm0-11.414L9.172 7.757L7.757 9.172L10.586 12l-2.829 2.828l1.415 1.415L12 13.414l2.828 2.829l1.415-1.415L13.414 12l2.829-2.828l-1.415-1.415L12 10.586z"/></svg>
            </a>
        </div>
        <div class="LayerType row flex-nowrap mx-0">
            <button @click="state.currentConditionPage = 'coreLayer'" class="border-0 py-2 px-2 col text-center text-white text-decoration-none col-3">
                <img src="../assets/img/icon/coreLayerIcon.svg" alt="zoomIn">
                核心圖層
            </button>
            <button @click="state.currentConditionPage = 'satelliteImagery'" class="border-0 py-2 px-2 col text-center text-white text-decoration-none col-3">
                <img src="../assets/img/icon/satelliteImageryIcon.svg" alt="zoomIn">
                衛星影像
            </button>
            <button @click="state.currentConditionPage = 'aerialPhoto'" class="border-0 py-2 px-2 col text-center text-white text-decoration-none col-3">
                <img src="../assets/img/icon/aerialPhotoIcon.svg" alt="zoomIn">
                航空照片
            </button>
            <button @click="state.currentConditionPage = 'aerialLayer'" class="border-0 py-2 px-2 col text-center text-white text-decoration-none col-3">
                <img src="../assets/img/icon/aerialLayerIcon.svg" alt="zoomIn">
                空拍圖層
            </button>
        </div>
        <div class="py-3 px-4 content">
            <div v-if="state.currentConditionPage === 'coreLayer'">
                <div class="mb-2 landBoundary">
                    <div class="title d-flex align-items-center fw-bold text-black order-1 mb-0 text-decoration-none" @click="open('landBoundary')">
                        <img src="../assets/img/icon/landBoundary.svg" alt="">
                        行政及土地區界
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
                    </div>
                    <div class="wrap">
                        <div>
                            <div class="text-blue"
                                @click.prevent="onMapControl('moveTo', { xAxis: -98.144457, yAxis: 26.178938 })">go前往示範案例(america)
                            </div>
                        </div>
                        <div v-for="(item, index) in props.mapLayers">
                            <input type="checkbox" name="example2" id="example2"
                            :checked="props.currentLayers.some(node=>node.name === item)"
                            @change="(e) => {
                                onLayerControl('layerMode', {
                                    checked: e.target.checked,
                                    layerName: item,
                                })
                            }">
                            <label :for="`example${index}`">{{ item }}</label>
                        </div>
                    </div>
                </div>
                <div class="mb-2 landMark">
                    <div class="title d-flex align-items-center fw-bold text-black order-1 mb-0 text-decoration-none" @click="open('landMark')">
                        <img src="../assets/img/icon/landMark.svg" alt="">
                        路網與地標
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
                    </div>
                    <div class="wrap">
                        <div>
                            <input type="checkbox">
                            <label for="">高鐵</label>
                        </div>
                        <div>
                            <input type="checkbox">
                            <label for="">台鐵</label>
                        </div>
                        <div>
                            <input type="checkbox">
                            <label for="">台鐵車站</label>
                        </div>
                        <div>
                            <input type="checkbox">
                            <label for="">捷運</label>
                        </div>
                        <div>
                            <input type="checkbox">
                            <label for="">路網地名混合圖</label>
                        </div>
                        <div>
                            <input type="checkbox">
                            <label for="">原住民部落聯絡道</label>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="state.currentConditionPage === 'satelliteImagery'">2</div>
            <div v-if="state.currentConditionPage === 'aerialPhoto'">3</div>
            <div v-if="state.currentConditionPage === 'aerialLayer'">4</div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
@import '../assets/styles/all.module.scss'
.closeBtn
    right:10px
    svg
        width: 20px
        height: 20px
.LayerType
    button
        background: $blue-steel
        &:hover
            background: #3DC4C4
.content
    .title
        cursor: pointer
        svg
            transform: rotateZ(0)
        .openTitle
            transform: rotateZ(90deg)
    svg
        width: 20px
        height: 20px
    img
        width: 16px
        height: 16px
    .wrap
        display: none
</style>