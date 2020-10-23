//import Vue from 'vue'
import Vue from 'vue/dist/vue.js'
import App from './App.vue'

import VueQRCodeComponent from 'vue-qrcode-component'

import { MdButton, MdContent, MdTabs, MdCard ,MdLayout,MdDivider} from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'

import VueRouter from 'vue-router'


var VueCookie = require('vue-cookie');
Vue.use(VueCookie);




const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const routes = [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
]
const router = new VueRouter({
    routes // short for `routes: routes`
})


Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdCard)
Vue.use(MdTabs)
Vue.use(MdLayout)
Vue.use(MdDivider)
Vue.use(VueRouter)



Vue.component('qr-code', VueQRCodeComponent)


Vue.config.productionTip = false;


var glob = require('./glob');
glob.host = "https://whatsnote.live/";
glob.fileHost = "https://whatsnote.live/";

var V = new Vue( {
    render: h => h(App),
    router
} );



V.$mount('#app');
