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
        onChangeOrderLayer: {
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
        })

        function deleteAllLayer(){
        }

        return {
            props,
            state,
            deleteAllLayer,
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
            <!-- <p class="text-end">
                <a href="" @click.prevent="deleteAllLayer()">全部刪除</a>
            </p> -->
            <!-- {{ props.currentLayers }} -->
            <ul class="list-unstyled d-flex flex-wrap flex-column-reverse">
                <li class="d-flex justify-content-between align-items-center border-bottom"
                v-for="(node, nodeIndex) in props.currentLayers">
                    <div>
                        {{ node.name }}
                    </div>
                    <div class="tool">
                        <div class="btn"
                        v-if="nodeIndex !== 0"
                        @click="props.onChangeOrderLayer({
                            action: 'changeOrder',
                            value: {
                                movement:'up',
                                key: nodeIndex
                            },
                        })"
                        >
                            <svg viewBox="0 0 25 24" fill="currentColor">
                                <path d="M9.49991 19.84H15.4999V11.84H20.3399L12.4999 4.00003L4.65991 11.84H9.49991V19.84Z" fill="#808080" />
                            </svg>
                        </div>
                        <div class="btn"
                        v-if="nodeIndex !== 0"
                        @click="props.onChangeOrderLayer({
                            action: 'changeOrder',
                            value: {
                                movement: 'down',
                                key: nodeIndex
                            }
                        })"
                        >
                            <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.49991 4H15.4999V12H20.3399L12.4999 19.84L4.65991 12H9.49991V4Z" fill="#808080"/>
                            </svg>
                        </div>
                        <div class="btn"
                        @click="()=>{
                            props.onLockLayer(nodeIndex)
                        }">
                            <svg viewBox="0 0 25 24" fill="currentColor" :class="{'lockUp': node.lock, 'unlock': !node.lock}">
                                <path d="M8.02381 9.33333H14.881V7.80952C14.881 7.1746 14.6587 6.63492 14.2143 6.19048C13.7698 5.74603 13.2302 5.52381 12.5952 5.52381C11.9603 5.52381 11.4206 5.74603 10.9762 6.19048C10.5317 6.63492 10.3095 7.1746 10.3095 7.80952H8.78571C8.78571 6.75556 9.15727 5.85702 9.90038 5.1139C10.643 4.3713 11.5413 4 12.5952 4C13.6492 4 14.5477 4.3713 15.2909 5.1139C16.0335 5.85702 16.4048 6.75556 16.4048 7.80952V9.33333H17.1667C17.5857 9.33333 17.9446 9.48241 18.2432 9.78057C18.5414 10.0792 18.6905 10.4381 18.6905 10.8571V18.4762C18.6905 18.8952 18.5414 19.2541 18.2432 19.5528C17.9446 19.8509 17.5857 20 17.1667 20H8.02381C7.60476 20 7.24616 19.8509 6.948 19.5528C6.64933 19.2541 6.5 18.8952 6.5 18.4762V10.8571C6.5 10.4381 6.64933 10.0792 6.948 9.78057C7.24616 9.48241 7.60476 9.33333 8.02381 9.33333ZM12.5952 16.1905C13.0143 16.1905 13.3731 16.0414 13.6718 15.7432C13.97 15.4446 14.119 15.0857 14.119 14.6667C14.119 14.2476 13.97 13.8888 13.6718 13.5901C13.3731 13.2919 13.0143 13.1429 12.5952 13.1429C12.1762 13.1429 11.8176 13.2919 11.5194 13.5901C11.2208 13.8888 11.0714 14.2476 11.0714 14.6667C11.0714 15.0857 11.2208 15.4446 11.5194 15.7432C11.8176 16.0414 12.1762 16.1905 12.5952 16.1905Z" />
                            </svg>
                        </div>
                        <div class="btn"
                        :class="{'Invisible': !node.visible}"
                        @click="()=>{
                            props.onChangLayerVisible({
                                action: 'changeLayerVisible',
                                value: {
                                    key: nodeIndex
                                }
                            })
                        }">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.3333 10C11.8029 10 11.2942 10.2107 10.9191 10.5858C10.544 10.9609 10.3333 11.4696 10.3333 12C10.3333 12.5304 10.544 13.0391 10.9191 13.4142C11.2942 13.7893 11.8029 14 12.3333 14C12.8638 14 13.3725 13.7893 13.7475 13.4142C14.1226 13.0391 14.3333 12.5304 14.3333 12C14.3333 11.4696 14.1226 10.9609 13.7475 10.5858C13.3725 10.2107 12.8638 10 12.3333 10ZM12.3333 15.3333C11.4493 15.3333 10.6014 14.9821 9.97631 14.357C9.35119 13.7319 9 12.8841 9 12C9 11.1159 9.35119 10.2681 9.97631 9.64298C10.6014 9.01786 11.4493 8.66667 12.3333 8.66667C13.2174 8.66667 14.0652 9.01786 14.6904 9.64298C15.3155 10.2681 15.6667 11.1159 15.6667 12C15.6667 12.8841 15.3155 13.7319 14.6904 14.357C14.0652 14.9821 13.2174 15.3333 12.3333 15.3333ZM12.3333 7C9 7 6.15333 9.07333 5 12C6.15333 14.9267 9 17 12.3333 17C15.6667 17 18.5133 14.9267 19.6667 12C18.5133 9.07333 15.6667 7 12.3333 7Z" fill="#808080"/>
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
                            <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 21C6.95 21 6.47933 20.8043 6.088 20.413C5.696 20.021 5.5 19.55 5.5 19V6H4.5V4H9.5V3H15.5V4H20.5V6H19.5V19C19.5 19.55 19.3043 20.021 18.913 20.413C18.521 20.8043 18.05 21 17.5 21H7.5ZM9.5 17H11.5V8H9.5V17ZM13.5 17H15.5V8H13.5V17Z" fill="#808080"/>
                            </svg>
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
        width: 28px
        height: 28px
    img
        width: 16px
        height: 16px
.tool
    .btn
        cursor: pointer
        padding: 5px 10px
    .lockUp
        color: #808080
    .unlock
        color: #247BA0
    .visible
        color: red
    .Invisible
        color: blue
        position: relative
        &::after
            content: ''
            position: absolute
            top: 50%
            left: 20%
            width: 60%
            height: 2px
            background: $grey
            transform-origin: 50% 50%
            transform: rotateZ(45deg)
            display: block
</style>
