<script>
import { computed, onMounted, reactive } from 'vue'
import $ from 'jquery'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

export function batchDownload(url, parameter){
    return axios({
        url,
        params: parameter,
        method: 'get',
        responseType: 'text',
    })
}

export default {
    props: {},
    setup(props, { emit }){
        const router = useRouter()
        const route = useRoute()
        const state = reactive({
            redArray: [134],
            mainTextColor: computed(() => {
                return state.redArray.includes(Number(route.params.id)) ? 'text-brown' : 'text-steel'
            }),
            mainBgColor: computed(() => {
                return state.redArray.includes(Number(route.params.id)) ? 'bg-brown' : 'bg-steel'
            }),
            type: computed(() => {
                return state.redArray.includes(Number(route.params.id)) ? 1 : 2
            }),
            coordinates: computed(() => {
                return (state.tribeData?.basicInformation?.coordinates) ? Object.entries(state.tribeData?.basicInformation?.coordinates) : null
            }),
            planObj: {},
            lightSwitch: false,
            currentText: '',
            targetUrl: '',
            loginFailed: false,
        })

        const tableFilter = function(name){
          return name.split(':')
        }

        function downloadPassword(){
            if (state.currentText === '28368864'){
                state.lightSwitch = false
                window.open(state.targetUrl, '_blank')
            } else {
                alert('密碼錯誤')
                state.loginFailed = true
            }
        }

        function openLightBox(item){
            state.lightSwitch = true
            state.targetUrl = item.url
            state.currentText = ''
            state.loginFailed = false
        }

        onMounted(async () => {
            await $.ajax({
                url: `https://api.edtest.site/engineering_plan?tribeCode=${route.params?.id}`,
                method: 'GET',
            }).done(res => {
                state.planObj = res
            }).fail(FailMethod => {
                console.log('Fail', FailMethod)
            })
        })

        return {
            route,
            router,
            state,
            tableFilter,
            downloadPassword,
            openLightBox,
        }
    },
}

</script>

<template>
  <div class="detail">
    <div class="redTotem" :class="state.type === 1 ? 'redTotem' : 'blueTotem'"></div>
    <div class="p-4">
      <div class="d-flex align-items-center justify-content-between w-100">
        <h1 class="text-brown fw-bold d-flex align-items-center w-100"
            :class="state.mainTextColor">
          <img src="@/assets/mapDetail/frame-1.png" v-if="state.type === 1"/>
          <img src="@/assets/mapDetail/frame-2.png" v-else>
          永續藍圖計畫工程
        </h1>
      </div>
      <div class="row">
        <div class="col-12 col-lg-6 mb-4 mb-lg-0">
          <img :src="state.planObj.engineeringPlan" class="w-100" alt="">
        </div>
        <div class="col-12 col-lg-6 position-relative" style="overflow-y: auto;">
          <div class="downloadList position-static position-lg-absolute d-flex flex-wrap table">
            <div class="thead d-flex shrink-1 flex-nowrap justify-content-between w-100">
              <div class="p-1 col-2 col-lg-3 text-white" :class="state.mainBgColor">記號</div>
              <div class="p-1 col-7 text-white" :class="state.mainBgColor">名稱</div>
              <div class="p-1 col-3 text-white" :class="state.mainBgColor">下載</div>
            </div>
            <div class="tbody w-100">
              <div class="d-flex shrink-0 flex-nowrap justify-content-between w-100"
                   v-for="(item, itemKey) in state.planObj.engineeringPlanInfo" :key="itemKey">
                <div class=" col-2 col-lg-3 bg-grey-light fw-bold">{{ tableFilter(item.name)[0] }}</div>
                <div class="col-7 bg-grey-light fw-bold">{{ tableFilter(item.name)[1] }}</div>
                <div class="col-3 bg-grey-light">
                  <a href="" class="btn py-1 text-white bg-grey" target="_blank"
                     @click.prevent="openLightBox(item)">
                    <img src="@/assets/img/icon/download.svg">
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="fs-6 mb-4">
        *本永續藍圖計畫項目由新竹縣政府與各管轄之公所提案，並由原民會核定後執行，故本資料為規劃成果，僅供地方政府參考，非實際執行之在建工程**。</p>
      <div class="d-flex justify-content-center">
        <a href="#" class="goBack btn bg-black text-white d-inline-block mb-4 cursor-pointer"
           @click.prevent="router.push({
                        name: 'detail',
                        params: {
                            id: route.params?.id
                        },
                    })">
          返回上頁
        </a>
      </div>
    </div>
    <div class="lightWrap w-100 h-100 d-flex justify-content-center align-items-center"
         v-if="state.lightSwitch"
         @click.prevent="state.lightSwitch = false">
      <div class="p-4 rounded bg-white d-flex align-items-center" @click.stop>
        <span>密碼：</span>
        <div class="mx-2" style="width: 300px;"
             :class="{'error': state.loginFailed}">
          <input class="me-2 w-100 px-2 py-1" type="text" name="password" placeholder="請輸入下載密碼"
                 v-model="state.currentText"
                 @input="state.loginFailed = false">
        </div>
        <button class="btn bg-steel text-white"
                @click.prevent="downloadPassword()">輸入
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import '@/assets/styles/all.module.scss'
.detail
  height: auto
  background-image: url('@/assets/mapDetail/background.svg')
  background-repeat: repeat
  box-sizing: border-box
  min-height: 100vh

.redTotem
  height: 135px
  background-image: url('@/assets/mapDetail/redTotem.svg')

.blueTotem
  height: 135px
  background-image: url('@/assets/mapDetail/blueTotem.svg')

.table
  text-align: center

  .thead, .tbody
    w-full
      box-sizing: border-box

  .thead > div, .tbody > div > div
    margin: 0 5px 5px 0
    padding: 5px
    display: flex
    justify-content: center
    align-items: center

.error
  position: relative

  input
    border: 1px solid red

  &::after
    content: '帳號或密碼錯誤；或使用者不存在。'
    color: red
    position: absolute
    top: 100%
    left: 0
    font-size: 12px

.downloadList
  width: 95%

@media (max-width: 768px)
  .downloadList
    width: 100%

</style>
