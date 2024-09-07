<script setup>
import { reactive } from 'vue'
import { Carousel, Pagination, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const props = defineProps({
  carouselList: {
    type: Array,
    default: [],
  },
})
const emit = defineEmits([])
const state = reactive({})
</script>
<template>
  <Carousel>
    <Slide v-for="(item, itemKey) in props.carouselList" :key="itemKey">
      <div class="w-100">
        <div class="row mb-2">
          <div
              class="col-4 p-1 bg-red-light text-white d-flex justify-content-center align-items-center"
          >
            編號
          </div>
          <div class="col-8 py-1 px-2 bg-grey-light text-start">
            {{ itemKey + 1 }}
          </div>
        </div>
        <div class="row mb-2">
          <div
              class="col-4 p-1 bg-red-light text-white d-flex justify-content-center align-items-center"
          >
            日期
          </div>
          <div class="col-8 py-1 px-2 bg-grey-light text-start">
            {{ item.date }}
          </div>
        </div>
        <div class="row mb-2">
          <div
              class="col-4 p-1 bg-red-light text-white d-flex justify-content-center align-items-center"
          >
            災害原因
          </div>
          <div class="col-8 py-1 px-2 bg-grey-light text-start">
            {{ item.cause }}
          </div>
        </div>
        <div class="row mb-2">
          <div
              class="col-4 p-1 bg-red-light text-white d-flex justify-content-center align-items-center"
          >
            災害描述
          </div>
          <div class="col-8 py-1 px-2 bg-grey-light text-start">
            {{ item.description }}
          </div>
        </div>
      </div>
    </Slide>
    <template #addons>
      <Pagination/>
    </template>
  </Carousel>
</template>
<style lang="sass" scoped>
@import '@/assets/styles/all.module.scss'
.carousel__item
  min-height: 200px
  width: 100%
  font-size: 20px
  border-radius: 8px
  display: flex
  justify-content: center
  align-items: center

.carousel__slide
  padding: 20px

.carousel__prev,
.carousel__next
  box-sizing: content-box
  border: 5px solid white
</style>
