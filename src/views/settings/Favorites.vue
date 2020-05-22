<template>
  <div class>
    <h3 class="title is-4">Your saved recipes</h3>
    <hr />
    <div style="padding-top:.5rem;" class="section">
      <b-table
        ref="table"
        :data="likedRecipes"
        :paginated="likedRecipes.length > 10"
        per-page="10"
        :loading="isLoading"
      >
        <template slot-scope="props">
          <b-table-column sortable field="name" label="Name">
            <router-link :to="`/recipe/${props.row._id}`">{{ props.row.name }}</router-link>
          </b-table-column>
          <b-table-column v-if="true" field="_id" label="Controls" numeric>
            <div class="buttons is-pulled-right">
              <b-tooltip
                type="is-light"
                :delay="500"
                position="is-bottom"
                label="Remove from favorites"
                animated
              >
                <button class="button is-text" @click="deleteDialog(props.row)">
                  <b-icon icon="heart-broken"></b-icon>
                </button>
              </b-tooltip>
            </div>
          </b-table-column>
        </template>

        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon icon="alert-circle" size="is-large"></b-icon>
              </p>
              <p>Nothing found</p>
            </div>
          </section>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["user"],
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    ...mapGetters(["getRecipes"]),
    likedRecipes() {
      return this.getRecipes.filter(recipe =>
        this.$store.state.loggedIn.favorites.includes(recipe._id)
      );
    }
  },
  methods: {
    ...mapActions(["fetchRecipes", "updateFavorites"]),
    deleteDialog(recipe) {
      this.$buefy.dialog.confirm({
        title: "Removing favorite",
        message: `Do you want to remove ${recipe.name} from favorites?`,
        confirmText: "Delete Recipe",
        type: "is-warning",
        hasIcon: true,
        onConfirm: async () => {
          await this.updateFavorites(recipe._id);
        }
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      vm.isLoading = true;
      await vm.fetchRecipes();
      //   await vm.fetchRecipesByIds(vm.$store.state.loggedIn.favorites);
      vm.isLoading = false;
    });
  }
};
</script>

<style>
</style>