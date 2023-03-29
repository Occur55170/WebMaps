<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'

export default {
    props: {
        onClose: {
            type: Function,
            default: () => { }
        },
        mapLayers: {
            type: Array,
            default: []
        },
        currentLayers: {
            type: Array,
            default: []
        },
    },
    setup(props, { emit }) {
        const state = reactive({
            DropDown: null,
        })

        function onMapControl(action, value) {
            emit('onMapControl', { action, value })
        }

        function onLayerControl(action, value) {
            console.log(action, value)
            emit('onLayerControl', { action, value })
        }
        function openLayerList(value) {
            if (state.DropDown !== value) {
                state.DropDown = value
            } else {
                state.DropDown = null
            }
        }
        window.console.log(props.mapLayers[0].layers[0])
        return {
            props,
            state,
            onMapControl,
            onLayerControl,
            openLayerList
        }
    }
}
</script>

<template>
    <div class="rounded-4 bg-white">
        <div class="row mx-0 align-items-center flex-nowrap text-center p-2 fw-bold border-bottom">
            <p class="mb-0">圖層選項</p>
            <a href="" class="closeBtn position-absolute col-auto" @click.prevent="props.onClose">
                <svg width="32" height="32" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm0-11.414L9.172 7.757L7.757 9.172L10.586 12l-2.829 2.828l1.415 1.415L12 13.414l2.828 2.829l1.415-1.415L13.414 12l2.829-2.828l-1.415-1.415L12 10.586z" />
                </svg>
            </a>
        </div>
        <div class="py-3 px-4 content">
            <div class="mb-2 landBoundary">
                <div v-for="(node, nodeIndex) in props.mapLayers" class="mb-2">
                    <div class="title d-flex align-items-center fw-bold text-black order-1 mb-1 text-decoration-none" @click="openLayerList(nodeIndex)">
                        <img src="../assets/img/icon/landBoundary.svg" alt="">
                        <div>{{ node.label }}</div>
                        <svg viewBox="0 0 24 24" :class="{'openTitle': state.DropDown == nodeIndex}">
                            <path fill="currentColor" d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <div class="ms-3" v-for="(subNode, subNodeIndex) in node.layers" v-if="state.DropDown == nodeIndex">
                        <!-- checked="{false}" -->
                        <input type="radio"
                            @change="(e) => {
                                onLayerControl('layerMode', {
                                    checked: e.target.checked,
                                    subNodeValue: subNodeIndex,
                                })
                            }">
                        {{ subNode.title }}
                        <div  class="ms-3" v-for="(tile, tileIndex) in subNode?.tiles_list">
                            <input type="checkbox"
                            @change="(e) => {
                                onLayerControl('layerMode', {
                                    checked: e.target.checked,
                                    subNodeValue: subNodeIndex,
                                    tileValue: tileIndex,
                                })
                            }">
                            {{ tile.title }}
                            <!-- group_title: "土石流、山崩", -->
                            <!-- {{ subNode?.info_box?.items_group }} -->
                            <!-- {{ subNode?.info_box }} -->
                        </div>
                    </div>
                </div>
            </div>
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
    .wrap
        display: none
</style>