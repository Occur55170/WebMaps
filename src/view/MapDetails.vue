<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'
import { useRoute, useRouter } from 'vue-router'

export default {
    props: {
        tribeId: {
            Type: String,
            default: 0
        },
        map: {}
    },
    setup(props, { emit }) {
        const router = useRouter()
        const route = useRoute()
        const state = reactive({
            redArray: [134],
            mainTextColor: computed(()=>{
                return state.redArray.includes(Number(route.params.id)) ? 'text-brown' : 'text-steel'
            }),
            mainBgColor: computed(()=>{
                return state.redArray.includes(Number(route.params.id)) ? 'bg-brown' : 'bg-steel'
            }),
            type: computed(()=>{
                return state.redArray.includes(Number(route.params.id)) ? 1 : 2
            }),
            coordinates: computed(()=>{
                return (state.tribeData?.basicInformation?.coordinates) ? Object.entries(state.tribeData?.basicInformation?.coordinates) : null
            }),
            tribeData: {}
        })

        function onMapControl(action) {
            emit('onMapControl', { action })
        }

        function goTop () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        }


        onMounted(async () => {
            await $.ajax({
                url: `https://api.edtest.site/tribe?tribeCode=${route.params?.id}`,
                method: "GET"
            }).done(res => {
                state.tribeData = res
            }).fail(FailMethod => {
                console.log('Fail', FailMethod)
            })
        })

        return {
            router,
            state,
            onMapControl,
            goTop,
        }
    }
}

</script>

