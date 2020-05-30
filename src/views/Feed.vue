<template>
  <div>
    <div
      class="hero is-primary"
      :style="{'background':`url(${publicPath}images/board_food.jpg) center 82% / cover`}"
      :class="{'is-medium': !isLoggedIn}"
    >
      <div class="hero-body">
        <div class="container is-flex is-aligned-center is-column">
          <h1 class="title is-1 is-family-secondary">MakeVeg</h1>
          <h2 class="subtitle is-4 is-family-secondary">Share your veggie ideas!</h2>

          <template v-if="!isLoggedIn">
            <button
              @click.prevent="signClicked"
              class="button is-medium is-rounded has-text-weight-medium"
            >
              <span class="is-size-6">Sign up and add your recipe!</span>
            </button>
            <p class="is-size-7" style="margin-top:1em">
              Already an user?
              <a @click.prevent="loginClicked">Log In</a>
            </p>
          </template>
          <!-- <button
            v-else
            @click.prevent="$router.push('/add/recipe')"
            class="button is-medium is-rounded has-text-weight-bold"
          >Add your recipe!</button>-->
        </div>
      </div>
    </div>
    <div class="section has-background-white-bis" style="padding-top:4rem">
      <div class="columns is-centered">
        <div class="column is-half">
          <b-field grouped group-multiline>
            <b-field label="Search" message="Search by recipe name or diet" expanded>
              <template slot="label">
                <div class="is-size-7">Search</div>
              </template>
              <b-input
                size="is-normal"
                placeholder="Soup, vegetarian, ..."
                expanded
                type="search"
                icon="magnify"
                rounded
                @input="search"
              ></b-input>
            </b-field>
            <b-field>
              <b-collapse v-if="isLoggedIn" :open.sync="filtersOpen">
                <b-field label="Filters" slot="trigger" slot-scope="props" rounded>
                  <template slot="label">
                    <div class="is-flex is-size-7">
                      <span>Filters</span>
                      <b-icon :icon="props.open ? 'chevron-down' : 'chevron-up'"></b-icon>
                    </div>
                  </template>
                  <b-taglist v-show="!filtersOpen">
                    <b-tag type="is-primary" v-for="(diet, i) in filters" :key="i">{{diet}}</b-tag>
                  </b-taglist>
                </b-field>
                <b-field rounded position="is-centered">
                  <b-taginput
                    type="is-primary"
                    :data="diets"
                    autocomplete
                    :allow-new="false"
                    ellipsis
                    v-model="filters"
                    open-on-focus
                    readonly
                    placeholder="..."
                  >
                    <template slot="empty">
                      <p>None found</p>
                    </template>
                    <template slot="header">
                      <div>
                        <strong>Diets</strong>
                        <hr class="is-marginless" />
                      </div>
                    </template>
                  </b-taginput>
                  <!-- <b-taglist>
                <b-tag type="is-primary" v-for="(diet, i) in filters" :key="i">{{diet}}</b-tag>
                  </b-taglist>-->
                </b-field>
                <b-field expanded>
                  <router-link
                    class="is-size-7 is-italic"
                    :to="`/user/${$store.state.loggedIn._id}/settings/account`"
                  >Update your preferences</router-link>
                </b-field>
              </b-collapse>
            </b-field>
          </b-field>
          <!-- <div v-if="isLoggedIn" style="margin-top:2rem; padding: 0 2.5rem;">
            <b-field label="Filters" rounded label-position="on-border" position="is-centered">
              <b-taginput
                type="is-primary"
                :data="diets"
                autocomplete
                :allow-new="false"
                ellipsis
                v-model="filters"
                open-on-focus
                readonly
                placeholder="..."
              >
                <template slot="empty">
                  <p>None found</p>
                </template>
                <template slot="header">
                  <div>
                    <strong>Diets</strong>
                    <hr class="is-marginless" />
                  </div>
                </template>
              </b-taginput>
            </b-field>
            <b-field expanded>
              <router-link
                class="is-size-7 is-italic"
                :to="`/user/${$store.state.loggedIn._id}/settings/account`"
              >Update your preferences</router-link>
            </b-field>
          </div>-->
        </div>
      </div>
      <!-- <div class="columns is-centered">
        <div class="column is-two-fifths">
          <b-collapse v-if="isLoggedIn" :open.sync="filtersOpen">
            <b-field label="Filters" slot="trigger" slot-scope="props" rounded>
              <template slot="label">
                <div class="is-flex">
                  <span>Filters</span>
                  <b-icon :icon="props.open ? 'chevron-down' : 'chevron-up'"></b-icon>
                </div>
              </template>
              <b-taglist v-show="!filtersOpen">
                <b-tag type="is-primary" v-for="(diet, i) in filters" :key="i">{{diet}}</b-tag>
              </b-taglist>
            </b-field>
            <b-field rounded position="is-centered">

              <b-taginput
                type="is-primary"
                :data="diets"
                autocomplete
                :allow-new="false"
                ellipsis
                v-model="filters"
                open-on-focus
                readonly
                placeholder="..."
              >
                <template slot="empty">
                  <p>None found</p>
                </template>
                <template slot="header">
                  <div>
                    <strong>Diets</strong>
                    <hr class="is-marginless" />
                  </div>
                </template>
              </b-taginput>
  
            </b-field>
            <b-field expanded>
              <router-link
                class="is-size-7 is-italic"
                :to="`/user/${$store.state.loggedIn._id}/settings/account`"
              >Update your preferences</router-link>
            </b-field>
          </b-collapse>
        </div>
      </div>-->
    </div>
    <hr class="is-marginless" />
    <div class="section">
      <div class="container">
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
// import Recipe from "../components/Recipe";

export default {
  name: "Discover",
  data() {
    return {
      publicPath: process.env.BASE_URL,
      isLoading: false,
      filtersOpen: false,
      filters: []
    };
  },
  computed: {
    ...mapGetters(["getRecipes", "getLoggedIn"]),
    recipes() {
      return this.getRecipes.filter(recipe => {
        if (recipe.dietTypes.length == 0) return true;
        if (this.filters.length == 0) return true;

        return recipe.dietTypes.some(diet => {
          return this.filters.includes(diet);
        });
      });
    },
    diets() {
      return this.$store.getters.getDiets.filter(diet => {
        return !this.filters.includes(diet);
      });
    },
    // filters: {
    //   get() {
    //     return this.filters;
    //   },
    //   set(array) {
    //     console.log(array);
    //     this.filters = array;
    //   }
    // },
    isLoggedIn() {
      return (
        this.$store.state.loggedIn !== null &&
        this.$store.state.loggedIn !== undefined
      );
    }
  },
  watch: {
    isLoggedIn() {
      this.filters =
        this.getLoggedIn !== null ? this.getLoggedIn.settings.diets : [];
    }
  },
  mounted() {
    this.filters =
      this.getLoggedIn !== null ? this.getLoggedIn.settings.diets : [];
  },
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
    },
    signClicked() {
      this.$emit("clickedSignUp");
    },
    loginClicked() {
      this.$emit("clickedLogin");
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
    Recipe: () => import("../components/Recipe")
  }
};
</script>
