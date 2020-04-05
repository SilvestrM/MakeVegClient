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
            data.dateAdded = new Date(data.dateAdded)
            state.recipe = data
        },
        updateRecipes: (state, data) => {
            data.forEach(data => {
                data.dateAdded = new Date(data.dateAdded)
            })
            state.recipes = data
        },
        updateCategory: (state, data) => {
            const i = state.recipes.findIndex(category => category._id === data._id)
            if (i !== -1) state.recipes.splice(i, 1, data)
        },
        removeCategory: (state, id) => (state.recipes = state.recipes.filter(category => category._id !== id))
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