<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject } from 'vue'
import $ from 'jquery'

import WebMap from './components/WebMap.vue'
import Wes from './components/Wes.vue'
import LayoutTool from './components/LayoutTool.vue'
import SearchBar from './components/SearchBar.vue'

import opp from './components/opp.vue'
// import createSwitch,{ deleteSwitch } from 'switch-button'
// import 'switch-button/dist/index.css'


import createSwitch,{ deleteSwitch } from 'switch-button'

export default {
    data(){
        return {
            count: 1,
            isActive: true,
            targetNum: 1
        }
    },
    methods: {
        moveTo(x,y) {
            this.$refs.child.moveTo(x,y);
        },
        mapMode(value){
            console.log('parent' + value)
            this.$refs.child.addLayout(value)
        },
        layouts(action){
            const vm = this
            vm.count = action == 'add' ? 2 : 1
            // 有找到元素就不加
            if(action && !(document.getElementById('switchControl'))){
                const switchControl = document.createElement('button')
                switchControl.setAttribute('id', 'switchControl')
                switchControl.setAttribute('class', 'order-0')
                document.getElementById('asideTool').appendChild(switchControl)
                const switchBtn = createSwitch(switchControl, {
                    text: ['左', '右'],
                    onChange: (checked) => {
                        console.log('checked', checked)
                        vm.targetNum = !checked ? 1 : 2
                    },
                })
            }
            vm.$refs.child.changeMapCount(vm.count)
        },
        controlMap(action, value){
            console.log(123)
            console.log(action, value)
            this.$refs.child.controlMap(action, value)
        }
    },
    computed:{
        asideToolPosition(){
            return this.count == 1
        },
    },
    components: {
        WebMap,
        Wes,
    },
    setup(props, { emit }) {
        const state = reactive({
            count: 1,
            math: 0,
            targetMap: 1,
            aMap: false,
        })

        function abMap (e){
            emit('mapMode', e.target.checked)
            if(e.target.checked){
                state.aMap= true
            } else {
                state.aMap= false
            }
        }
        onMounted(()=>{
                // change status will update view
                // switchBtn.checked = true
                // switchBtn.loading = true
                // switchBtn.disabled = true

                // delete switch button
                // deleteSwitch(ele)
        })
        return {
            state,
            abMap,
        }
    }
}
</script>

<template>
    <div style="position:fixed;right:0;z-index: 999;background: #fff;padding: 20px;">
        <div>
            <!-- <input type="checkbox" name="example" id="example" v-model="state.aMap" :value="false"> -->
            <!-- <label for="example">切換(僅可切換一次)</label> -->
            <a href="" @click.prevent="controlMap('moveTo', {xAxis:-96.794027, yAxis:31.624217})">123 00{{ count }}</a>
        </div>
    </div>

    <SearchBar class="SearchBar"
        @moveTo="controlMap('moveTo', {xAxis:-96.794027, yAxis:31.624217})"
        @mapMode="(value)=>mapMode(value)"
        @layouts="(action)=>layouts(action)"
    />
        <!-- <LayoutTool class="LayoutTool" /> -->
        <!-- id="asideTool" -->
        <div class="asideTool position-absolute"
        id="asideTool"
        :class="{
            'top-50 end-0 translate-middle-y': asideToolPosition,
            'd-flex flex-nowrap top-0 start-50 translate-middle-x align-items-center': !asideToolPosition,
        }"
        >
            <!-- <switch-button v-model="isActive" v-if="!asideToolPosition" /> -->
            <div class="asideTool-btn order-1" @click="controlMap('moveTo')">定位</div>
            <div class="asideTool-btn order-1" @click="controlMap('In')">放大</div>
            <div class="asideTool-btn order-1" @click="controlMap('Out')">縮小</div>
        </div>
    <div class="main">
    </div>

    <!-- <opp /> -->
    <Wes ref="child" :targetNum="targetNum"/>
    <!-- <div class="mapContent">
        <div v-if="state.aMap"><WebMap ref="WebMap" :count="state.count" /></div>
        <div v-if="!state.aMap"><Wes ref="child" /></div>
    </div> -->
</template>

<style lang="sass">
@import './assets/styles/all.module.scss'

.mapContent
    height: 100vh
    width: 100vw
.main
    position: fixed
    top: 36px
    left: 36px
    z-index: 10
    padding: 20px
    box-sizing: border-box

.SearchBar
    position: absolute
    top: 20px
    left: 20px
    z-index: 220


.LayoutTool
    position: absolute
    top: 0
    left: 0
    z-index: 220

.asideTool
    z-index: 220
    // div
    //     background: #fff
    //     margin: 20px
    //     padding: 20px
    //     font-size: 20px
    //     border: 1px solid #000
</style>
