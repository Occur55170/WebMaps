<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios';

export function batchDownload(url, parameter) {
    return axios({
        url: url,
        params: parameter,
        method: 'get',
        responseType: 'text'
    })
}

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
            planObj: {}
        })

        const tableFilter = function (name) {
            const stringArray = name.split(":");
            return stringArray
        }

        function goBack() {
            router.push({
                name: 'detail',
                params: {
                    id: route.params?.id
                },
            })
        }

        onMounted(async () => {
            await $.ajax({
                url: `https://api.edtest.site/engineering_plan?tribeCode=${route.params?.id}`,
                method: "GET"
            }).done(res => {
                state.planObj = res
            }).fail(FailMethod => {
                console.log('Fail', FailMethod)
            })
        })

        return {
            router,
            state,
            tableFilter,
            goBack
        }
    }
}

</script>

<template>
    <div class="detail">
        <div class="redTotem" :class="state.type == 1 ? 'redTotem' : 'blueTotem'"></div>
        <div class="p-4">
            <div class="d-flex align-items-center justify-content-between">
                <h1 class="text-brown fw-bold d-flex align-items-center" :class="state.mainTextColor">
                    <img src="@/assets/mapDetail/frame-1.png" v-if="state.type == 1" />
                    <img src="@/assets/mapDetail/frame-2.png" v-else>
                    工程計畫
                </h1>

                <div class="d-flex justify-content-end" style="visibility: hidden;">
                    <button class="btn text-white me-2" style="background: rgba(30, 30, 30, 0.9);">全部下載</button>
                    <button class="btn text-white" style="background: rgba(30, 30, 30, 0.9);">下載勾選項目</button>
                </div>
            </div>
            <div class="row mb-4">
                <div class="col-6">
                    <img :src="state.planObj.engineeringPlan" class="w-100" alt="">
                </div>
                <div class="col-6 position-relative" style="overflow-y: auto;">
                    <div class="position-absolute d-flex flex-wrap table" style="width: 95%;">
                        <div class="thead d-flex shrink-1 flex-nowrap justify-content-between w-100">
                            <div class="p-1 col-3 text-white" :class="state.mainBgColor">記號</div>
                            <div class="p-1 col-6 text-white" :class="state.mainBgColor">名稱</div>
                            <div class="p-1 col-3 text-white" :class="state.mainBgColor">下載</div>
                            </div>
                        <div class="tbody w-100">
                            <div class="d-flex shrink-0 flex-nowrap justify-content-between w-100"
                                v-for="(item, itemKey) in state.planObj.engineeringPlanInfo" :key="itemKey">
                                <div class="col-3 bg-grey-light fw-bold">{{ tableFilter(item.name)[0] }}</div>
                                <div class="col-6 bg-grey-light fw-bold">{{ tableFilter(item.name)[1] }}</div>
                                <div class="col-3 bg-grey-light">
                                    <a :href="item.url" class="btn py-1 text-white bg-grey" target="_blank">
                                        <img src="@/assets/img/icon/download.svg" class="">
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <a href="#" class="goBack btn bg-black text-white d-inline-block mb-4 cursor-pointer"
                    @click.prevent="goBack()">
                    返回上頁
                </a>
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
    .thead>div, .tbody>div>div
        margin: 0 5px 5px 0
        padding: 5px
        display: flex
        justify-content: center
        align-items: center

@media (max-width: 600px)
</style>
