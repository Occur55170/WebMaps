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
    <div class="startCon">
        <!-- w-100 w-sm-50 -->
        <div class="content">
            <img src="@/assets/img/logo.svg" class="logo w-100 w-sm-80" alt="">
            <p class="fs-6">保護您與家人，防範災害。提供最新安全資訊、防護措施和應對指南。建立安全居住環境，增強防災能力。攜手合作，共築安全明天！</p>
            <a href="" class="d-inline-block" @click.prevent="route.push({name: 'map'})">
                <img src="@/assets/img/enterMapBtn.svg" alt="">
            </a>
        </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import '@/assets/styles/all.module.scss'
.wrap
    background-image: url('@/assets/img/indexBackground.svg')
    background-repeat: no-repeat
    background-size: cover
    background-position: bottom
    box-sizing: border-box
    padding: 100px
.startCon
    max-width: 900px
    .logo
        margin-bottom: 40px
    .content
        box-sizing: border-box
        padding: 0 0 0 60px
        margin: 50px 0
        &>p
            margin-bottom: 60px
    &::before
        content: ''
        background-image: url('@/assets/img/indexHead-be.svg')
        background-repeat: no-repeat
        display: block
        width: 100%
        height: 30px
    &::after
        content: ''
        background-image: url('@/assets/img/indexHead-af.svg')
        background-repeat: no-repeat
        display: block
        width: 100%
        height: 30px
        background-position: right
@media (max-width: 1700px)
    .startCon
        max-width: 70%
        padding: 30px

@media (max-width: 600px)
    .wrap
        background-image: url('@/assets/img/indexBackground-m.svg')
        background-size: cover
        padding: 10px
    .startCon
        max-width: 900px
        padding: 30px
        .logo
            margin-bottom: 0
        .content
            box-sizing: border-box
            padding: 0 0 0 20%
            margin: 50px 0
            text-align: center
            &>p
                margin: 30px 0
                text-align: left
                line-height: 1.6
        &::before
            content: ''
            background-image: url('@/assets/img/indexHead-be.svg')
            background-repeat: no-repeat
            background-size: contain
            display: block
            width: 70%
            height: 16px
        &::after
            display: none
</style>