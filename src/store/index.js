import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import recipes from './modules/recipes'
import users from './modules/users'

import { ToastProgrammatic as Toast } from 'buefy'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state: {
        url: '/api',
        loggedIn: null
    },
    mutations: {
        loginChange(state, user) {
            state.loggedIn = user
        }
    },
    actions: {
        async initApp({ commit }) {
            if (localStorage.jwt) {
                axios.defaults.headers.Authorisation = `Bearer ${localStorage.jwt}`
                await axios.get("/api/auth", { headers: { Authorization: `Bearer ${localStorage.jwt}` } })
                    .then(res => {
                        console.log(res.data);
                        commit("loginChange", res.data)
                    })
                    .catch(reason => {
                        Toast.open({
                            message: `Error fetching user: ${reason}`,
                            position: 'is-bottom',
                            type: 'is-danger'
                        })
                        throw reason;
                    })
            }
        },
        async login({ commit }, cred) {
            console.log(cred.pass);
            await axios.post(`${this.state.url}/auth/login`, cred)
                .then(res => {
                    commit('loginChange', res.data)
                })
                .catch(reason => {
                    Toast.open({
                        message: `Error fetching user: ${reason}`,
                        position: 'is-bottom',
                        type: 'is-danger'
                    })
                    throw reason;
                })
        },
        async logout({ commit }) {
            localStorage.removeItem("jwt");
            commit('loginChange', null)
        }

    },
    getters: {
        getLoggedIn(state) {
            return state.loggedIn
        },
        isLoggedIn(state) {
            return state.loggedIn ? true : false
        }
    },
    modules: {
        recipes,
        users
    }
})