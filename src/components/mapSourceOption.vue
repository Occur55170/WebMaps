<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

export default {
    props: {
        onChangeBaseMaps: {
            type: Function,
            default: ()=>{}
        },
    },
    setup(props, { emit }) {
        const state = reactive({
            selectMap: null,
            mapSourceList: []
        })
        function onChangeBaseMaps(){
            let action = 'baseMap'
            let value = {
                layer: state.mapSourceList.find(node=> node.label === state.selectMap)
            }
            props.onChangeBaseMaps({ action, value })
        }

        onMounted(async ()=>{
            await $.ajax({
                url: `https://api.edtest.site/underLayers`,
                method: "GET"
            }).done(res => {
                console.log(res)
                state.mapSourceList = res.data
                state.selectMap = res.data[0].label
            }).fail(FailMethod => {
                console.log('Fail', FailMethod)
            })
        })

        return {
            state,
            props,
            onChangeBaseMaps
        }
    }
}
</script>

<template>
    <div>
        <select name="" id="" v-model="state.selectMap"
        @change="(e) => {
            onChangeBaseMaps(e)
        }">
            <option v-for="(node, nodeIndex) in state.mapSourceList" :key="nodeIndex" :value="node.label">{{ node.label }}</option>
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
