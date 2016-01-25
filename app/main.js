'use strict';

import './main.scss';

import Vue from 'vue';
import VueResource from 'vue-resource';
import cardWrapper from './components/card-wrapper/card-wrapper';

Vue.use(VueResource);

const app = new Vue(cardWrapper);

app.$mount('#app');
