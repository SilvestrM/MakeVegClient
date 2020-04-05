<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div v-for="recipe in recipes" :key="recipe._id">
      <div class="block">{{recipe.name}}</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Home",
  data() {
    return {};
  },
  computed: {
    ...mapGetters({ recipes: "getRecipes" })
  },
  mounted() {
    console.log(this.recipes);
  },
  methods: {
    ...mapActions(["fetchRecipes"])
  },
  async created() {
    await this.fetchRecipes();
  },
  components: {}
};
</script>
