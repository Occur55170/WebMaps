<script>
import { computed, onMounted, reactive } from 'vue'
import $ from 'jquery'
import { useRoute, useRouter } from 'vue-router'
import frame1 from '@/assets/mapDetail/frame-1.png'
import frame2 from '@/assets/mapDetail/frame-2.png'

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
            tribeData: {},
        })

        function onMapControl(action){
            emit('onMapControl', { action })
        }

        function goTop(){
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        }

        onMounted(async () => {
            await $.ajax({
                url: `https://blueprint.indigenoustribe.tw/api/tribe?tribeCode=${route.params?.id}`,
                method: 'GET',
            }).done(res => {
                state.tribeData = res
            }).fail(FailMethod => {
                console.log('Fail', FailMethod)
            })
        })

        return {
            route,
            router,
            state,
            onMapControl,
            goTop,
            frame1,
            frame2,
        }
    },
}

</script>

<template>
  <div class="row mx-0 detail position-relative">
    <div class="redTotem" :class="state.type == 1 ? 'redTotem' : 'blueTotem'"></div>
    <div class="detailCon">
      <div class="row mx-0">
        <div class="aside col-2 px-0 d-none d-sm-block">
          <ul class="ps-0 list-unstyled">
            <li class="text-center mb-5">
              <a href="#section1" class="fs-5 bg-white py-3 fw-bold rounded text-decoration-none"
                 :class="state.mainTextColor">基本資料</a>
            </li>
            <li class="text-center mb-5" v-if="state.tribeData?.basicInformation?.tribalLandmark">
              <a href="#section2" class="fs-5 bg-white py-3 fw-bold rounded text-decoration-none"
                 :class="state.mainTextColor">部落地標</a>
            </li>
            <li class="text-center mb-5" v-if="state.tribeData?.naturalEnvironment">
              <a href="#section3" class="fs-5 bg-white py-3 fw-bold rounded text-decoration-none"
                 :class="state.mainTextColor">自然環境</a>
            </li>
            <li class="text-center mb-5">
              <a href="#section4" class="fs-5 bg-white py-3 fw-bold rounded text-decoration-none"
                 :class="state.mainTextColor">人文環境</a>
            </li>
            <li class="text-center mb-5" v-if="state.tribeData?.historicalDisasters?.length">
              <a href="#section5" class="fs-5 bg-white py-3 fw-bold rounded text-decoration-none"
                 :class="state.mainTextColor">歷史災害</a>
            </li>
            <li class="text-center mb-5" v-if="state.tribeData.visionVideo">
              <a href="#section6" class="fs-5 bg-white py-3 fw-bold rounded text-decoration-none"
                 :class="state.mainTextColor">動畫影片</a>
            </li>
            <li class="text-center mb-5" v-if="state.tribeData.engineeringVisionPosterThumbnail">
              <a href="#section7" class="fs-5 bg-white py-3 fw-bold rounded text-decoration-none"
                 :class="state.mainTextColor">文化地景圖</a>
            </li>
            <li class="text-center mb-5" v-if="state.tribeData.engineeringVisionPosterThumbnail">
              <a href="#section8" class="fs-5 bg-white py-3 fw-bold rounded text-decoration-none"
                 :class="state.mainTextColor">願景海報</a>
            </li>
            <li class="text-center mb-5" v-if="state.tribeData.engineeringVisionPosterThumbnail">
              <a href="#section9" class="fs-5 bg-white py-3 fw-bold rounded text-decoration-none"
                 :class="state.mainTextColor">災害徵兆調查成果</a>
            </li>
            <li class="text-center mb-5">
              <div class="fs-5 cursor-pointer bg-white py-3 fw-bold rounded text-decoration-none"
                   :class="state.mainTextColor"
                   :style="{
                                    boxShadow: '0 0 4px rgba(0, 0, 0, 0.25)'
                                }"
                   @click="() => {
                                    router.push({
                                        name: 'plane',
                                        params: {
                                            id: route.params?.id
                                        },
                                    })
                                }">永續工程計畫圖
              </div>
            </li>
          </ul>
        </div>
        <div class="detailMain col-12 col-sm-9">
          <h2 class="text-center fw-bold fs-1">{{ state.tribeData?.basicInformation?.tribeName }}</h2>
          <div class="section mb-5 mx-0 row flex-wrap align-items-center" id="section1">
            <div class="fs-5 text-brown fw-bold col-12 col-sm-3 mb-4 mb-sm-0 text-center d-flex align-items-center"
                 :class="state.mainTextColor">
              <img src="@/assets/mapDetail/frame-1.png" class="d-block d-sm-none" v-if="state.type == 1"/>
              <img src="@/assets/mapDetail/frame-2.png" class="d-block d-sm-none" v-else>
              聚落座標
            </div>
            <div class="col-12 col-sm-8">
              <p v-if="state.tribeData?.basicInformation?.coordinates">
                聚落坐標(
                <span
                    v-for="(coordinates, coordinates_i) in Object.keys(state.tribeData?.basicInformation?.coordinates)"
                    :key="coordinates_i">
                                    <span v-if="coordinates_i !== 0">,</span>
                                    {{ coordinates }}
                                </span>
                )
              </p>
              <p>代表性座標名稱：{{ state.tribeData?.basicInformation?.landmarkBuilding }}</p>
              <p v-for="(item, itemKey) in state.coordinates">
                <p>
                  【 {{ item[0] }}座標 】
                  <br class="d-block d-sm-none">
                  經度：{{ item[1]?.lng || item[1]?.x }}，緯度：{{ item[1]?.lat || item[1]?.y }}
                </p>
              </p>
            </div>
          </div>
          <div class="tribeBaseData d-flex flex-wrap flex-sm-nowrap mx-0 mb-5 justify-content-between d-flex">
            <div class="section py-4 px-0 text-center me-sm-2">
              <p class="mb-2 fs-5 fw-bold" :class="state.mainTextColor">
                <img :src="state.type === 1 ? frame1 : frame2"/>
                人口戶數
              </p>
              <p class="mb-0 fw-bold">{{ state.tribeData?.basicInformation?.totalHouseholds }}</p>
            </div>
            <div class="section py-4 px-0 mt-5 mt-sm-0 text-center me-sm-2">
              <p class="mb-2 fs-5 fw-bold" :class="state.mainTextColor">
                <img src="@/assets/mapDetail/frame-1.png" v-if="state.type == 1">
                <img src="@/assets/mapDetail/frame-2.png" v-else>
                聚落規模
              </p>
              <p class="mb-0 fw-bold">{{ state.tribeData?.basicInformation?.scale }}</p>
            </div>
            <div class="section py-4 px-0 mt-5 mt-sm-0 text-center">
              <p class="mb-2 fs-5 fw-bold" :class="state.mainTextColor">
                <img src="@/assets/mapDetail/frame-1.png" v-if="state.type == 1">
                <img src="@/assets/mapDetail/frame-2.png" v-else>
                行政區域
              </p>
              <p class="mb-0 fw-bold">{{ state.tribeData?.basicInformation?.area }}</p>
            </div>
          </div>
          <div class="section mb-5" id="section2" v-if="state.tribeData?.basicInformation?.tribalLandmark">
            <div class="fw-bold fs-5" :class="state.mainTextColor">
              <img src="@/assets/mapDetail/frame-1.png" v-if="state.type == 1">
              <img src="@/assets/mapDetail/frame-2.png" v-else>
              部落地標
            </div>
            <hr class="border-5 opacity-100 mt-1 mb-3" :class="state.mainTextColor">
            <div class="row flex-wrap flex-sm-nowrap mx-0 align-items-center">
              <img :src="state.tribeData?.basicInformation?.tribalLandmarkImage" alt="" class="col-12 me-sm-4 col-sm-4">
              <div class="col-8">
                <p>名稱 : {{ state.tribeData?.basicInformation?.tribalLandmark }}</p>
                <p>地址 : {{ state.tribeData?.basicInformation?.tribalLandmarkAddress }}</p>
                <p>簡介 : {{ state.tribeData?.basicInformation?.tribalLandmarkIntroduction }}</p>
              </div>
            </div>
          </div>
          <div class="section mb-5" id="section3" v-if="state.tribeData?.naturalEnvironment">
            <div class="fw-bold fs-5" :class="state.mainTextColor">
              <img src="@/assets/mapDetail/frame-1.png" v-if="state.type == 1">
              <img src="@/assets/mapDetail/frame-2.png" v-else>
              自然環境
            </div>
            <hr class="border-5 opacity-100 mt-1 mb-3" :class="state.mainTextColor">
            <div>
              <p>{{ state.tribeData?.naturalEnvironment }}</p>
            </div>
          </div>
          <div class="section mb-5" id="section4">
            <div class="fw-bold fs-5" :class="state.mainTextColor">
              <img src="@/assets/mapDetail/frame-1.png" v-if="state.type == 1">
              <img src="@/assets/mapDetail/frame-2.png" v-else>
              人文環境
            </div>
            <hr class="border-5 opacity-100 mt-1 mb-3" :class="state.mainTextColor">
            <div class="mb-3">
              <p class="mb-1">部落名稱:{{ state.tribeData?.basicInformation?.tribeName }}</p>
              <p>主要原住民族群:{{ state.tribeData?.basicInformation?.tribeEthnicity }}</p>
            </div>
            <div class="mb-3">{{ state.tribeData?.industry }}</div>
            <div>
              <div class="fw-bold mb-2" :class="state.mainTextColor">文化地景點</div>
              <ul class="list-unstyled d-flex flex-wrap">
                <li class="col-12 col-sm-3 px-2"
                    v-for="(item, itemIndex) in state.tribeData.culturalLandscape">
                  <img :src="item.image" class="w-100">
                  <p>{{ item.name }}</p>
                </li>
              </ul>
            </div>
          </div>
          <div class="section mb-5 history" id="section5" v-if="state.tribeData?.historicalDisasters?.length">
            <div class="fw-bold fs-5" :class="state.mainTextColor">
              <img src="@/assets/mapDetail/frame-1.png" v-if="state.type == 1">
              <img src="@/assets/mapDetail/frame-2.png" v-else>
              歷史災害
            </div>
            <hr class="border-5 opacity-100 mt-1 mb-3" :class="state.mainTextColor">
            <div class="mb-4">
              {{ state.tribeData?.historicalDisasterIntroduction }}
            </div>
            <div class="table w-100 d-none d-sm-block">
              <div class="d-flex flex-nowrap justify-content-between">
                <div class="td col-1 text-white" :class="state.mainBgColor">編號</div>
                <div class="td col-2 text-white" :class="state.mainBgColor">日期</div>
                <div class="td col-3 text-white" :class="state.mainBgColor">災害原因</div>
                <div class="td col-4 text-white" :class="state.mainBgColor">災害描述</div>
              </div>
              <div class="d-flex flex-nowrap justify-content-between"
                   v-for="(item, itemKey) in state.tribeData?.historicalDisasters" :key="itemKey">
                <div class="td col-1 bg-grey-light">{{ itemKey + 1 }}</div>
                <div class="td col-2 bg-grey-light">{{ item.date }}</div>
                <div class="td col-3 bg-grey-light">{{ item.cause }}</div>
                <div class="td col-4 bg-grey-light">{{ item.description }}</div>
              </div>
            </div>
            <Carousel class="mb-5 history table w-100 d-block d-sm-none" style="padding:0" :items-to-show="1"
                      :autoplay="2000" :wrap-around="true" :carouselList="state.tribeData?.historicalDisasters"/>
          </div>
          <div class="section mb-5" id="section6" v-if="state.tribeData.visionVideo">
            <div class="fw-bold fs-5" :class="state.mainTextColor">
              <img src="@/assets/mapDetail/frame-1.png" v-if="state.type == 1">
              <img src="@/assets/mapDetail/frame-2.png" v-else>
              動畫影片
            </div>
            <hr class="border-5 opacity-100 mt-1 mb-3" :class="state.mainTextColor">
            <div class="iframeCon mb-4 w-100 h-0 position-relative">
              <iframe class="position-absolute top-0 start-0 w-100 h-100" :src="state.tribeData.visionVideo"
                      title="YouTube video player" frameborder="0" allowfullscreen></iframe>
            </div>
          </div>
          <div class="section mb-5" id="section7" v-if="state.tribeData.engineeringVisionPosterThumbnail">
            <div class="fw-bold fs-5" :class="state.mainTextColor">
              <img src="@/assets/mapDetail/frame-1.png" v-if="state.type == 1">
              <img src="@/assets/mapDetail/frame-2.png" v-else>
              文化地景圖
            </div>
            <hr class="border-5 opacity-100 mt-1 mb-3" :class="state.mainTextColor">
            <div class="mb-4">
              <img class="mx-auto mt-4 d-block" style="width: 80%;" :src="state.tribeData.culturalLandscapeOrigin"
                   alt="">
            </div>
          </div>
          <div class="section mb-5" id="section8" v-if="state.tribeData.engineeringVisionPosterThumbnail">
            <div class="fw-bold fs-5" :class="state.mainTextColor">
              <img src="@/assets/mapDetail/frame-1.png" v-if="state.type == 1">
              <img src="@/assets/mapDetail/frame-2.png" v-else>
              願景海報
            </div>
            <hr class="border-5 opacity-100 mt-1 mb-3" :class="state.mainTextColor">
            <div class="mb-4">
              <img class="mx-auto mt-4 d-block" style="width: 80%;"
                   :src="state.tribeData.engineeringVisionPosterThumbnail" alt="">
            </div>
          </div>
          <div class="section mb-5 riskSigns" id="section9" v-if="state.tribeData.engineeringVisionPosterThumbnail">
            <div class="fw-bold fs-5" :class="state.mainTextColor">
              <img src="@/assets/mapDetail/frame-1.png" v-if="state.type == 1">
              <img src="@/assets/mapDetail/frame-2.png" v-else>
              災害徵兆調查成果
            </div>
            <hr class="border-5 opacity-100 mt-1 mb-3" :class="state.mainTextColor">
            <div class="table w-100">
              <div class="row mx-0 flex-nowrap">
                <div class="td col-4 text-white d-none d-sm-flex" :class="state.mainBgColor">部落名稱</div>
                <div class="td col-6 col-sm-4 px-2 px-sm-6 text-white" :class="state.mainBgColor">主要風險徵兆</div>
                <div class="td col-6 col-sm-4 px-2 px-sm-6 text-white" :class="state.mainBgColor">現場照片</div>
              </div>
              <div class="row mx-0 flex-nowrap">
                <div class="col-4 td bg-grey-light d-none d-sm-flex">{{
                    state.tribeData?.basicInformation?.tribeName
                  }}
                </div>
                <div class="col-12 col-sm-8 p-0">
                  <div class="d-flex p-0"
                       v-for="(item, itemKey) in state.tribeData?.riskSigns" :key="itemKey">
                    <div class="col-6 px-2 px-sm-6 td bg-grey-light">{{ item.name }}</div>
                    <div class="col-6 px-2 px-sm-6 td bg-grey-light">
                      <img class="w-100" :src="item.image" alt="">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-5 text-center">
            <div
                class="d-inline-block cursor-pointer border-0 fs-5 bg-black px-3 py-2 mx-auto text-white fw-bold rounded text-decoration-none"
                :class="state.mainTextColor" @click="() => {
                                router.push({
                                    name: 'plane',
                                    params: {
                                        id: route.params?.id
                                    },
                                })
                            }">
              永續工程計畫圖
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="position-fixed bottom-0 end-0 w-auto m-2 m-sm-5">
      <div class="mb-4 cursor-pointer" @click="router.push({ name: 'map' })">
        <img src="@/assets/mapDetail/back.svg">
      </div>
      <div class="goTop cursor-pointer" @click="goTop()">
        <img src="@/assets/mapDetail/top.svg">
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

