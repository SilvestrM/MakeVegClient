<template>
  <div v-cloak>
    <!-- <div class="container"> -->
    <div
      class="hero is-info is-normal"
      :style="{'background':`url(${publicPath}images/board_food.jpg) center 62% / cover`}"
    >
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-2">{{`${user.firstName} ${user.lastName}`}}</h1>
          <span
            class="subtitle is-6 is-italic"
          >{{`Member since ${new Date(user.createdAt).toLocaleDateString('en-gb',{year: 'numeric', month: 'long', day: 'numeric' })}`}}</span>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <!-- <div class="columns is-centered">
          <div class="column">
            <figure class="image">
              <img style="width:50%" :src="`${publicPath}images/decoration_ingredients.svg`" />
            </figure>
          </div>
        </div>-->
        <div class="columns is-centered">
          <div class="column is-four-fifths-desktop is-full-tablet">
            <h2 class="subtitle is-4">
              <template v-if="me">{{`Your recipes`}}</template>
              <template v-else>{{`${user.firstName}'s recipes`}}</template>
            </h2>
            <hr />
            <b-table
              style="min-height:15rem"
              striped
              :data="recipes"
              :paginated="paginated"
              per-page="10"
              :loading="isLoading"
            >
              <template slot-scope="props">
                <b-table-column field="name" label="Recipe" sortable>
                  <router-link :to="`/recipe/${props.row._id}`">{{ props.row.name }}</router-link>
                </b-table-column>
                <b-table-column field="dietTypes" label="Diets">
                  <div class="tags">
                    <span
                      class="tag is-info"
                      v-for="(diet, i) in props.row.dietTypes.slice(0,5)"
                      :index="i"
                      :key="i"
                    >{{diet}}</span>
                  </div>
                </b-table-column>
                <b-table-column field="createdAt" label="Date added" sortable numeric>
                  <span class>{{ new Date(props.row.createdAt).toLocaleDateString() }}</span>
                </b-table-column>
                <b-table-column
                  class="is-flex is-justified-right"
                  v-if="me"
                  field="_id"
                  label="Controls"
                  numeric
                >
                  <div class="buttons row-controls">
                    <b-tooltip
                      type="is-light"
                      :delay="500"
                      position="is-bottom"
                      label="Edit recipe"
                      animated
                    >
                      <router-link
                        tag="button"
                        :to="`/recipe/${props.row._id}/update`"
                        class="button is-text"
                      >
                        <b-icon icon="pencil"></b-icon>
                      </router-link>
                    </b-tooltip>
                    <b-tooltip
                      type="is-light"
                      :delay="500"
                      position="is-bottom"
                      label="Delete recipe"
                      animated
                    >
                      <button class="button is-text" @click="deleteDialog(props.row)">
                        <b-icon icon="delete"></b-icon>
                      </button>
                    </b-tooltip>
                  </div>
                </b-table-column>
              </template>

              <template slot="empty">
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                    <p>
                      <b-icon icon="emoticon-sad" size="is-large"></b-icon>
                    </p>
                    <p>No recipes found</p>
                  </div>
                </section>
              </template>
            </b-table>
            <figure class="image">
              <img
                style="opacity: .1; top:0; right:0; margin-top:2rem"
                :src="`${publicPath}images/decoration_ingredients.svg`"
              />
            </figure>
          </div>
          <!-- <div class="column is-one-fifth-desktop is-hidden-mobile is-hidden-tablet-only">
            <figure class="image">
              <img
                style="opacity: .7; top:0; right:0; width:70%;"
                :src="`${publicPath}images/decoration_hat.svg`"
              />
            </figure>
          </div>-->
        </div>
      </div>
    </div>
    <!-- </div> -->
    <!-- <b-loading :active.sync="isLoading" :is-full-page="false"></b-loading> -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      selectedRow: null,
      isLoading: false,
      me: false,
      publicPath: process.env.BASE_URL
    };
  },
  computed: {
    ...mapGetters(["getUserRecipes", "getUser"]),
    user() {
      return this.getUser(this.$route.params.id);
    },
    recipes() {
      return this.getUserRecipes(this.user._id);
    },
    paginated() {
      return this.recipes.length < 10 ? false : true;
    }
  },
  async mounted() {
    if (
      this.$store.state.loggedIn._id !== undefined &&
      this.$store.state.loggedIn._id === this.$route.params.id
    ) {
      this.me = true;
    }
  },
  methods: {
    ...mapActions(["fetchRecipes", "fetchUser", "deleteRecipe"]),
    countAvg(arr) {
      if (arr && arr.length > 0)
        return (
          Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
        );
    },
    deleteDialog(recipe) {
      this.$buefy.dialog.prompt({
        title: "Deleting Recipe",
        message: `Are you sure you want to <b>delete ${recipe.name}</b>? This action cannot be undone. To delete this recipe please type down 'DELETE' below.`,
        confirmText: "Delete Recipe",
        inputAttrs: {
          placeholder: recipe.name
        },
        type: "is-danger",
        hasIcon: true,
        onConfirm: value => {
          if (value === "DELETE") {
            this.deleteRecipe(recipe._id);
          } else {
            this.$buefy.toast.open({
              duration: 3000,
              message: `The entered text does not match the keyword!`,
              position: "is-bottom",
              type: "is-warning"
            });
          }
        }
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      vm.isLoading = true;
      await vm.fetchUser(to.params.id);
      //TODO optimize fetch
      await vm.fetchRecipes();
      vm.isLoading = false;
    });
  },
  beforeRouteUpdate(to, from, next) {
    next(async vm => {
      vm.isLoading = true;
      await vm.fetchUser(to.params.id);
      await vm.fetchRecipes();
      vm.isLoading = false;
    });
  }
};
</script>

<style lang="scss" scoped>
.table {
  tbody {
    // border: 2px solid $border;
  }
}
.hero {
  .hero-body {
    @media (min-width: $tablet) {
      padding: 5rem 1.5rem;
    }
    //
  }
}
</style>
