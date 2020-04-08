<template>
  <div class="section">
    <div class="container">
      <div class="section">
        <div class="columns is-centered">
          <div class="column is-narrow">{{user.firstName}}</div>
        </div>
      </div>
    </div>
    <b-loading :active.sync="isLoading" :is-full-page="false"></b-loading>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    ...mapGetters(["getUserRecipes", "getUser"]),
    user() {
      return this.getUser(this.$route.params.id);
    }
  },
  mounted() {},
  methods: {
    ...mapActions(["fetchRecipes", "fetchUser"]),
    countAvg(arr) {
      if (arr && arr.length > 0)
        return (
          Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
        );
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      vm.isLoading = true;
      await vm.fetchUser(to.params.id);
      vm.isLoading = false;
    });
  }
};
</script>

<style>
</style>