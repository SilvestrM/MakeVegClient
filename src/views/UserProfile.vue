<template>
  <div class>
    <!-- <div class="container"> -->
    <div class="hero is-info is-medium">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">{{`${user.firstName} ${user.lastName}`}}</h1>
          <span
            class="subtitle is-6 is-italic"
          >{{`member since: ${new Date(user.createdAt).toLocaleDateString()}`}}{{me}}</span>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <h2 class="subtitle is-4">
          <template v-if="me">{{`Your recipes`}}</template>
          <template v-else>{{`${user.firstName}'s recipes`}}</template>
        </h2>
        <hr />
        <b-table :data="recipes" :loading="isLoading">
          <template slot-scope="props">
            <b-table-column field="name" label="Recipe">
              <router-link :to="`/recipe/${props.row._id}`">{{ props.row.name }}</router-link>
            </b-table-column>
            <b-table-column field="dietTypes" label="Diets">
              <div class="tags">
                <span
                  class="tag"
                  v-for="(diet, i) in props.row.dietTypes.slice(0,5)"
                  :index="i"
                  :key="i"
                >{{diet}}</span>
              </div>
            </b-table-column>
            <b-table-column
              field="ratings"
              label="Rating"
              centered
            >{{ countAvg(props.row.ratings) }}</b-table-column>
            <b-table-column field="date" label="Date added" numeric>
              <span class="tag is-info">{{ props.row.createdAt.toLocaleDateString() }}</span>
            </b-table-column>
            <b-table-column v-if="me" field="_id" label="Controls" numeric>
              <button class="button is-text">
                <b-icon icon="pencil"></b-icon>
              </button>
              <button class="button is-text" @click="deleteDialog(props.row)">
                <b-icon icon="delete"></b-icon>
              </button>
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
      isLoading: false,
      me: false
    };
  },
  computed: {
    ...mapGetters(["getUserRecipes", "getUser"]),
    user() {
      return this.getUser(this.$route.params.id);
    },
    recipes() {
      return this.getUserRecipes(this.user._id);
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
        message: `Are you sure you want to <b>delete</b> ${recipe.name}? This action cannot be undone. To delete this recipe please type down its name below.`,
        confirmText: "Delete Recipe",
        inputAttrs: {
          placeholder: recipe.name
        },
        type: "is-danger",
        hasIcon: true,
        onConfirm: value => {
          if (value === recipe.name) {
            this.deleteRecipe(recipe._id);
          } else {
            this.$buefy.toast.open({
              duration: 3000,
              message: `The entered name does not match the recipe's name`,
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
      /* if (
        vm.$store.state.loggedIn._id !== undefined &&
        vm.$store.state.loggedIn._id === to.params.id
      ) {
        vm.me = true;
      } */
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

<style>
</style>