import './main.scss';

import Vue from 'vue';
import VueResource from 'vue-resource';
import Helpers from './plugins/helpers';
import cardWrapper from './components/card-wrapper/card-wrapper';

import { pageView } from './utils/ga';

Vue.use(VueResource);
Vue.use(Helpers);

Vue.http.options.root = '/api/v1';

const app = new Vue(cardWrapper);

app.$mount('#app');

pageView();
