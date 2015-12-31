'use strict';

import './main.scss';

import Vue from 'vue';
import cardWrapper from './components/card-wrapper/card-wrapper';

const app = new Vue(cardWrapper);

app.$mount('#app');
