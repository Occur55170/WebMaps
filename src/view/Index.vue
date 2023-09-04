<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import router from '@/router/index.js'

export default {
  setup(props, { emit }){
    const state=reactive({
    })
    const route = router
    const name = ref()
    return {
      state,
      route,
    }
  }
}
</script>

<template>
  <div class="wrap">
    <div class="startCon d-flex justify-content-between">
        <!-- w-100 w-sm-50 -->
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
    <div class="tip d-flex flex-sm-nowrap flex-wrap justify-content-sm-around justify-content-start px-2 px-sm-0 py-3 fixed-bottom">
        <span>台灣整合防災工程技術顧問有限公司</span>
        <span>公司地址：236新北市土城區中央路三段281巷15弄14號</span>
        <span>E-mail：salahayo3192@gmail.com</span>
        <span>Copyright © 2023 台灣整合防災工程技術顧問有限公司</span>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import '@/assets/styles/all.module.scss'
.wrap
    background-image: url('@/assets/img/indexBackground.svg')
    background-repeat: no-repeat
    background-size: 100% auto
    background-position: bottom
    box-sizing: border-box
    padding: 5%
.startCon
    width: 95%
    .logo
        margin-bottom: 40px
    .content
        box-sizing: border-box
        padding: 60px
        margin: 50px 0
        width: 50%
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
.tip
    font-size: 16px
    background: rgb(255, 255, 255, 0.7)
@media (max-width: 1700px)
    .wrap
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
@media (max-width: 1700px)
    .startCon
        width: 100%
        padding: 30px 0 30px 30px
        .content
            width: 60%
        .overLay
            width: 40%
            transform: unset
            img
                width: 100%

@media (max-width: 600px)
    .wrap
        background-image: url('@/assets/img/indexBackground-m.svg')
        background-size: cover
        padding: 10px
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

.tip
    font-size: 14px
    background: rgb(255, 255, 255, 1)
</style>