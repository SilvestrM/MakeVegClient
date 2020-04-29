import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//import Vuex from 'vuex'
import Buefy from 'buefy'

// Buefy constructor settings
Vue.use(Buefy, {
  defaultToastDuration: 4000,
  defaultToastPosition: 'is-top',
  defaultTooltipAnimated: true
})

import utils from './mixins/utils'

Vue.mixin(utils);


Vue.config.productionTip = false

store.dispatch("initApp").then(() => {
  new Vue({
    store,
    router,
    render: h => h(App)
  }).$mount('#app')
})
