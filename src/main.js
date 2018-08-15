import Vue from 'vue'
import App from './App.vue'

import VJstree from 'vue-jstree'



Vue.config.productionTip = false;

let V = new Vue( {
    render: h => h(App),
    components:{VJstree}
} );

V.$mount('#app');
