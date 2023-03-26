<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'

export default {
    props: {
        id:{
            Type: String,
            default: 0
        },
        closeMapData: {
            Type: Function,
            default: ()=>{}
        }
    },
    setup(props, { emit }){
        const state = reactive({})


        return {
            props,
            state,
        }
    }
}

</script>

<template>
    <div class="bg-white rounded py-2">
        <div class="row mx-0 align-items-center flex-nowrap text-center p-2 fw-bold">
            <p>詳細資訊</p>
            <!-- needfix:尚未加入關閉地圖資訊按鈕事件 -->
            <!-- <a href="" class="position-absolute col-auto end-0" style="top: 10px;" >
                <svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm0-11.414L9.172 7.757L7.757 9.172L10.586 12l-2.829 2.828l1.415 1.415L12 13.414l2.828 2.829l1.415-1.415L13.414 12l2.829-2.828l-1.415-1.415L12 10.586z"/></svg>
            </a> -->
        </div>
        <img src="../assets/example-AddressData.jpg" class="w-100" alt="">
        <div class="row mx-0 align-items-center p-2 position-relative">
            <p>title:{{ props?.id }}</p>
            <p>subtitle:副標題副標題副標題</p>
            <div class="position-absolute w-auto top-0 end-0 mt-2">更多資訊</div>
            <p>address300 新竹市東區大學路1001號</p>
            <a href="">24.791781619336316, 120.9984423386347</a>
        </div>
        <div>
            <div class="border-bottom d-flex justify-content-around p-2 mt-3">
                <div @click="">相片</div>
                <div @click="">影片</div>
            </div>
            <div class="py-2 px-4">
                <div>相片相片相片相片相片相片</div>
                <div>影片影片影片影片影片影片</div>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
// .lightbox
//     top: 20%
//     left: 50%
</style>
