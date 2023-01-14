import { createApp } from 'vue'

import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap"

import 'switch-button/dist/index.css'
import componentRegister from './componentRegister'

import './assets/styles/all.module.scss'


const app = createApp(App)
// app.use(createSwitch)
app.use(componentRegister)

app.mount('#app')
