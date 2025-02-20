import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import globalMixin from './globalMixin'
import $bus from './eventbus';
import directives from "./directives/";

import './css/general.scss'

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'


import './css/tooltip.scss' 

window.api_url = 'https://kids.hidabroot.org/api/'; 

window.title_orig = document.title;

const app = createApp({
    extends: App
}).use(store).use(router)

app.mixin(globalMixin);
directives(app);

import axios from 'axios'
import VueAxios from 'vue-axios'
app.use(VueAxios, axios)

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
app.use(VueSweetalert2);

import wzselect from '@/components/wzselect.vue';
app.component('wzselect', wzselect)



// import Datepicker from '@vuepic/vue-datepicker';
// import '@vuepic/vue-datepicker/dist/main.css'

// import moment from 'moment'
// app.config.globalProperties.moment = moment;
// app.component('Datepicker', Datepicker);

import Popup from './components/popup.vue'
app.component('Popup', Popup);

app.config.globalProperties.$bus = $bus;

app.use((app) => {
    let Vue = {
        mixin: (m) => {
            app.mixin(m);
        },
        prototype: {}
    };

    Object.keys(Vue.prototype).forEach((key) => {
        app.config.globalProperties[key] = Vue.prototype[key]
    });
    

  })


app.mount('#app');