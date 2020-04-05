<template>
  <div class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-full">
          <div class="columns is-tablet is-multiline is-2">
            <div
              class="column is-full-mobile is-half-tablet is-half-desktop is-one-third-widescreen is-one-third-fullhd"
              v-for="recipe in recipes"
              :key="recipe._id"
            >
              <router-link :to="`/recipe/${recipe._id}`">
                <Recipe :recipe="recipe" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-loading :active.sync="isLoading" :is-full-page="false"></b-loading>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Recipe from "../components/Recipe";

export default {
  name: "Discover",
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    ...mapGetters({ recipes: "getRecipes" })
  },
  mounted() {},
  methods: {
    ...mapActions(["fetchRecipes"]),
    countAvg(arr) {
      if (arr && arr !== [])
        return (
          Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) / 100
        );
      // return arr.reduce((a, b) => a + b, 0) / arr.length;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      vm.isLoading = true;
      await vm.fetchRecipes();
      vm.isLoading = false;
    });
  },
  beforeRouteUpdate(to, from, next) {
    next(async vm => {
      vm.isLoading = true;
      await vm.fetchRecipes();
      vm.isLoading = false;
    });
  },
  async created() {
    /* await this.fetchRecipes();
    this.isLoading = false; */
    // await this.fetchRecipes();
  },
  components: {
    Recipe
  }
};
</script>
