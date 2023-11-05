<script>
import { useSlots, onBeforeMount, onMounted, onUpdated, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'
import { useRouter } from 'vue-router'

export default {
    props: {
        popup: {
            type: Object,
            default: {}
        },
        closeAreaData: {
            Type: Function,
            default: () => { }
        },
        maxHeight: {
            Type: Number,
            default: 0
        },
        coordinate: {
            type: Object,
            default: {}
        },
    },
    setup(props, { emit }) {
        const router = useRouter()
        const state = reactive({
            type: 0,
            media: 'photo',
            scrollY: false,
            tribeData: {},
            showAreaDataWindow: false
        })

        async function getTribeData(tribeId) {
            const result = await $.ajax({
                url: `https://api.edtest.site/tribe?tribeCode=${tribeId}`,
                method: "GET"
            }).done(res => {
                return res
            }).fail(FailMethod => {
                console.log('Fail', FailMethod)
                state.type = 0
                props.closeAreaData()
                return false
            })
            return result
        }

        async function getDisasterData(id) {
            const result = await $.ajax({
                url: `https://api.edtest.site/historicalDiseaster?id=${id}`,
                method: "GET"
            }).done(res => {
                return res
            }).fail(FailMethod => {
                console.log('Fail', FailMethod)
                state.type = 0
                props.closeAreaData()
                return false
            })
            return result
        }

        async function getRainfallStation(stationName) {
            const result = await $.ajax({
                url: `https://api.edtest.site/rainData?stationName=${stationName}`,
                method: "GET"
            }).done(res => {
                return res
            }).fail(FailMethod => {
                console.log('Fail', FailMethod)
                state.type = 0
                return false
            })
            return result
        }
        var oldPopupData = "";
        var oldPopupId = ""

        watch(props.popup, async (newVal) => {
            if (oldPopupData == newVal.popupData
                && oldPopupId == newVal.popupId) {
                return
            }
            oldPopupData = newVal.popupData
            oldPopupId = newVal.popupId
            //TODO: 結構優化
            if (newVal.popupData == "新竹縣原住民部落範圍") {
                getTribeData(newVal.popupId).then((result) => {
                    state.type = 1
                    state.tribeData = result
                }).then(() => {
                    state.showAreaDataWindow = true
                })
                return
            }
            if (props.popup.popupData == "近年歷史災害82處部落點位") {
                getDisasterData(`近年歷史災害82處部落點位.${props.popup.popupId}`).then((result) => {
                    state.type = 2
                    state.tribeData = result.data
                }).then(() => {
                    state.showAreaDataWindow = true
                })
                return
            }
            if (props.popup.popupData == "雨量站") {
                getRainfallStation(props.popup.popupId).then((result) => {
                    state.type = 3
                    if (result.data !== null) {
                        state.tribeData = result.data
                    }
                    console.log(result.data)
                }).then(() => {
                    state.showAreaDataWindow = true
                })
                return
            }
        })

        return {
            router,
            props,
            state,
        }
    }
}

</script>

<template>
    <div class="bg-white rounded py-2" style="overflow-y: auto;" v-if="state.showAreaDataWindow" :style="{
        'max-height': props.maxHeight + 'px',
    }">
        <div v-if="state.type === 1">
            <div class="row mx-0 align-items-center flex-nowrap text-center p-2 fw-bold">
                <p>詳細資訊</p>
                <!-- TODO: 關閉事件 -->
                <div class="position-absolute col-auto end-0 cursor-pointer" style="top: 10px;"
                    @click="props.closeAreaData">
                    <svg width="32" height="32" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm0-11.414L9.172 7.757L7.757 9.172L10.586 12l-2.829 2.828l1.415 1.415L12 13.414l2.828 2.829l1.415-1.415L13.414 12l2.829-2.828l-1.415-1.415L12 10.586z" />
                    </svg>
                </div>
            </div>
            <areaImg :coordinate="props.popup.coordinate" :type="state.type" />
            <div class="row mx-0 align-items-center p-2 position-relative">
                <div class="d-flex flex-nowrap align-items-center justify-content-between my-2">
                    <span>{{ state.tribeData?.basicInformation?.tribeName }} </span>
                    <div class="p-2 bg-steel w-auto text-white d-inline-block rounded-2 cursor-pointer" @click="() => {
                        router.push({
                            name: 'detail',
                            params: {
                                id: props.popup.popupId
                            },
                        })
                    }">更多資訊</div>
                </div>
                <p>描述: {{ state.tribeData?.basicInformation?.description }}</p>

                <p>{{ state.tribeData?.basicInformation?.area }}</p>
                <a href="#">
                    <img src="@/assets/img/icon/vector.svg" alt="">
                    {{ state.tribeData?.basicInformation?.coordinates?.WGS84?.lat }}
                    ,
                    {{ state.tribeData?.basicInformation?.coordinates?.WGS84?.lng }}
                </a>
            </div>
            <div>
                <div class="border-bottom row flex-nowrap p-2 my-3 cursor-pointer mx-0">
                    <div class="col-6 cursor-pointer" @click="state.media = 'photo'">相片</div>
                    <div class="col-6 cursor-pointer" @click="state.media = 'video'">影片</div>
                </div>
                <div class="py-2 px-4" v-if="state.media === 'photo'">
                    <div class="d-flex flex-wrap justify-content-between">
                        <div class="w-50 mb-4" v-for="item in state?.tribeData?.culturalLandscape">
                            <p class="mb-0">{{ item.name }}</p>
                            <img :src="item.image" alt="" class="w-100">
                        </div>
                    </div>
                </div>
                <div class="py-2 px-4" v-if="state.media === 'video'">
                    <div>尚無影片</div>
                </div>
            </div>
        </div>
        <div v-if="state.type === 2">
            <div class="row mx-0 align-items-center px-2 py-4 position-relative">
                <div class="row mx-0 mb-2" v-if="state.tribeData.event">
                    <div class="col-4 p-1 bg-red-light text-white d-flex justify-content-center align-items-center">事件:
                    </div>
                    <div class="col-8 py-1 px-2 bg-grey-light text-start">{{ state.tribeData.event }}</div>
                </div>
                <div class="row mx-0 mb-2" v-if="state.tribeData.date">
                    <div class="col-4 p-1 bg-red-light text-white d-flex justify-content-center align-items-center">發生時間:
                    </div>
                    <div class="col-8 py-1 px-2 bg-grey-light text-start">{{ state.tribeData.date }}</div>
                </div>
                <div class="row mx-0 mb-2" v-if="state.tribeData.township">
                    <div class="col-4 p-1 bg-red-light text-white d-flex justify-content-center align-items-center">鄉鎮:
                    </div>
                    <div class="col-8 py-1 px-2 bg-grey-light text-start">{{ state.tribeData.township }}</div>
                </div>
                <div class="row mx-0 mb-2" v-if="state.tribeData.village">
                    <div class="col-4 p-1 bg-red-light text-white d-flex justify-content-center align-items-center">地方:
                    </div>
                    <div class="col-8 py-1 px-2 bg-grey-light text-start">{{ state.tribeData.village }}</div>
                </div>
                <div class="row mx-0 mb-2" v-if="state.tribeData.place">
                    <div class="col-4 p-1 bg-red-light text-white d-flex justify-content-center align-items-center">村落:
                    </div>
                    <div class="col-8 py-1 px-2 bg-grey-light text-start">{{ state.tribeData.place }}</div>
                </div>
                <div class="row mx-0 mb-2" v-if="state.tribeData.category">
                    <div class="col-4 p-1 bg-red-light text-white d-flex justify-content-center align-items-center">災害種類:
                    </div>
                    <div class="col-8 py-1 px-2 bg-grey-light text-start">{{ state.tribeData.category }}</div>
                </div>
                <div class="row mx-0 mb-2" v-if="state.tribeData.description">
                    <div class="col-4 p-1 bg-red-light text-white d-flex justify-content-center align-items-center">描述:
                    </div>
                    <div class="col-8 py-1 px-2 bg-grey-light text-start">{{ state.tribeData.description }}</div>
                </div>
            </div>
        </div>
        <div v-if="state.type === 3">
            <div class="p-2 p-sm-3">
                <p class="text-start px-0 fw-bold">雨量站</p>
                <!-- {{ state.tribeData.viewStation }} -->
                <hr>
                <div class="p-0 p-sm-2">
                    <p>觀測時間: {{ state.tribeData?.viewDatetime }}</p>
                    <p>單位:mm </p>
                    <table class="rainfall border-bottom border-grey w-100">
                        <thead>
                            <tr class="text-center">
                                <td class="bg-blueDeep text-white border border-white p-2">10分鐘</td>
                                <td class="bg-blueDeep text-white border border-white p-2">時雨量</td>
                                <td class="bg-blueDeep text-white border border-white p-2">3小時</td>
                                <td class="bg-blueDeep text-white border border-white p-2">6小時</td>
                                <td class="bg-blueDeep text-white border border-white p-2">12小時</td>
                                <td class="bg-blueDeep text-white border border-white p-2">24小時</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="text-center">
                                <td class="p-2">{{ state.tribeData?.min_10 }}</td>
                                <td class="p-2">{{ state.tribeData?.hour_1 }}</td>
                                <td class="p-2">{{ state.tribeData?.hour_3 }}</td>
                                <td class="p-2">{{ state.tribeData?.hour_6 }}</td>
                                <td class="p-2">{{ state.tribeData?.hour_12 }}</td>
                                <td class="p-2">{{ state.tribeData?.hour_24 }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
@import '@/assets/styles/all.module.scss'
@media (max-width:600px)
    .rainfall
        td
            font-size: 12px
</style>
