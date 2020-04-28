<template>
  <div class="section">
    <div class="container">
      <div class="section">
        <div class="columns is-centered">
          <div class="column is-half">
            <b-field
              label="Search"
              label-position="on-border"
              message="Search by recipe name or diet"
              expanded
            >
              <b-input
                size="is-medium"
                placeholder="Soup, vegetarian, ..."
                expanded
                type="search"
                icon="magnify"
                rounded
                @input="search"
              ></b-input>
            </b-field>
            <!-- <b-field horizontal label="Your preferences" label-position="on-border" expanded>
              <b-taglist>
                <b-tag closable v-for="(diet, i) in filters" :key="i">{{diet}}</b-tag>
              </b-taglist>
            </b-field>-->
          </div>
        </div>
      </div>
      <hr class="is-marginless" />
      <div class="section">
        <div class="columns" style="min-height: 60vh">
          <div class="column is-full">
            <div class="columns is-tablet is-multiline is-2">
              <div
                class="column recipe-card is-full-mobile is-half-tablet is-half-desktop is-one-third-widescreen is-one-third-fullhd"
                v-for="recipe in recipes"
                :key="recipe._id"
              >
                <router-link :to="`/recipe/${recipe._id}`">
                  <Recipe :recipe="recipe" />
                </router-link>
              </div>
              <b-loading can-cancel :active.sync="isLoading"></b-loading>
              <!-- <b-skeleton :active="isLoading" height="20rem"></b-skeleton> -->
            </div>
            <b-message v-if="recipes.length === 0 && !isLoading">No results</b-message>
          </div>
        </div>
      </div>
    </div>
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
    ...mapGetters(["getRecipes", "getLoggedIn"]),
    recipes() {
      return this.getRecipes;
    },
    filters() {
      return this.getLoggedIn.settings.diets;
    }
  },
  mounted() {},
  methods: {
    ...mapActions(["fetchRecipes", "fetchFindRecipes"]),
    async search(query) {
      if (query.length >= 1) {
        this.isLoading = true;
        await this.fetchFindRecipes(query);
        this.isLoading = false;
      } else if (query.length === 0) {
        this.isLoading = true;
        await this.fetchRecipes(query);
        this.isLoading = false;
      }
    },
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
