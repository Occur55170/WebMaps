<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
export default {
    props: {
        baseMaps: {
            type: Array,
            default: []
        },
        onChangeBaseMaps: {
            type: Function,
            default: ()=>{}
        }
    },
    setup(props, { emit }) {
        const state = reactive({
            selectMap: props.baseMaps[0]
        })
        function onChangeBaseMaps(name){
            let action = 'baseMap'
            let value = {
                checked: true,
                layerName: state.selectMap
            }
            emit('onChangeBaseMaps', { action, value })
        }
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
            onChangeBaseMaps()
        }">
            <option :value="node" v-for="(node, node_i) in props.baseMaps">{{ node }}</option>
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
