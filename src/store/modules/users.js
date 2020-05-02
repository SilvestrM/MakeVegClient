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
        addUser: (state, data) => {
            if (state.users.findIndex(user => user._id === data._id) !== -1) state.users.push(data)
        },
        addUsers: (state, data) => {
            data.forEach(data => {
                if (state.users.includes(data) === false) state.users.push(data)
            });
        },
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
        deleteUser: (state, id) => (state.users = state.users.filter(user => user._id !== id))
    },
    actions: {
        async fetchFindUsers({ commit, state }, query) {
            await axios.get(`${state.url}find/${query}`).then(resolve => {
                if (resolve.data !== undefined) {
                    commit('setUsers', resolve.data)
                } else {
                    Toast.open({
                        message: `No users found`,
                        type: 'is-info'
                    })
                }
            })
                .catch(reason => {
                    Toast.open({
                        message: `Error fetching data: ${reason}`,
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
                    commit('addUser', resolve.data)
                })
                    .catch(reason => {
                        Toast.open({
                            message: `Error fetching data: ${reason}`,
                            type: 'is-danger'
                        })
                        throw reason;
                    })
            }
        },
        async updateUser({ commit, state }, data) {
            await axios.patch(`${state.url}`, data, { headers: { Authorization: `Bearer ${localStorage.jwt}` } })
                .then(resolve => {
                    commit('updateUser', resolve.data)
                    Toast.open({
                        message: `User  ${resolve.data.firstName} ${resolve.data.lastName} successfully updated.`,
                        type: 'is-success'
                    })
                }).catch(reason => {
                    Toast.open({
                        message: `Error updating user: ${reason.response.data}`,
                        type: 'is-warning'
                    })
                    throw reason;
                })
        },
        async updateUserSelf({ commit, state }, data) {
            await axios.patch(`${state.url}self`, data, { headers: { Authorization: `Bearer ${localStorage.jwt}` } })
                .then(resolve => {
                    commit('updateUser', resolve.data)
                    commit('loginChange', resolve.data)
                    Toast.open({
                        message: `Your account has been successfully updated.`,
                        type: 'is-success'
                    })
                }).catch(reason => {
                    Toast.open({
                        duration: 5000,
                        message: `Error updating user: ${reason.response.data}`,
                        type: 'is-danger'
                    })
                    throw reason;
                })
        },

        async deleteUser({ commit, state, rootState }, id) {
            if (id !== rootState.loggedIn._id) {
                await axios.delete(`${state.url}${id}`, { headers: { Authorization: `Bearer ${localStorage.jwt}` } })
                    .then(res => {
                        commit('deleteUser', res.data._id)
                        Toast.open({
                            message: `User  ${res.data.firstName} ${res.data.lastName} successfuly deleted`,
                            type: 'is-info'
                        })
                    })
                    .catch(reason => {
                        Toast.open({
                            message: `Error deleting data: ${reason}`,
                            type: 'is-danger'
                        })
                        throw reason;
                    })
            } else {
                Toast.open({
                    message: `You cannot delete yourself`,
                    type: 'is-warning'
                })
            }
        }
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
            return state.users.filter(user => user.email === email).length === 0 ? false : true
        }
    }
}
export default users