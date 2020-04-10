
const diets = {
    strict: true,
    state: {
        diets: [
            { _id: 1, name: "Lactose Free", color: "" },
            { _id: 2, name: "Vegan", color: "" },
            { _id: 3, name: "Vegetarian", color: "" },
            { _id: 4, name: "No Eggs", color: "" },
            { _id: 5, name: "No Diary", color: "" },
            { _id: 6, name: "Includes Soy", color: "" },
            { _id: 7, name: "Gluten Free", color: "" },
            { _id: 8, name: "Fish or Seafood", color: "" },
        ],
    },
    getters: {
        getDietColor: (state) => (name) => {
            return state.diets.find(diet => diet.name.toLowerCase() === name.toLowerCase()).length !== 0 ? state.diets.find(diet => diet.name === name).color : ""
        },
        getDietId: (state) => (name) => {
            return state.diets.find(diet => diet.name.toLowerCase() === name.toLowerCase()).length !== 0 ? state.diets.find(diet => diet.name === name).id : ""
        },
        getDiets(state) {
            return state.diets.map(diet => diet.name)
        }
    }
}
export default diets