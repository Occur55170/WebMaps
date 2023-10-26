<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

export default {
    props: {
        baseMapList: {
            type: Array,
            default: []
        },
        onChangeBaseMaps: {
            type: Function,
            default: ()=>{}
        },
    },
    setup(props, { emit }) {
        const state = reactive({
            selectMap: 0,
            mapSourceList: []
        })
        return {
            state,
            props,
        }
    }
}
</script>

<template>
    <div>
        <OverLayer :text="'底圖切換工具'" />
        <select name="" id="" v-model="state.selectMap"
        @change="(e) => {
            let value = props.baseMapList.find(node=> node.baseId === state.selectMap)
            props.onChangeBaseMaps({ action: 'baseMap', value })
        }">
            <option v-for="(node, nodeIndex) in props.baseMapList" :key="nodeIndex" :value="node.baseId">{{ node.label }}</option>
        </select>
    </div>
</template>

<style lang="sass" scoped>
select
    border: 0
    box-shadow: 0px 4px 4px #999
    border-radius: 5px
    padding: 8px 20px
    option
        padding: 8px 20px
</style>
