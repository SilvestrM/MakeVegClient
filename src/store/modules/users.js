import { ToastProgrammatic as Toast } from 'buefy'
import axios from 'axios'

const users = {
    strict: true,
    state: {
        url: "/api/users/",
        users: [],
        user: {}
    },
    mutations: {
        addUser: (state, data) => state.users.push(data),
        setUser: (state, data) => {
            state.user = data
        },
        setUsers: (state, data) => {
            state.users = data
        },
        updateCategory: (state, data) => {
            const i = state.users.findIndex(category => category._id === data._id)
            if (i !== -1) state.users.splice(i, 1, data)
        },
        removeCategory: (state, id) => (state.users = state.users.filter(category => category._id !== id))
    },
    actions: {
        async fetchUsers({ commit, state }) {
            await axios.get(state.url).then(resolve => {
                commit('setUsers', resolve.data)
            })
                .catch(reason => {
                    Toast.open({
                        message: `Error fetching data: ${reason}`,
                        position: 'is-bottom',
                        type: 'is-danger'
                    })
                    throw reason;
                })
        },
        async fetchUser({ commit, state }, id) {
            const user = state.users.find(user => user._id === id)
            if (!user) {
                await axios.get(`${state.url}${id}`).then(resolve => {
                    console.log(resolve.data);
                    commit('setUser', resolve.data)
                })
                    .catch(reason => {
                        Toast.open({
                            message: `Error fetching data: ${reason}`,
                            position: 'is-bottom',
                            type: 'is-danger'
                        })
                        throw reason;
                    })
            }
        },
        /* async addCategory({ commit }, category) {
            //rounding the color
            category.color = Math.round(category.color);
            await ipc.callMain('addCategory', category)
                .then(resolve => {
                    Toast.open({
                        message: `Category ${resolve.name} added!`,
                        position: 'is-bottom'
                    })
                    commit('newCategory', resolve)
                })
                .catch(reason => {
                    throw reason;
                })
        },
        async updateCategory({ commit }, category) {
            category.color = Math.round(category.color);
            await ipc.callMain('updateCategory', category)
                .then(resolve => {
                    Toast.open({
                        message: `Category ${resolve.name} updated!`,
                        position: 'is-bottom'
                    })
                    commit('updateCategory', resolve)
                })
                .catch(reason => {
                    throw reason;
                })
        },
        async removeCategory({ commit }, category) {
            await ipc.callMain('removeCategory', category)
                .then(() => {
                    Toast.open({
                        message: `Category ${category.name} removed!`,
                        type: 'is-danger',
                        position: 'is-bottom'
                    })
                    commit('removeCategory', category._id)
                })
                .catch(reason => {
                    throw reason;
                })
        } */
    },
    getters: {
        getUsers(state) {
            return state.users
        },
        getUser: (state) => (id) => {
            // const data = state.users.find(user => user._id === id)
            const data = state.users.find(user => user._id === id)
            if (data) {
                return data
            } else {
                if (state.user) return state.user
            }
        }
    }
}
export default users