.tribeBaseData
  & > div
    width: 32%

.detailCon
  padding: 0 calc((100% - 1460px) / 2)

  h2
    margin: 48px 0 52px 0
    display: flex
    justify-content: center
    align-items: center

    &::before
      content: ''
      background-image: url('@/assets/mapDetail/titleLeft.svg')
      background-size: cover
      height: 25px
      width: 100px
      display: block

      margin: 0 5px

    &::after
      content: ''
      background-image: url('@/assets/mapDetail/titleRight.svg')
      background-size: cover
      height: 25px
      width: 100px
      display: block

      margin: 0 5px

.redTotem
  height: 135px
  background-image: url('@/assets/mapDetail/redTotem.svg')

.blueTotem
  height: 135px
  background-image: url('@/assets/mapDetail/blueTotem.svg')

.aside
  margin: 150px 20px 0 20px

  ul li
    color: #841613
    font-weight: bold

  a, button
    display: block
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25)

.section
  background: #fff
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25)
  border-radius: 5px
  padding: 30px 50px
  box-sizing: border-box

.iframeCon
  padding-bottom: 56.25%

.history
  .table
    text-align: center

    .td
      margin: 0 5px 5px 0
      padding: 30px
      display: flex
      justify-content: center
      align-items: center

    .col-1
      width: 10%
      text-align: center

    .col-2
      width: 20%
      text-align: center

    .col-3
      width: 30%
      text-align: center

    .col-4
      width: 40%
      text-align: left

.riskSigns
  .table
    text-align: center

    .td
      margin: 0 5px 5px 0
      padding: 30px
      display: flex
      justify-content: center
      align-items: center

@media (max-width: 600px)

.detailCon
  padding: 0 calc((100% - 1460px) / 2)

  h2
    &::before
      width: 80px

    &::after
      width: 80px

  .detailCon
    padding: 0 1%

  .section
    background: #fff
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25)
    border-radius: 5px
    padding: 30px
    box-sizing: border-box

  .tribeBaseData
    & > div
      width: 100%
</style>
