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
        onLockLayer: {
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
            currentLayers: []
        })

        function deleteAllLayer(){
            console.log('1')
        }

        function onChangeOrderLayer(){
            // if(.lock){
                // onChangeOrderLayer()
            // }
        }

        // function addLock() {
        //     state.currentLayers = props.currentLayers.map((node)=>{
        //         return {
        //         ...node,
        //             'lock': true
        //         }
        //     })
        // }

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
            {{ props.currentLayers }}
            <ul class="list-unstyled">
                <li class="d-flex justify-content-between"
                v-for="(node, nodeIndex) in props.currentLayers">
                    <div>
                        {{ node.lock }}
                        {{ node.name }}
                    </div>
                    <div class="tool">
                        <div class="btn"
                        @click="props.onChangeOrderLayer({
                            action: 'changeOrderLayer',
                            value: 'up'
                        })">
                            <svg viewBox="0 0 25 24" fill="currentColor">
                                <path d="M9.49991 19.84H15.4999V11.84H20.3399L12.4999 4.00003L4.65991 11.84H9.49991V19.84Z" fill="#808080" />
                            </svg>
                        </div>
                        <div class="btn"
                        @click="props.onChangeOrderLayer({
                            action: 'changeOrderLayer',
                            value: 'down'
                        })">
                            <img src="../assets/img/icon/arrow_down.svg" alt="">
                        </div>
                        <div class="btn"
                        @click="()=>{
                            props.onLockLayer(nodeIndex)
                        }">
                            <svg viewBox="0 0 25 24" fill="currentColor"  :class="{'lockUp': node.lock, 'unlock': !node.lock}">
                                <path d="M8.02381 9.33333H14.881V7.80952C14.881 7.1746 14.6587 6.63492 14.2143 6.19048C13.7698 5.74603 13.2302 5.52381 12.5952 5.52381C11.9603 5.52381 11.4206 5.74603 10.9762 6.19048C10.5317 6.63492 10.3095 7.1746 10.3095 7.80952H8.78571C8.78571 6.75556 9.15727 5.85702 9.90038 5.1139C10.643 4.3713 11.5413 4 12.5952 4C13.6492 4 14.5477 4.3713 15.2909 5.1139C16.0335 5.85702 16.4048 6.75556 16.4048 7.80952V9.33333H17.1667C17.5857 9.33333 17.9446 9.48241 18.2432 9.78057C18.5414 10.0792 18.6905 10.4381 18.6905 10.8571V18.4762C18.6905 18.8952 18.5414 19.2541 18.2432 19.5528C17.9446 19.8509 17.5857 20 17.1667 20H8.02381C7.60476 20 7.24616 19.8509 6.948 19.5528C6.64933 19.2541 6.5 18.8952 6.5 18.4762V10.8571C6.5 10.4381 6.64933 10.0792 6.948 9.78057C7.24616 9.48241 7.60476 9.33333 8.02381 9.33333ZM12.5952 16.1905C13.0143 16.1905 13.3731 16.0414 13.6718 15.7432C13.97 15.4446 14.119 15.0857 14.119 14.6667C14.119 14.2476 13.97 13.8888 13.6718 13.5901C13.3731 13.2919 13.0143 13.1429 12.5952 13.1429C12.1762 13.1429 11.8176 13.2919 11.5194 13.5901C11.2208 13.8888 11.0714 14.2476 11.0714 14.6667C11.0714 15.0857 11.2208 15.4446 11.5194 15.7432C11.8176 16.0414 12.1762 16.1905 12.5952 16.1905Z" />
                            </svg>
                        </div>
                        <div class="btn"
                        @click="props.onDeleteLayer({
                            action: 'layerMode',
                            value: {
                                checked: false,
                                layerName: node.name
                            }
                        })">
                            <img src="../assets/img/icon/delete.svg" alt="">
                        </div>
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
    .btn
        cursor: pointer
    .lockUp
        color: #808080
    .unlock
        color: #247BA0
</style>