<template>
    <div class="row mx-0 detail position-relative">
        <div class="redTotem" :class="state.type == 1 ? 'redTotem' : 'blueTotem'"></div>
        <div class="detailCon">
            <div class="row mx-0">
                <div class="aside px-0 d-none d-sm-block">
                    <ul class="ps-0">
                        <li class="text-center mb-5">
                            <a href="#section1" class="bg-white fw-bold rounded text-decoration-none" :class="state.mainTextColor">基本資料</a>
                        </li>
                        <li class="text-center mb-5">
                            <a href="#section2" class="bg-white fw-bold rounded text-decoration-none" :class="state.mainTextColor">部落地標</a>
                        </li>
                        <li class="text-center mb-5">
                            <a href="#section3" class="bg-white fw-bold rounded text-decoration-none" :class="state.mainTextColor">自然環境</a>
                        </li>
                        <li class="text-center mb-5">
                            <a href="#section4" class="bg-white fw-bold rounded text-decoration-none" :class="state.mainTextColor">人文環境</a>
                        </li>
                        <li class="text-center mb-5">
                            <a href="#section5" class="bg-white fw-bold rounded text-decoration-none" :class="state.mainTextColor">歷史災害</a>
                        </li>
                    </ul>
                </div>
                <div class="detailMain">
                    <h2 class="text-center">{{ state.tribeData?.basicInformation?.tribeName }}</h2>
                    <div class="section mb-5 mx-0 row flex-wrap align-items-center" id="section1">
                        <div class="text-brown fw-bold col-12 col-sm-3 mb-4 mb-sm-0 text-center d-flex align-items-center"
                        :class="state.mainTextColor">
                            <img src="@/assets/mapDetail/frame-1.png" class="d-block d-sm-none"  v-if="state.type == 1"/>
                            <img src="@/assets/mapDetail/frame-2.png" class="d-block d-sm-none" v-else>
                            聚落座標
                        </div>
                        <div class="col-12 col-sm-8">
                            <p>聚落坐標(97TM2,WGS84)</p>
                            <p>代表性座標名稱：石磊國民小學(疏散避難處所)</p>
                            <p v-for="(item, itemKey) in state.coordinates">
                                <p>
                                    【 {{ item[0] }}座標 】
                                    <br class="d-block d-sm-none">
                                    經度：{{ item[1]?.lng || item[1]?.x }}，緯度：{{ item[1]?.lat || item[1]?.y }}</p>
                                </p>
                        </div>
                    </div>
                    <div class="row flex-wrap flex-sm-nowrap mx-0 mb-5 justify-content-between d-flex">
                        <div class="section col-5 col-sm-3 py-4 px-0 col-3 text-center">
                            <p class="mb-2 fs-5 fw-bold" :class="state.mainTextColor">
                                <!-- TODO: <img :src="`@/assets/mapDetail/frame-${2}.png`"> -->
                                <img src="@/assets/mapDetail/frame-1.png" v-if="state.type == 1">
                                <img src="@/assets/mapDetail/frame-2.png" v-else>
                                人口戶數
                            </p>
                            <p class="mb-0 fw-bold">{{ state.tribeData?.basicInformation?.totalHouseholds }}</p>
                        </div>
                        <div class="section col-5 col-sm-3 py-4 px-0 col-3 text-center">
                            <p class="mb-2 fs-5 fw-bold" :class="state.mainTextColor">
                                <img src="@/assets/mapDetail/frame-1.png" v-if="state.type == 1">
                                <img src="@/assets/mapDetail/frame-2.png" v-else>
                                聚落規模
                            </p>
                            <p class="mb-0 fw-bold">{{ state.tribeData?.basicInformation?.scale }}</p>
                        </div>
                        <div class="section col-12 col-sm-3 py-4 px-0 mt-5 mt-sm-0 text-center">
                            <p class="mb-2 fs-5 fw-bold" :class="state.mainTextColor">
                                <img src="@/assets/mapDetail/frame-1.png" v-if="state.type == 1">
                                <img src="@/assets/mapDetail/frame-2.png" v-else>
                                行政區域
                            </p>
                            <p class="mb-0 fw-bold">{{ state.tribeData?.basicInformation?.area }}</p>
                        </div>
                    </div>
                    <div class="section mb-5" id="section2">
                        <div class="fw-bold" :class="state.mainTextColor">部落地標</div>
                        <hr class="border-5 opacity-100 mt-1 mb-3" :class="state.mainTextColor">
                        <div class="d-flex flex-wrap flex-sm-nowrap mx-0 align-items-center">
                            <img src="@/assets/mapDetail/3-1.png" class="me-sm-4 w-100 w-sm-10">
                            <div>
                                <p>名稱 : 石磊國小</p>
                                <p>地址 : 新竹縣尖石鄉49號</p>
                                <p>簡介 :
                                    新竹縣尖石鄉石磊國民小學是位於台灣新竹縣尖石鄉玉峰村的一座國民小學，校園無圍牆及操場，為全臺灣腹地最小的國民小學。該學校始建於中華民國四十五年八月，最初名為玉峰國民學校石磊分班。民國五十七年八月改稱新竹縣尖石鄉石磊國民小學
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="section mb-5" id="section3">
                        <div class="fw-bold" :class="state.mainTextColor">自然環境</div>
                        <hr class="border-5 opacity-100 mt-1 mb-3" :class="state.mainTextColor">
                        <div>
                            <p>{{ state.tribeData?.naturalEnvironment }}</p>
                        </div>
                    </div>
                    <div class="section mb-5" id="section4">
                        <div class="fw-bold" :class="state.mainTextColor">人文環境</div>
                        <hr class="border-5 opacity-100 mt-1 mb-3" :class="state.mainTextColor">
                        <div>石磊部落範圍內之文化地景分佈如下圖所示。地標地物包括石磊國小、石磊天主堂、石磊文化健康站和石磊教會等。部落產業以農業為主，種植椴木香菇及有機農業，以高冷蔬菜為主。</div>
                        <div class="my-5">
                            <p class="mb-2">部落名稱:石磊部落</p>
                            <p class="mb-2">主要原住民族群:泰雅族</p>
                        </div>
                        <div>
                            <div class="fw-bold mb-2" :class="state.mainTextColor">文化地景點</div>
                            <ul class="list-unstyled d-flex flex-wrap justify-content-around">
                                <li class="col-5 col-sm-3 px-2" v-for="(item, itemIndex) in state.tribeData.culturalLandscape">
                                    <img :src="item.image" class="w-100">
                                    <p>{{ item.name }}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="section mb-5 history" id="section5">
                        <div class="fw-bold" :class="state.mainTextColor">歷史災害</div>
                        <hr class="border-5 opacity-100 mt-1 mb-3" :class="state.mainTextColor">
                        <div class="mb-4">
                            依據111年尖石鄉公所地區災害防救計畫及查詢災害復建工程經費審議及執行資訊系統後，將發生於石磊部落範圍內(及鄰近)之災害事件彙整如下表，並於111年12月22日進行現場調查。災害原因多為降雨及颱風事件，主要的災害類型為土石崩落及邊坡災害。
                        </div>
                        <div class="table w-100 d-none d-sm-block">
                            <div class="d-flex flex-nowrap justify-content-between">
                                <div class="col-1 text-white" :class="state.mainBgColor">編號</div>
                                <div class="col-2 text-white" :class="state.mainBgColor">日期</div>
                                <div class="col-3 text-white" :class="state.mainBgColor">災害原因</div>
                                <div class="col-4 text-white" :class="state.mainBgColor">災害描述</div>
                            </div>
                            <div class="d-flex flex-nowrap justify-content-between"
                            v-for="(item, itemKey) in state.tribeData?.historicalDisasters" :key="itemKey">
                                <div class="col-1 bg-grey-light">{{ itemKey+1 }}</div>
                                <div class="col-2 bg-grey-light">{{ item.date }}</div>
                                <div class="col-3 bg-grey-light">{{ item.cause }}</div>
                                <div class="col-4 bg-grey-light">{{ item.description }}</div>
                            </div>
                        </div>
                        <Carousel class="mb-5 history table w-100 d-block d-sm-none"
                        style="padding:0"
                        :items-to-show="1"
                        :autoplay="2000"
                        :wrap-around="true"
                        :carouselList="state.tribeData?.historicalDisasters" />
                    </div>
                </div>
            </div>
        </div>
        <div class="position-fixed bottom-0 end-0 w-auto m-2 m-sm-5">
            <div class="goBack mb-4 cursor-pointer" @click="router.push({ name: 'map' })">
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
.detailCon
    padding: 0 calc((100% - 1460px)/2)
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
            margin:0 5px
        &::after
            content: ''
            background-image: url('@/assets/mapDetail/titleRight.svg')
            background-size: cover
            height: 25px
            width: 100px
            display: block
            margin:0 5px
.redTotem
    height: 135px
    background-image: url('@/assets/mapDetail/redTotem.svg')
.blueTotem
    height: 135px
    background-image: url('@/assets/mapDetail/blueTotem.svg')
.aside
    width: 200px
    margin-top: 140px
    margin-right: 60px
    ul li
        list-style: none
        color: #841613
        font-weight: bold
    a
        display: block
        padding: 15px 60px
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.25)
.detailMain
    width: calc(100% - 300px)
.section
    background: #fff
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25)
    border-radius: 5px
    padding: 30px 50px
    box-sizing: border-box
.history
    .table
        text-align: center
        div
            div
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

@media (max-width: 600px)
    .detailMain
        width: 100%
    .section
        background: #fff
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.25)
        border-radius: 5px
        padding: 30px 10px
        box-sizing: border-box
</style>