import { createApp } from 'vue'

import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import '@/assets/styles/all.scss'

import componentRegister from './config/componentRegister'

import router from '@/router/index.js'

import store from '@/store/index.js'

createApp(App)
    .use(router)
    .use(componentRegister)
    .use(store)
    .mount('#app')
