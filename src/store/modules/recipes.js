import { ToastProgrammatic as Toast } from 'buefy'
import axios from 'axios'

const recipes = {
    strict: true,
    state: {
        url: "/api/recipes/",
        recipes: [],
        recipe: {}
    },
    mutations: {
        addRecipe: (state, data) => state.recipes.push(data),
        setRecipe: (state, data) => {
            data.createdAt = new Date(data.createdAt)
            data.cookTime = new Date(data.cookTime)
            state.recipe = data
        },
        updateRecipes: (state, data) => {
            data.forEach(data => {
                data.createdAt = new Date(data.createdAt)
                data.cookTime = new Date(data.cookTime)
            })
            state.recipes = data
        },
        updateRecipe: (state, data) => {
            const i = state.recipes.findIndex(recipe => recipe._id === data._id)
            if (i !== -1) state.recipes.splice(i, 1, data)
        },
        deleteRecipe: (state, id) => (state.recipes = state.recipes.filter(recipe => recipe._id !== id))
    },
    actions: {
        async fetchFindRecipes({ commit, state }, query) {
            await axios.get(`${state.url}find/${query}`).then(resolve => {
                if (resolve.data !== undefined) {
                    commit('updateRecipes', resolve.data)
                } else {
                    Toast.open({
                        message: `Nothing found`,
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
        async fetchRecipes({ commit, state }) {
            await axios.get(state.url).then(resolve => {
                commit('updateRecipes', resolve.data)
            })
                .catch(reason => {
                    Toast.open({
                        message: `Error fetching data: ${reason}`,
                        type: 'is-danger'
                    })
                    throw reason;
                })
        },
        async fetchRecipe({ commit, state }, id) {
            const recipe = state.recipes.find(recipe => recipe._id === id)
            if (!recipe) {
                await axios.get(`${state.url}${id}`).then(resolve => {
                    commit('setRecipe', resolve.data)
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
        async addRecipe({ dispatch, commit, state, rootGetters }, data) {
            data.author = rootGetters.getLoggedIn._id

            await axios.post(`${state.url}`, data, { headers: { Authorization: `Bearer ${localStorage.jwt}` } })
                .then(async res => {
                    const recipe = res.data
                    if (data.images.length !== 0) {
                        data._id = recipe._id
                        recipe.images = await dispatch('uploadImage', data)
                    }
                    commit('addRecipe', recipe)
                    Toast.open({
                        message: `Recipe ${recipe.name} successfully added`,
                        type: 'is-success'
                    })
                })
                .catch(reason => {
                    Toast.open({
                        message: `Error adding data: ${reason}`,
                        type: 'is-danger'
                    })
                    throw reason;
                })
        },
        async updateRecipe({ commit, state }, data) {
            await axios.patch(`${state.url}`, data, { headers: { Authorization: `Bearer ${localStorage.jwt}` } })
                .then(resolve => {
                    commit('updateRecipe', resolve.data)
                }).catch(reason => {
                    Toast.open({
                        message: `Error updating recipe: ${reason.response.data}`,
                        type: 'is-warning'
                    })
                    throw reason;
                })
        },
        async uploadImage({ state }, data) {
            const formData = new FormData()
            data.images.forEach((image) => {
                formData.append(`images`, image)
            })
            await axios.post(`${state.url}upload/${data._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.jwt}`
                }
            }).then(images => {
                return images.data
            }).catch(reason => {
                Toast.open({
                    message: `Error adding images: ${reason.resolve} you need to add them later`,
                    type: 'is-warning'
                })
                return []
            })
        },
        async deleteRecipe({ commit, state }, id) {
            await axios.delete(`${state.url}${id}`, { headers: { Authorization: `Bearer ${localStorage.jwt}` } })
                .then(res => {
                    commit('deleteRecipe', res.data._id)
                    Toast.open({
                        message: `Recipe ${res.data.name} successfuly deleted`,
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
        }
    },
    getters: {
        getRecipes(state) {
            return state.recipes
        },
        getRecipe: (state) => (id) => {
            // const data = state.recipes.find(recipe => recipe._id === id)
            const data = state.recipes.find(recipe => recipe._id === id)
            if (data) {
                return data
            } else {
                if (state.recipe) return state.recipe
            }
        },
        getUserRecipes: (state) => (id) => {
            return state.recipes.filter(recipe => recipe.author === id)
        }
    }
}
export default recipes