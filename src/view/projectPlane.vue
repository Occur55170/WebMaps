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
            planObj: {}
        })

        function onMapControl(action) {
            emit('onMapControl', { action })
        }

        const tableFilter = function (name) {
            const stringArray = name.split(":");
            console.log(stringArray)
            return stringArray
        }

        // https://api.edtest.site/engineering_plan?tribeCode={tribeCode}

        onMounted(async () => {
            console.log(route.params?.id)
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
            onMapControl,
            tableFilter
        }
    }
}

</script>

<template>
    <div class="detail">
        <div class="redTotem" :class="state.type == 1 ? 'redTotem' : 'blueTotem'"></div>
        <div class="p-4">
            <h1 class="text-brown fw-bold d-flex align-items-center"
            :class="state.mainTextColor">
                <img src="@/assets/mapDetail/frame-1.png" v-if="state.type == 1"/>
                <img src="@/assets/mapDetail/frame-2.png" v-else>
                聚落座標
            </h1>
            {{ state.planObj.engineeringPlanInfo }}
            <div class="row">
                <div class="col-6">
                    <img :src="state.planObj.engineeringPlan" class="w-100" alt="">
                </div>
                <div class="col-6">
                    <Button class="btn text-white" style="background: rgba(30, 30, 30, 0.9);">全部下載</Button>
                    <Button class="btn text-white" style="background: rgba(30, 30, 30, 0.9);">下載勾選項目</Button>
                    <div class="d-flex flex-nowrap justify-content-between">
                        <div class="col-2 text-white" :class="state.mainBgColor">記號</div>
                        <div class="col-6 text-white" :class="state.mainBgColor">名稱</div>
                        <div class="col-2 text-white" :class="state.mainBgColor">下載</div>
                        <div class="col-2 text-white" :class="state.mainBgColor">選取</div>
                    </div>
                    <div class="d-flex flex-nowrap justify-content-between"
                    v-for="(item, itemKey) in state.planObj.engineeringPlanInfo" :key="itemKey">
                        <div class="col-2 bg-grey-light">{{ tableFilter(item.name)[0] }}</div>
                        <div class="col-6 bg-grey-light">{{ tableFilter(item.name)[1] }}</div>
                        <div class="col-2 bg-grey-light"><button>下載</button></div>
                        <div class="col-2 bg-grey-light"><input type="checkbox"></div>
                    </div>
                </div>
            </div>
            <a href="#" class="goBack btn bg-black text-white d-inline-block mb-4 cursor-pointer" @click="router.push({ name: 'map' })">
                返回上頁
            </a>
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
    min-height: 100
.redTotem
    height: 135px
    background-image: url('@/assets/mapDetail/redTotem.svg')
.blueTotem
    height: 135px
    background-image: url('@/assets/mapDetail/blueTotem.svg')

@media (max-width: 600px)
</style>
