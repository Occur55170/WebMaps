import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

// [230, 0, 0, 1] 紅色
// [104, 104, 104, 1] 灰色
// [115, 76, 0, 1] 土黃色

var areaData = [
    {
        name: "新竹大學",
        clickBtn: {
            name: 'circleName',
            graphics: 'Circle',
            color: 'rgba(255,0,0)',
            long: 0.005,
            coordinates: [120.9984423386347, 24.791781619336316],
        }
    },
    {
        name: '新竹火車站',
    },
    {
        name: '新竹市立動物園',
    },
]
export default function(){
    const state = reactive({
    })

    return state
}

