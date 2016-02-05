import './main.scss';

import Vue from 'vue';
import VueResource from 'vue-resource';
import Helpers from './plugins/helpers';
import cardWrapper from './components/card-wrapper/card-wrapper';

Vue.use(VueResource);
Vue.use(Helpers);

const app = new Vue(cardWrapper);

app.$mount('#app');
