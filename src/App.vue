<template>
  <div id="app">
    <div class="page">
      <b-navbar wrapper-class="container" type="is-light" fixed-top>
        <template slot="brand">
          <b-navbar-item class="is-unselectable" tag="div">
            <div class="inline-flex is-vertical is-aligned-center">
              <img :src="`${publicPath}images/carrot.png`" alt="makeveg" />
              <span class="title is-bold is-5">
                <span>Make</span>
                <span class="has-text-primary">Veg</span>
              </span>
            </div>
          </b-navbar-item>
        </template>
        <template slot="start">
          <!-- <b-navbar-item class="is-unselectable" tag="div"></b-navbar-item> -->
          <b-navbar-item class="is-flex is-aligned-center" tag="router-link" to="/discover">
            <b-icon icon="compass" />

            <strong class="has-text-weight-semibold" style="padding-left:0.25rem;">&nbsp;Discover</strong>
          </b-navbar-item>
          <b-navbar-item v-if="logged" tag="router-link" :to="`/user/${sessionUser._id}`">
            <strong class="has-text-weight-medium">My Recipes</strong>
          </b-navbar-item>
        </template>

        <template slot="end">
          <b-navbar-item tag="div" v-if="logged === false">
            <div class="buttons">
              <a class="button is-primary" @click="isLoginModalActive = true">Log in</a>
              <a class="button is-light" @click="isRegisterModalActive = true">
                <strong>Sign up</strong>
              </a>
            </div>
          </b-navbar-item>
          <template v-else>
            <b-navbar-item tag="div">
              <router-link class="button is-primary" :to="`/add/recipe`">
                <b-icon custom-class="has-text-weight-light" icon="plus" />
                <span class>New recipe</span>
              </router-link>
            </b-navbar-item>

            <b-navbar-dropdown tag="div" icon="account" right>
              <template slot="label">
                <b-icon icon="account" size style="margin-right:.15rem;" />
                <span class="has-text-weight-medium">{{sessionUser.firstName}}</span>
              </template>
              <b-navbar-item tag="router-link" class :to="`/user/${sessionUser._id}/settings`">
                <b-icon icon="cogs" size="is-small" style="margin-right:.15rem;" />
                <span>Settings</span>
              </b-navbar-item>
              <b-navbar-item tag="a" class @click="logoutDialog">
                <b-icon icon="logout" size="is-small" style="margin-right:.15rem;" />
                <strong>Sign out</strong>
              </b-navbar-item>
            </b-navbar-dropdown>
          </template>
        </template>
      </b-navbar>
      <router-view @clickedSignUp="isRegisterModalActive = true" />
    </div>
    <footer class="footer">
      <div class="container">
        <div class="columns">
          <div class="column is-one-third">
            <router-link to="/about">About</router-link>
          </div>
          <div class="column is-two-thirds">
            <p
              class="has-text-right is-italic"
            >This website has been created as a school project for the subject TNPW2</p>
          </div>
        </div>
      </div>
    </footer>
    <b-modal
      :active.sync="isLoginModalActive"
      has-modal-card
      custom-class
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <LoginForm :isModal="true" />
    </b-modal>
    <b-modal
      :active.sync="isRegisterModalActive"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <RegisterForm :isModal="true" />
    </b-modal>
  </div>
</template>
<script>
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { mapGetters } from "vuex";

export default {
  props: ["isModal"],
  data() {
    return {
      isLoginModalActive: false,
      isRegisterModalActive: false,
      publicPath: process.env.BASE_URL
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn", "getLoggedIn"]),
    logged() {
      return this.isLoggedIn;
    },
    sessionUser() {
      return this.getLoggedIn;
    }
  },
  methods: {
    logoutDialog() {
      this.$buefy.dialog.confirm({
        message: "Do you really want to sign out?",
        onConfirm: async () => {
          await this.logout();
        }
      });
    },
    async logout() {
      await this.$store.dispatch("logout");
      this.$buefy.toast.open("Logged out");
      this.$router.push("/");
    }
  },
  mounted() {
    //this.$store.dispatch("initApp");
    /* this.isLoggedIn = this.$store.isLoggedIn;
    console.log(this.isLoggedIn);
    this.sessionUser = this.$store.getLoggedIn; */
  },
  components: {
    LoginForm,
    RegisterForm
  }
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
