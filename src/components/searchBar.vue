<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'

export default {
    props: {},
    setup(props, { emit }) {
        const state = reactive({
            toolSwitch: {
                threeDimensional: false,
                layerCondition: false,
                splitWindow: false,
            }
        })
        function toolSwitch(target){
            Object.keys(state.toolSwitch).forEach(node=>{
                if(node == target){
                    state.toolSwitch[node] = !state.toolSwitch[node]
                } else {
                    state.toolSwitch[node] = false
                }
            })
        }

        const changeLayouts = function (action){
            emit('layouts', action)
        }
        const moveTo = function (){
            emit('moveTo')
        }
        const exampleChange = function (e){
            console.log(e.target.checked)
            emit('mapMode', e.target.checked)
        }
        return {
            state,
            toolSwitch,
            changeLayouts,
            exampleChange,
            moveTo
        }
    }
}
</script>

<template>
    <div class="row flex-wrap mx-0">
        <div class="searchbar">
            <input type="text" placeholder="請輸入關鍵字">
        </div>
        <ul class="list-unstyled d-flex align-items-center flex-nowrap">
            <li class="me-4">
                <a href="" class="text-white" @click.prevent="toolSwitch('threeDimensional')">
                    <svg viewBox="0 0 24 24">
                        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2">
                            <path
                                d="M16.466 7.5C15.643 4.237 13.952 2 12 2C9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2m2.194-8.093l3.814 1.86l-1.86 3.814" />
                            <path
                                d="M19 15.57c-1.804.885-4.274 1.43-7 1.43c-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4" />
                        </g>
                    </svg>
                </a>
            </li>
            <li class="me-4 position-relative">
                <a href="" class="text-white" @click.prevent="toolSwitch('layerCondition')">
                    <svg viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3l5.571-3m-11.142 0L2.25 7.5L12 2.25l9.75 5.25l-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75L2.25 16.5l4.179-2.25m11.142 0l-5.571 3l-5.571-3" />
                    </svg>
                </a>
                <div class="condition bg-white position-absolute start-0 top-100 mt-2 " v-if="state.toolSwitch.layerCondition">
                    <div class="p-3">
                        <p>1.點擊<div class="text-blue" @click="moveTo">前往示範案例</div></p>
                        <div>
                            <input type="checkbox" name="example" id="example" @change="exampleChange">
                            <label for="example">2.開啟圖層</label>
                        </div>
                        <!-- <ul>
                            <li><a href=""></a></li>
                            <li><a href=""></a></li>
                            <li><a href=""></a></li>
                            <li><a href=""></a></li>
                        </ul>
                        <div>
                            <p></p>
                            <p></p>
                            <p></p>
                            <p></p>
                            <p></p>
                            <p></p>
                        </div> -->
                    </div>
                </div>
            </li>
            <li class="me-4 position-relative">
                <a href="" class="text-white" @click.prevent="toolSwitch('splitWindow')">
                    <svg viewBox="0 0 20 20">
                        <path fill="currentColor" d="M2 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h5.5V5H4Zm12 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-5.5v10H16Zm-4.5-1a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1Zm2.5-.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Zm1.5.5a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1Z" />
                    </svg>
                </a>
                <ul class="list-unstyled position-absolute start-0 top-100 p-0" v-if="state.toolSwitch.splitWindow">
                    <li class="mt-2">
                        <a href="" @click.prevent="changeLayouts('remove')" class="text-white">
                            <svg viewBox="0 0 20 20">
                                <path fill="currentColor" d="M2 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h5.5V5H4Zm12 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-5.5v10H16Zm-4.5-1a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1Zm2.5-.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Zm1.5.5a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1Z" />
                            </svg>
                        </a>
                    </li>
                    <li class="mt-2">
                        <a href="" @click.prevent="changeLayouts('add')" class="text-white">
                            <svg viewBox="0 0 20 20">
                                <path fill="currentColor" d="M2 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h5.5V5H4Zm12 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-5.5v10H16Zm-4.5-1a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1Zm2.5-.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Zm1.5.5a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1Z" />
                            </svg>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<style lang="sass" scoped>
@import "./src/assets/styles/global.scss"

.searchbar
    width: 322px
    position: relative
    input
        width: 100%
        margin-bottom: 15px
        border-radius: 20px
        border: 0
        padding: 10px 20px
    &::after
        content: ''
        position: absolute
        right: 30px
        top: 20%
        --un-icon: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 1024 1024' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M1014.64 969.04L703.71 656.207c57.952-69.408 92.88-158.704 92.88-256.208c0-220.912-179.088-400-400-400s-400 179.088-400 400s179.088 400 400 400c100.368 0 192.048-37.056 262.288-98.144l310.496 312.448c12.496 12.497 32.769 12.497 45.265 0c12.48-12.496 12.48-32.752 0-45.263zM396.59 736.527c-185.856 0-336.528-150.672-336.528-336.528S210.734 63.471 396.59 63.471c185.856 0 336.528 150.672 336.528 336.528S582.446 736.527 396.59 736.527z'/%3E%3C/svg%3E")
        mask: var(--un-icon) no-repeat
        mask-size: 100% 100%
        -webkit-mask: var(--un-icon) no-repeat
        -webkit-mask-size: 100% 100%
        background-color: currentColor
        color: inherit
        width: 1.2em
        height: 1.2em
a
    display: block
    background: $black-deep
    border-radius: 10px
    width: 44px
    height: 44px
    padding: 10px
    box-sizing: border-box
    :hover
        // background:

svg
    font-size: 24px
    width: 100%
    height: 100%
.condition
    width: 500px
    // height: 500px


</style>
