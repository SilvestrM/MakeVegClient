import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//import Vuex from 'vuex'
import Buefy from 'buefy'

Vue.use(Buefy)

import utils from './mixins/utils'

Vue.mixin(utils);


Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
