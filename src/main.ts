import Vue from 'vue'
import App from './Views/App.vue'

//plugins
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import StoragePlugin from 'vue-web-storage'

Vue.use(VueAxios, axios)
Vue.use(StoragePlugin, {
  drivers: ['session', 'local'],
})

Vue.config.productionTip = false

//store and router
import store from './store'
import '@/store/modules/MoneyBalStore'
import '@/store/modules/RateStore'
import '@/store/modules/MoneyOnWay'
//
import router from './router'

const app = new Vue({
  store,
  vuetify,
  router,
  render: (h) => h(App),
})

app.$mount('#app')
