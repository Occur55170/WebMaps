<script>
import { reactive } from 'vue'

export default {
    props: {
        onClose: {
            type: Function,
            default: () => {
            },
        },
        onDeleteLayer: {
            type: Function,
            default: () => {
            },
        },
        onLockLayer: {
            type: Function,
            default: () => {
            },
        },
        currentLayers: {
            type: Array,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: [],
        },
        selectLock: {
            type: Boolean,
            default: false,
        },
        onLayerControl: {
            type: Function,
            default: () => {
            },
        },
        onChangeLayerVisible: {
            type: Function,
            default: () => {
            },
        },
    },
    setup(props, { emit }){
        const state = reactive({})

        function updateOpacity(e){
            props.onLayerControl({
                action: 'setOpacity',
                value: {
                    key: e.target.getAttribute('nodeindex'),
                    value: e.target.value,
                },
            })
            const opacity = parseFloat(Number(e.target.value))
            document.getElementById(`opacityControl${e.target.getAttribute('nodeindex')}`).innerText = opacity.toFixed(2)
        }

        return {
            props,
            state,
            updateOpacity,
        }
    },
}
</script>

<template>
  <div class="layerSelect bg-white">
    <div class="row mx-0 align-items-center flex-nowrap text-center p-2 fw-bold">
      <p class="mb-0 fs-5">已選擇的圖層</p>
      <a href="#"
         class="closeBtn bg-dark text-decoration-none rounded-circle position-absolute d-flex align-items-center justify-content-center"
         @click.prevent="props.onClose"></a>
    </div>
    <hr class="my-0">
    <div class="py-3 px-4 content" style="overflow-y: scroll;max-height: 40vh;">
      <div class="allControl d-flex align-items-center justify-content-end mb-0">
        <a href="" class="d-flex align-items-center text-decoration-none me-3"
           :class="{'lockUp': props.selectLock, 'unlock': !props.selectLock}"
           @click.prevent="()=>{
                    props.onLockLayer()
                }">
          <img src="../assets/img/icon/lockOpen.svg" alt="">
          鎖定圖層
        </a>
        <a href="" class="d-flex align-items-center text-decoration-none"
           :class="{'disabled':props.currentLayers.length <= 1}"
           @click.prevent="()=>{
                    if (props.currentLayers.length > 0) {
                        props.onDeleteLayer({
                            action: 'selectLayerMode',
                            value: {
                                layerName: 'all'
                            }
                        })
                    }
                }">
          <img src="../assets/img/icon/deleteLayer.svg" alt="">
          全部取消
        </a>
      </div>
      <ul class="list-unstyled d-flex flex-wrap flex-column-reverse">
        <li v-for="(node, nodeIndex) in props.currentLayers">
          <div class="d-flex justify-content-between align-items-center border-bottom py-2 flex-wrap" v-if="node.id">
            <div>
              {{ node?.label }}
            </div>
            <div class="tool">
              <a href=""
                 @click.prevent="props.onLayerControl({
                                action: 'changeOrder',
                                value: {
                                    movement:'up',
                                    id: node.id,
                                    key: nodeIndex
                                },
                            })">
                <img src="../assets/img/icon/arrow_up.svg" alt="">
              </a>
              <a href=""
                 @click.prevent="props.onLayerControl({
                                action: 'changeOrder',
                                value: {
                                    movement: 'down',
                                    id: node.id,
                                    key: nodeIndex
                                }
                            })">
                <img src="../assets/img/icon/arrow_down.svg" alt="">
              </a>
              <a href=""
                 :class="{
                                'Invisible': !node?.visible
                            }"
                 @click.prevent="()=>{
                                props.onChangeLayerVisible(nodeIndex)
                            }">
                <img src="../assets/img/icon/eyes.svg" alt="">
              </a>
              <a href=""
                 @click.prevent="props.onDeleteLayer({
                                action: 'selectLayerMode',
                                value: {
                                    id: node?.id,
                                }
                            })">
                <img src="../assets/img/icon/deleteLayer.svg" alt="">
              </a>
            </div>
            <label class="w-100 mt-2 d-flex align-items-center">
              <input id="opacity-input" class="w-75 me-2" type="range" min="0" max="1" step="0.01" value="1"
                     :nodeIndex="nodeIndex" @input="updateOpacity"/>
              <span :id="`opacityControl${ nodeIndex }`">1</span>
            </label>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import '@/assets/styles/all.module.scss'
.layerSelect
  border-radius: 10px

.closeBtn
  right: 10px
  width: 20px
  height: 20px
  padding: 0

  &::after
    content: ''
    background: #fff
    height: 2px
    width: 60%
    display: block

.content
  .title
    cursor: pointer

    svg
      transform: rotateZ(0)

    .openTitle
      transform: rotateZ(90deg)

  svg, img
    width: 28px
    height: 28px

.tool
  a
    padding: 5px 0

  .visible
    color: red

  .Invisible
    color: blue
    position: relative

    &::after
      content: ''
      position: absolute
      top: 55%
      left: 20%
      width: 60%
      height: 2px
      background: $grey
      transform-origin: 50% 50%
      transform: rotateZ(45deg)
      display: block

.allControl
  a
    color: $grey

  .lockUp
    color: #247BA0

  .unlock
    color: $grey

@media (max-width: 600px)
  .layerSelect
    border-radius: 0
</style>
