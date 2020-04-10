<template>
  <div>
    <div class="hero is-info">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">{{`${user.firstName} ${user.lastName}`}}</h1>
          <span
            class="subtitle is-6 is-italic"
          >{{`member since: ${new Date(user.createdAt).toLocaleDateString()}`}}</span>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-one-fifth">
            <b-menu>
              <b-menu-list icon="cogs" label="Settings">
                <b-menu-item
                  tag="router-link"
                  :active="$route.path === `/user/${$route.params.id}/account`"
                  :to="`/user/${$route.params.id}/account`"
                  icon="account-cog"
                  label="My Account"
                ></b-menu-item>
                <b-menu-item
                  tag="router-link"
                  to="/"
                  icon="card-bulleted-settings"
                  label="Preferences"
                ></b-menu-item>
                <b-menu-item
                  tag="router-link"
                  :to="`/user/${user._id}/recipes`"
                  icon="chef-hat"
                  label="My Recipes"
                ></b-menu-item>
              </b-menu-list>
              <b-menu-list label="Admin Management">
                <b-menu-item icon="account" label="Users"></b-menu-item>
                <b-menu-item icon="chef-hat" label="Recipes"></b-menu-item>
              </b-menu-list>
            </b-menu>
          </div>
          <div class="column">
            <router-view :user="user"></router-view>
          </div>
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
  mounted() {
    console.log(this.$route.params);
  },
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