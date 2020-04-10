import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import recipes from './modules/recipes'
import users from './modules/users'
import diets from './modules/diets'

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
        async register({ dispatch }, data) {
            await axios.post(`${this.state.url}/register/`, data)
                .then(res => {
                    dispatch("addToken", res.data)
                })
                .catch(reason => {
                    Toast.open({
                        message: `Error: ${reason}`,
                        position: 'is-bottom',
                        type: 'is-danger'
                    })
                    throw reason;
                })
        },
        async login({ dispatch }, cred) {
            await axios.post(`${this.state.url}/auth/login`, cred)
                .then(res => {
                    dispatch("addToken", res.data)
                })
                .catch(reason => {
                    Toast.open({
                        message: `Error: ${reason}`,
                        position: 'is-bottom',
                        type: 'is-danger'
                    })
                    throw reason;
                })
        },
        async logout({ commit }) {
            localStorage.removeItem("jwt");
            commit('loginChange', null)
        },
        async addToken({ commit }, user) {
            localStorage.removeItem("jwt");
            localStorage.setItem("jwt", user.tokens[0].token);
            commit('loginChange', user)
        },

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
        users,
        diets
    }
})