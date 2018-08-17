import Vue from 'vue'
import App from './App.vue'

import VueQRCodeComponent from 'vue-qrcode-component'

import { MdButton, MdContent, MdTabs, MdCard ,MdLayout,MdDivider} from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'

var VueCookie = require('vue-cookie');
Vue.use(VueCookie);



Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdCard)
Vue.use(MdTabs)
Vue.use(MdLayout)
Vue.use(MdDivider)



Vue.component('qr-code', VueQRCodeComponent)


Vue.config.productionTip = false;


var glob = require('./glob');
glob.host = "http://139.59.51.167/";

var V = new Vue( {
    render: h => h(App)
} );



V.$mount('#app');
