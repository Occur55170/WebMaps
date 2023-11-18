<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import router from '@/router/index.js'

export default {
  setup(props, { emit }){
    const state=reactive({})
    const route = router
    return {
      state,
      route,
    }
  }
}
</script>

<template>
    <div class="wrap">
        <div class="wrapCom">
            <div class="startCon d-flex justify-content-between">
                <div class="content px-0 px-sm-5 position-relative">
                    <img src="@/assets/img/logo.svg" class="logo w-100 w-sm-80" alt="">
                    <p class="fs-sm-6 fs-5">保護您與家人，防範災害。提供最新安全資訊、防護措施和應對指南。建立安全居住環境，增強防災能力。攜手合作，共築安全明天！</p>
                    <a href="" class="d-inline-block" @click.prevent="route.push({name: 'map'})">
                        <img src="@/assets/img/enterMapBtn.svg" alt="">
                    </a>
                </div>
                <div class="overLay">
                    <img src="@/assets/img/indexOverlay.png" class="d-block w-100" alt="">
                </div>
            </div>
        </div>
        <div class="qualify fw-bold d-flex flex-wrap flex-xxl-nowrap justify-content-center align-items-center mx-0 py-5">
            <div class="d-flex align-items-start justify-content-center my-5 me-4 px-3 px-sm-5 px-xxl-0 flex-wrap">
                <img src="../assets/img/IndexLeft.png" alt="" class="mb-5 mb-sm-0 me-sm-5">
                <div>
                    <p class="title fs-2 fw-bold">
                        本平台使用對象
                    </p>
                    <ul class="list-unstyled">
                        <li>一般民眾</li>
                        <li>縣市、鄉鎮政府</li>
                    </ul>
                </div>
            </div>
            <div class="d-flex align-items-start justify-content-center my-5 px-3 px-sm-5 px-xxl-0 flex-wrap">
                <img src="../assets/img/IndexRight.png" alt="" class="mb-5 mb-sm-0 me-sm-5">
                <div>
                    <p class="title fs-2 fw-bold">
                        災害主題
                    </p>
                    <ul class="row list-unstyled mx-0">
                        <li class="col-6 col-sm-4 col-xxl-4">水系</li>
                        <li class="col-6 col-sm-4 col-xxl-4">自來水</li>
                        <li class="col-6 col-sm-4 col-xxl-4">斷層與土壤液化</li>
                        <li class="col-6 col-sm-4 col-xxl-4">災害潛勢</li>
                        <li class="col-6 col-sm-4 col-xxl-4">歷史災點</li>
                        <li class="col-6 col-sm-4 col-xxl-4">海嘯溢淹及海岸災害</li>
                        <li class="col-6 col-sm-4 col-xxl-4">道路</li>
                        <li class="col-6 col-sm-4 col-xxl-4">露營區</li>
                        <li class="col-6 col-sm-4 col-xxl-4">其他基本圖資</li>
                        <li class="col-6 col-sm-4 col-xxl-4">重要地標地物</li>
                        <li class="col-6 col-sm-4 col-xxl-4">淹水潛勢</li>
                        <li class="col-6 col-sm-4 col-xxl-4">即時預測</li>
                        <li class="col-6 col-sm-4 col-xxl-4">生態資料</li>
                        <li class="col-6 col-sm-4 col-xxl-4">土石流、山崩</li>
                    </ul>
                </div>
            </div>
        </div>
        <footer class="border-top px-2 px-sm-0 py-3">
            <div class="mt-3 mb-4">
                <p class="mb-1 text-center">圖台系統版權 台灣整合防災工程技術顧問有限公司版權所有。本網站所有資料僅供參考用途，不得作為任何形式證明或主張</p>
            </div>
            <div class="tip d-flex flex-xl-nowrap flex-wrap justify-content-sm-around justify-content-start">
                <span class="mb-2 mb-lg-0">管理單位：台灣整合防災工程技術顧問有限公司</span>
                <span class="mb-2 mb-lg-0">公司地址：236新北市土城區中央路三段281巷15弄14號</span>
                <span class="mb-2 mb-lg-0">E-mail：salahayo3192@gmail.com</span>
                <span class="mb-2 mb-lg-0">Copyright © 2023 台灣整合防災工程技術顧問有限公司</span>
            </div>
        </footer>
    </div>
</template>

<style lang="sass" scoped>
@import '@/assets/styles/all.module.scss'
.wrapCom
    background-image: url('@/assets/img/indexBackground.svg')
    background-repeat: no-repeat
    background-size: 100%
    background-position: bottom
    box-sizing: border-box
    padding: 2% 5% 8% 5%
.startCon
    width: 95%
    .logo
        margin-bottom: 40px
    .content
        box-sizing: border-box
        padding: 40px 60px
        margin: 50px 0
        width: 40vw
        &>p
            margin-bottom: 60px
        &::before
            content: ''
            background-image: url('@/assets/img/indexTitle-top.svg')
            background-repeat: no-repeat
            transform: scaleY(-1)
            display: block
            width: 100%
            height: 30px
            position: absolute
            left: 0
            top: 0
        &::after
            content: ''
            background-image: url('@/assets/img/indexTitle-bottom.svg')
            background-repeat: no-repeat
            background-position: right
            display: block
            width: 100%
            height: 30px
            position: absolute
            left: 0
            bottom: 0
    .overLay
        transform: scale(1.1)
.qualify
    img
        height: 265px
    .title
        color: #2D3E7A
        &::after
            content: ''
            width: 60px
            height: 2px
            background: #2D3E7A
            display: block
    li
        margin-bottom: 10px
        font-size: 18px
    &>div:nth-Child(1)
        width: 35%
    &>div:nth-Child(2)
        width: 65%
.tip
    font-size: 14px
    background: rgb(255, 255, 255, 0.7)
@media (max-width: 1700px)
    .wrapCom
        background-size: 100% auto
        background-position: bottom
    .startCon
        width: 100%
        padding: 30px 0 30px 30px
        .content
            width: 55%
        .overLay
            width: 40%
            transform: unset
@media (max-width: 1400px)
.qualify
    &>div:nth-Child(1),
    &>div:nth-Child(2)
        width: 100%
@media (max-width: 600px)
    .wrapCom
        background-image: url('@/assets/img/indexBackground-m.svg')
        background-size: cover
        padding: 20px 10px 40vh 10px
    .startCon
        width: 100%
        padding: 10px
        .logo
            margin:10px 0
            width: 70% !important
        .content
            box-sizing: border-box
            padding: 30px 0
            margin: 0
            text-align: center
            width: 100%
            &>p
                margin: 20px 0
                text-align: left
                line-height: 1.6
            &::before
                content: ''
                background-image: url('@/assets/img/indexTitle-top.svg')
                background-repeat: no-repeat
                background-size: contain
                display: block
                width: 70%
                height: 16px
            &::after
                display: none
            &>a
                width: 50%
                img
                    width: 100%
        .overLay
            display: none
    .qualify
        background: #fff
        img
            height: auto
            width: 80%
            margin: 0 auto
    .tip
        font-size: 14px
        background: rgb(255, 255, 255, 1)
</style>