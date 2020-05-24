import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import recipes from './modules/recipes'
import users from './modules/users'
import diets from './modules/diets'

import { ToastProgrammatic as Toast } from 'buefy'

Vue.use(Vuex)

//TODO fix states

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        url: '/api',
        loggedIn: null,
        authToken: ''
    },
    mutations: {
        setToken(state, token) {
            state.authToken = token
        },
        loginChange(state, user) {
            if (user !== null) {
                user.authToken = localStorage.jwt
            }
            state.loggedIn = user
        }
    },
    actions: {
        async initApp({ commit }) {
            if (localStorage.jwt) {
                axios.defaults.headers.Authorisation = `Bearer ${localStorage.jwt}`

                await axios.get("/api/auth", { headers: { Authorization: `Bearer ${localStorage.jwt}` } })
                    .then(response => {
                        const user = response.data
                        // commit("setToken", localStorage.jwt)
                        commit("loginChange", user)
                    })
                    .catch(reason => {
                        if (reason.response.status === 400) {
                            localStorage.removeItem("jwt");
                        } else {
                            Toast.open({
                                message: `Error fetching user: ${reason}`,
                                type: 'is-danger'
                            })
                        }
                    })
            }
        },
        async register({ dispatch }, data) {
            await axios.post(`${this.state.url}/register/`, data)
                .then(async res => {
                    await dispatch("addToken", res)
                    Toast.open({
                        message: `Registration successfully completed`,
                        type: 'is-success'
                    })
                })
                .catch(reason => {
                    Toast.open({
                        message: `Error: ${reason.response.data}`,
                        type: 'is-danger'
                    })
                })
        },
        async login({ dispatch }, cred) {
            await axios.post(`${this.state.url}/auth/login`, cred)
                .then(async res => {
                    await dispatch("addToken", res)
                })
                .catch(reason => {
                    Toast.open({
                        message: `Error: ${reason.response.data}`,
                        type: 'is-danger'
                    })
                })
        },
        async logout({ commit }) {
            localStorage.removeItem("jwt");
            commit('loginChange', null)
        },
        async addToken({ commit }, response) {
            localStorage.removeItem("jwt");
            localStorage.setItem("jwt", response.headers.authorisation.replace('Bearer ', ''));
            const user = response.data
            // commit('setToken', response.headers.authorisation)
            commit('loginChange', user)
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
        users,
        diets
    }
})