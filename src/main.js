import { createApp } from 'vue'

import './assets/styles/all.css'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap"
import $ from 'jquery'

import componentRegister from './componentRegister'

const app = createApp(App)

app.use(componentRegister)

app.mount('#app')
