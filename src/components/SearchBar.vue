<script>
import { reactive } from 'vue'

export default {
  props: {
    currentLayers: {
      type: Array,
      default: [],
    },
    mapCount: {
      type: Number,
      default: 1,
    },
    dimensionMapStatus: {
      type: Boolean,
      default: false,
    },
    onChangeMapCount: {
      type: Function,
      default: () => {
      },
    },
    onChangeTarget: {
      type: Function,
      default: () => {
      },
    },
  },
  setup(props, { emit }){
    const state = reactive({
      toolSwitch: {
        threeDimensionalBtn: false,
        layerConditionBtn: false,
        splitWindowBtn: false,
      },
      targetNum: 1,
    })

    function toolSwitch(target, value){
      // 其他全部關掉
      Object.keys(state.toolSwitch).forEach((node) => {
        if (node === target){
          if (state.toolSwitch[target]){
            state.toolSwitch[target] = false
          } else{
            state.toolSwitch[target] = true
          }
        } else{
          state.toolSwitch[node] = false
        }
      })
    }

    function onLayerControl(action, value){
      emit('onLayerControl', {
        action,
        value,
      })
    }

    function conditionWrap(){
      emit('conditionWrap')
    }

    return {
      props,
      state,
      toolSwitch,
      onLayerControl,
      conditionWrap,
    }
  },
}
</script>

<template>
  <div>
    <ul
        class="list-unstyled d-inline-flex align-items-center flex-nowrap w-full"
    >
      <OverLayer :text="'圖層操控工具'"/>
      <li class="me-4 position-relative">
        <div class="MapFeatureBtn text-white">
          <a
              href=""
              v-if="props.dimensionMapStatus"
              @click.prevent="
              toolSwitch('threeDimensionalBtn'),
                onLayerControl('changeDimensionMap', '3D')
            "
          >
            <img src="@/assets/img/icon/2D.svg"/>
          </a>
          <a
              href=""
              v-else
              @click.prevent="
              toolSwitch('threeDimensionalBtn'),
                onLayerControl('changeDimensionMap', '2D')
            "
          >
            <img src="@/assets/img/icon/3D.svg"/>
          </a>
        </div>
      </li>
      <li class="me-4 position-relative">
        <a
            href=""
            class="MapFeatureBtn text-white"
            @click.prevent="toolSwitch('layerConditionBtn'), conditionWrap()"
        >
          <img src="@/assets/img/icon/baseLayer.svg" alt=""/>
        </a>
      </li>
      <li class="position-relative">
        <a
            href=""
            class="MapFeatureBtn text-white"
            @click.prevent="toolSwitch('splitWindowBtn')"
        >
          <img
              src="@/assets/img/icon/singleWindow.svg"
              alt=""
              v-if="props.mapCount === 1"
          />
          <img
              src="@/assets/img/icon/doubleWindows.svg"
              alt=""
              v-if="props.mapCount === 2"
          />
        </a>
        <ul
            class="list-unstyled position-absolute start-0 top-100 p-0"
            v-if="state.toolSwitch.splitWindowBtn"
        >
          <li class="mt-2">
            <a
                href=""
                class="text-white MapFeatureBtn"
                @click.prevent="props.onChangeMapCount(1)"
            >
              <img src="@/assets/img/icon/singleWindow.svg" alt=""/>
            </a>
          </li>
          <li class="mt-2">
            <a
                href=""
                class="text-white MapFeatureBtn"
                @click.prevent="props.onChangeMapCount(2)"
            >
              <img src="@/assets/img/icon/doubleWindows.svg" alt=""/>
            </a>
          </li>
        </ul>
      </li>
    </ul>

    <div
        class="switchControl d-flex position-fixed rounded-pill p-2"
        id="switchControl"
        style="z-index: 99"
    >
      <OverLayer :text="'左右視窗切換工具'"/>
      <div
          class="fs-3 text-white rounded-pill"
          :class="{ active: state.targetNum === 1 }"
          @click="
          () => {
            state.targetNum = 1;
            props.onChangeTarget(1);
          }
        "
      >
        左
      </div>
      <div
          class="fs-3 text-white rounded-pill"
          :class="{ active: state.targetNum === 2 }"
          @click="
          () => {
            state.targetNum = 2;
            props.onChangeTarget(2);
          }
        "
      >
        右
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.MapFeatureBtn
  display: block
  border-radius: 10px
  width: 68px
  height: 68px
  box-sizing: border-box

  img
    width: 100%
    height: 100%

    &:hover
      filter: brightness(0.9)

  svg
    font-size: 24px
    width: 100%
    height: 100%

.switchControl
  top: 10px
  left: 50%
  background: rgba(30, 30, 30, 0.9)
  box-sizing: border-box
  transform: translateX(-50%)

  div
    padding: 5px 28px
    cursor: pointer
    box-sizing: border-box

  .active
    background: #247BA0

@media (max-width: 1300px)
  .switchControl
    top: 10px
    left: unset
    right: 10px
    transform: unset
</style>
