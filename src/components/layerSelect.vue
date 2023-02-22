<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'
import { Layer } from 'ol/layer'

export default {
    props: {
        onClose: {
            type: Function,
            default: ()=>{}
        },
        onChangLayerVisible: {
            type: Function,
            default: ()=>{}
        },
        onDeleteLayer: {
            type: Function,
            default: ()=>{}
        },
        currentLayers: {
            type: Array,
            default: []
        },
    },
    setup(props, { emit }) {
        const state = reactive({
            currentLayers:computed(()=>{
                    return props.currentLayers.map((node)=>{
                        return {
                        ...node,
                            'lock': true
                        }
                    })
                })
        })

        function deleteAllLayer(){
            console.log('1')
        }

        function onChangeOrderLayer(){
            // if(.lock){
                // onChangeOrderLayer()
            // }
        }

        onMounted(()=>{
        })

        return {
            props,
            state,
            deleteAllLayer,
            onChangeOrderLayer
        }
    }
}
</script>

<template>
    <div class="rounded-4 bg-white">
        <div class="row mx-0 align-items-center flex-nowrap text-center p-2 fw-bold">
            <p class="mb-0">已選擇的圖層</p>
            <a href="" class="closeBtn position-absolute col-auto" @click.prevent="props.onClose">
                <svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm0-11.414L9.172 7.757L7.757 9.172L10.586 12l-2.829 2.828l1.415 1.415L12 13.414l2.828 2.829l1.415-1.415L13.414 12l2.829-2.828l-1.415-1.415L12 10.586z"/></svg>
            </a>
        </div>
        <hr class="my-0">
        <div class="py-3 px-4 content">
            <p class="text-end">
                <a href="" @click.prevent="deleteAllLayer()">全部刪除</a>
            </p>
            {{ state.currentLayers }}
            <ul class="list-unstyled">
                <li class="d-flex justify-content-between"
                v-for="(node, nodeIndex) in state.currentLayers">
                    <div>
                        {{ node.lock }}
                        {{ node.name }}
                    </div>
                    <div class="tool">
                        <button @click="props.onChangeOrderLayer({
                            action: 'changeOrderLayer',
                            value: 'up'
                        })">
                            <img src="../assets/img/icon/arrow_up.svg" alt="">
                        </button>
                        <button @click="props.onChangeOrderLayer({
                            action: 'changeOrderLayer',
                            value: 'down'
                        })">
                            <img src="../assets/img/icon/arrow_down.svg" alt="">
                        </button>
                        <button @click="()=>{
                            // next
                            // state.currentLayers = nodeIndex
                        }">
                            <img src="../assets/img/icon/lockOpen.svg" alt="">
                        </button>
                        <button @click="props.onDeleteLayer({
                            action: 'mapMode',
                            value: {
                                checked: false,
                                layerName: node.name
                            }
                        })">
                            <img src="../assets/img/icon/delete.svg" alt="">
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="sass" scoped>
@import '../assets/styles/all.module.scss'
.closeBtn
    right:10px
    svg
        width: 20px
        height: 20px

.content
    .title
        cursor: pointer
        svg
            transform: rotateZ(0)
        .openTitle
            transform: rotateZ(90deg)
    svg
        width: 20px
        height: 20px
    img
        width: 16px
        height: 16px
.tool
    img
        width: 20px
        height: 20px
</style>
<!-- https://openlayers.org/en/latest/examples/layer-group.html -->
