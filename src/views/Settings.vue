<template>
  <div>
    <div class="hero is-info">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">{{`${user.firstName} ${user.lastName}`}}</h1>
          <span
            class="subtitle is-6 is-italic"
          >{{`Member since ${new Date(user.createdAt).toLocaleDateString('en-gb',{year: 'numeric', month: 'long', day: 'numeric' })}`}}</span>
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
                  :active="$route.path === `/user/${$route.params.id}/settings/account`"
                  :to="`/user/${$route.params.id}/settings/account`"
                  icon="account-cog"
                  label="My Account"
                ></b-menu-item>
                <b-menu-item
                  :active="$route.path === `/user/${$route.params.id}/settings/favorites`"
                  tag="router-link"
                  :to="`/user/${$route.params.id}/settings/favorites`"
                  icon="heart-multiple"
                  label="Favorites"
                ></b-menu-item>
                <!-- <b-menu-item
                  tag="router-link"
                  :to="`/user/${user._id}`"
                  icon="chef-hat"
                  label="My Recipes"
                ></b-menu-item>-->
              </b-menu-list>
              <b-menu-list v-if="isAdmin" label="Admin Management">
                <b-menu-item
                  :to="`/user/${$route.params.id}/settings/manage_users`"
                  tag="router-link"
                  :active="$route.path === `/user/${$route.params.id}/settings/manage_users`"
                  icon="account-supervisor"
                  label="Users"
                ></b-menu-item>
                <b-menu-item
                  :to="`/user/${$route.params.id}/settings/manage_recipes`"
                  tag="router-link"
                  :active="$route.path === `/user/${$route.params.id}/settings/manage_recipes`"
                  icon="chef-hat"
                  label="Recipes"
                ></b-menu-item>
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
    ...mapGetters(["getUserRecipes", "getUser", "getLoggedIn"]),
    user() {
      //return this.getUser(this.$route.params.id);
      return this.getLoggedIn;
    },
    isAdmin() {
      return this.user.meta.isAdmin;
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