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
        updateCategory: (state, data) => {
            const i = state.recipes.findIndex(category => category._id === data._id)
            if (i !== -1) state.recipes.splice(i, 1, data)
        },
        deleteRecipe: (state, id) => (state.recipes = state.recipes.filter(category => category._id !== id))
    },
    actions: {
        async fetchRecipes({ commit, state }) {
            await axios.get(state.url).then(resolve => {
                commit('updateRecipes', resolve.data)
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
        async fetchRecipe({ commit, state }, id) {
            const recipe = state.recipes.find(recipe => recipe._id === id)
            if (!recipe) {
                await axios.get(`${state.url}${id}`).then(resolve => {
                    console.log(resolve.data);
                    commit('setRecipe', resolve.data)
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
        async addRecipe({ commit, state, rootGetters }, data) {
            data.author = rootGetters.getLoggedIn._id
            await axios.post(`${state.url}`, data, { headers: { Authorization: `Bearer ${localStorage.jwt}` } })
                .then(async res => {
                    const recipe = res.data
                    if (data.images.length !== 0) {
                        const formData = new FormData()
                        data.images.forEach((image) => {
                            formData.append(`images`, image)
                        })
                        await axios.post(`${state.url}upload/${recipe._id}`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                            .then(images => {
                                console.log("processed img", images.data);
                                recipe.images = images.data
                                commit('addRecipe', recipe)
                            })
                            .catch(reason => {
                                recipe.images = []
                                commit('addRecipe', recipe)
                                Toast.open({
                                    duration: 5000,
                                    message: `Error adding images: ${reason}`,
                                    position: 'is-bottom',
                                    type: 'is-warning'
                                })
                                throw reason;
                            })
                    } else {
                        commit('addRecipe', recipe)
                    }
                })
                .catch(reason => {
                    Toast.open({
                        message: `Error adding data: ${reason}`,
                        position: 'is-bottom',
                        type: 'is-danger'
                    })
                    throw reason;
                })
        },
        /*async updateCategory({ commit }, category) {
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
        },*/
        async deleteRecipe({ commit, state }, id) {
            await axios.delete(`${state.url}${id}`, { headers: { Authorization: `Bearer ${localStorage.jwt}` } })
                .then(res => {
                    console.log(res.data);
                    commit('deleteRecipe', res.data._id)
                    Toast.open({
                        message: `Recipe ${res.data.name} successfuly deleted`,
                        position: 'is-bottom',
                        type: 'is-success'
                    })
                })
                .catch(reason => {
                    Toast.open({
                        message: `Error deleting data: ${reason}`,
                        position: 'is-bottom',
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