import { createApp } from 'vue'

import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import componentRegister from './config/componentRegister'

import './assets/styles/all.module.scss'
import router from '@/router/index.js'

import VueCarousel from 'vue-carousel'
import store from '@/store/index.js'

createApp(App)
.use(router)
.use(VueCarousel)
.use(componentRegister)
.use(store)
.mount('#app')
