<script>
import { useSlots, onBeforeMount, onMounted, onUpdated, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'
import { useRouter } from 'vue-router'

export default {
    props: {
        tribeAreaData:{
            Type: String,
            default: 0
        },
        closeMapData: {
            Type: Function,
            default: ()=>{}
        },
        maxHeight: {
            Type: Number,
            default: 0
        }
    },
    setup(props, { emit }){
        const router = useRouter()
        const state = reactive({
            media: 'photo',
            scrollY: false,
            tribeData: {},
        })

        async function getTribeData (tribeId) {
            const result = await $.ajax({
                url: `https://api.edtest.site/tribe?tribeCode=${tribeId}`,
                method: "GET"
            }).done(res => {
                return res
            }).fail(FailMethod => {
                console.log('Fail', FailMethod)
                return false
            })
            return result
        }

        // needfix: 優化，改成computed
        watch(() => props.tribeAreaData['編號'], async (newVal)=>{
            await getTribeData(newVal).then((result)=>{
                state.tribeData = result
            })
        })


        onMounted(()=>{
            getTribeData(props.tribeAreaData['編號']).then((result)=>{
                state.tribeData = result
            })
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
    <div class="bg-white rounded py-2 " style="overflow-y: auto;">
        <div class="row mx-0 align-items-center flex-nowrap text-center p-2 fw-bold">
            <p>詳細資訊</p>
            <!-- <div class="position-absolute col-auto end-0 cursor-pointer" style="top: 10px;" @click="props.closeMapData">
                <svg width="32" height="32" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm0-11.414L9.172 7.757L7.757 9.172L10.586 12l-2.829 2.828l1.415 1.415L12 13.414l2.828 2.829l1.415-1.415L13.414 12l2.829-2.828l-1.415-1.415L12 10.586z"/>
                </svg>
            </div> -->
        </div>
        <img src="@/assets/example-AddressData.jpg" class="w-100" alt="">
        <div class="row mx-0 align-items-center p-2 position-relative">
            <div class="d-flex flex-nowrap align-items-center justify-content-between my-2">
                <span class="">{{ props.tribeId }} {{ state?.tribeData?.basicInformation?.tribeName }} </span>
                <div class="p-2 bg-steel w-auto text-white d-inline-block rounded-2 cursor-pointer"
                @click="()=>{
                    router.push({ path: `/Map_Demo/${props.tribeAreaData['編號']}` })
                }">更多資訊</div>
            </div>
            <p>描述: {{ state?.tribeData?.basicInformation?.description }}</p>

            <p>{{ state?.tribeData?.basicInformation?.area }}</p>
            <a href="">
                <img src="@/assets/img/icon/vector.svg" alt="">
                {{ state?.tribeData?.basicInformation?.coordinates?.WGS84?.lat}}
                ,
                {{state?.tribeData?.basicInformation?.coordinates?.WGS84?.lng }}
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
                <div>影片影片影片影片影片影片</div>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
@import '@/assets/styles/all.module.scss'

// .lightbox
//     top: 20%
//     left: 50%
</style>
