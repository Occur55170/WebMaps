import { createApp } from 'vue'
// import './style.css'
import './assets/styles/all.css'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap"
import $ from 'jquery'

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';



createApp(App).mount('#app')
