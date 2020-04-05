import Vue from 'vue'
import Vuex from 'vuex'

import recipes from './modules/recipes'
import users from './modules/users'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state: {
    },
    modules: {
        recipes,
        users
    }
})