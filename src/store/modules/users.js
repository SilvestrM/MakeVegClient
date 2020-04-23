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
        updateUser: (state, data) => {
            const i = state.users.findIndex(user => user._id === data._id)
            if (i !== -1) state.users.splice(i, 1, data)
        },
        removeCategory: (state, id) => (state.users = state.users.filter(category => category._id !== id))
    },
    actions: {
        async fetchFindUsers({ commit, state }, query) {
            await axios.get(`${state.url}find/${query}`).then(resolve => {
                if (resolve.data !== undefined) {
                    commit('setUsers', resolve.data)
                } else {
                    Toast.open({
                        message: `No users found`,
                        position: 'is-bottom',
                        type: 'is-info'
                    })
                }
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
        async updateUser({ commit, state, rootState }, data) {
            await axios.patch(`${state.url}${rootState.loggedIn._id}`, data, { headers: { Authorization: `Bearer ${localStorage.jwt}` } })
                .then(resolve => {
                    console.log(resolve.data);
                    commit('updateUser', resolve.data)
                }).catch(reason => {
                    Toast.open({
                        message: `Error updating user: ${reason}`,
                        position: 'is-bottom',
                        type: 'is-danger'
                    })
                    throw reason;
                })
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
        },
        isDuplicateMail: (state) => (email) => {
            console.log(state.users.filter(user => user.email === email));
            return state.users.filter(user => user.email === email).length === 0 ? false : true
        }
    }
}
export default users