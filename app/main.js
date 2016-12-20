import './main.scss'

import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import Helpers from './plugins/helpers'

// Components
import cardWrapper from './components/card-wrapper/card-wrapper'
import intro from './components/intro/intro'

import { pageView } from './utils/ga'

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Helpers)

Vue.http.options.root = process.env.NODE_ENV !== 'production'
  ? 'http://localhost.floatbehind.ninja:3000/api/v1'
  : 'https://app.floatbehind.ninja/api/v1'
Vue.http.options.credentials = true

const App = Vue.extend({})

const router = new VueRouter({
  history: process.env.NODE_ENV === 'production'
})

router.map({
  '/': {
    component: cardWrapper
  },
  '/intro': {
    component: intro
  }
})

router.start(App, '#app')

pageView()
