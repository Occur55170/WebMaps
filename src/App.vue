<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

export default {
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const state = reactive({})

        // function ajax() {
        //     $.ajax({
        //         url: 'http://gis.edtest.site:8010/ogc/temp?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYER=%E6%96%B0%E7%AB%B9%E7%B8%A3%E5%8E%9F%E4%BD%8F%E6%B0%91%E9%83%A8%E8%90%BD%E7%AF%84%E5%9C%8D&FORMAT=image/png&STYLE=default&SLD_VERSION=1.1.0'
        //     }).done(res => {
        //         console.log(res)
        //     })


        // }
        // https://pointed-mechanic-cd3.notion.site/abba132bfdb84ee89179b1de4a66dd35
        return {
            state,
        }
    }
}
</script>

<template>
    <!-- <Wes /> -->
    <routerView />
    <!-- <div class="main"> -->
        <!-- <WebMap /> -->
    <!-- </div> -->
    <!-- <mapDetails /> -->

</template>

<style lang="sass">
// @import './assets/styles/all.module.scss'
.mapContent
    height: 100vh
    width: 100vw
.main
    position: fixed
    top: 0
    left: 0
    height: 100%
    width: 100%

.LayoutTool
    position: absolute
    top: 0
    left: 0
    z-index: 220
.lightWrap
    z-index: 999
    position: fixed
    top: 0
    left: 0
    background: rgb(0, 0, 0, 0.1)
    .lightbox
        background: #fff
</style>
