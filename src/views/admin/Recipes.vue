<template>
  <div class>
    <h3 class="title is-4">Recipe management</h3>
    <hr />
    <div class="section">
      <b-field label="Search" message="Search by recipe's name or diets">
        <b-input type="search" icon="magnify" @input="search"></b-input>
      </b-field>
      <b-table
        detailed
        detail-key="_id"
        ref="table"
        :data="recipes"
        paginated
        per-page="10"
        :loading="isLoading"
      >
        <template slot-scope="props">
          <b-table-column field="name" label="Name">
            <button class="button is-text" @click="toggle(props.row)">{{`${props.row.name}`}}</button>
          </b-table-column>
          <!-- <b-table-column field="email" label="Email">
            <span class>{{ props.row.email }}</span>
          </b-table-column>-->
          <b-table-column v-if="true" field="_id" label="Controls" numeric>
            <!-- <button class="button is-text" @click="toggle(props.row)">
              <b-icon icon="pencil"></b-icon>
            </button>-->
            <b-tooltip
              type="is-light"
              :delay="500"
              position="is-bottom"
              label="Recipe profile"
              animated
            >
              <router-link class="button is-text" :to="`/recipe/${props.row._id}`">
                <b-icon icon="book-open"></b-icon>
              </router-link>
            </b-tooltip>
            <b-tooltip type="is-light" :delay="500" position="is-bottom" label="Delete" animated>
              <button class="button is-text" @click="deleteDialog(props.row)">
                <b-icon icon="delete"></b-icon>
              </button>
            </b-tooltip>
          </b-table-column>
        </template>

        <template slot="detail" slot-scope="props">
          <div class>
            <UpdateUserRow :user="props.row" />
          </div>
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
import UpdateUserRow from "../../components/UpdateUserRow";
export default {
  components: { UpdateUserRow },
  data() {
    return {
      query: "",
      isLoading: false
    };
  },
  computed: {
    ...mapGetters(["getRecipes", "getUser"]),
    recipes() {
      return this.getRecipes.filter(
        recipe => recipe.author !== this.$store.state.loggedIn._id
      );
    }
  },
  async mounted() {},
  methods: {
    ...mapActions(["fetchFindRecipes", "fetchUser", "deleteRecipe"]),
    async search(query) {
      if (query.length >= 1) {
        this.isLoading = true;
        await this.fetchFindRecipes(query).then(() => {
          // this.recipes.forEach(async recipe => {
          //   await this.fetchUser(recipe.author)
          // });
        });
        this.isLoading = false;
      }
    },
    toggle(row) {
      this.$refs.table.toggleDetails(row);
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
  }
};
</script>

<style>
</style>