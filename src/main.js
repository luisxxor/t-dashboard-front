import Vue from 'vue'
import axios from 'axios'
import * as VueGoogleMaps from 'vue2-google-maps'
import VTooltip from 'v-tooltip'
import { library } from '@fortawesome/fontawesome-svg-core'
import 'vue-slider-component/theme/default.css'
import {
    faTh,
    faList,
    faSearch,
    faChevronLeft,
    faChevronRight,
    faEye,
    faDownload,
    faBath,
    faBed,
    faParking,
    faFileExcel,
} from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Argon from './plugins/argon-kit'
import BaseNav from './components/argon/BaseNav'
import BaseDropdown from './components/argon/BaseDropdown'
import App from './App'
import router from './router'
import store from './store'

Vue.component('font-awesome-icon', FontAwesomeIcon)

library.add(faGoogle)
library.add(faTh)
library.add(faList)
library.add(faSearch)
library.add(faChevronLeft)
library.add(faChevronRight)
library.add(faEye)
library.add(faDownload)
library.add(faBath)
library.add(faBed)
library.add(faParking)
library.add(faFileExcel)

Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyCGsZOcMtJNr9jfglWHdboGciUeEW3kZRE',
        libraries: 'places,drawing',
        region: 'PE',
        language: 'es-419',
    },
})
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('base-nav', BaseNav)
Vue.component('base-dropdown', BaseDropdown)
Vue.use(Argon)
Vue.use(VTooltip)

Vue.prototype.$http = axios // Get axios on Vue instance
Vue.config.productionTip = false

const token = localStorage.getItem('token') // get JWT token

Vue.prototype.$http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
Vue.prototype.$http.defaults.baseURL = 'http://localhost:8000/'

if (token) { // if JWT token exists
    Vue.prototype.$http.defaults.headers.common.Authorization = `Bearer ${token}`
}

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
