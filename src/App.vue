<template>
  <div id="app">
    <div class="page">
      <b-navbar wrapper-class="container" type="is-light" shadow fixed-top>
        <template slot="brand">
          <b-navbar-item class="is-unselectable" tag="div">
            <div class="inline-flex is-vertical">
              <img src="./assets/carrot.png" alt="makeveg" />
              <span class="title is-bold is-5">
                <span>Make</span>
                <span class="has-text-primary">Veg</span>
              </span>
            </div>
          </b-navbar-item>
        </template>
        <template slot="start">
          <b-navbar-item tag="router-link" to="/discover">
            <b-icon icon="compass" />
            <strong class="has-text-weight-semibold" style="padding-left:0.25em;">&nbsp;Discover</strong>
          </b-navbar-item>
          <b-navbar-item href="#">
            <strong class="has-text-weight-medium">My Recipes</strong>
          </b-navbar-item>
        </template>

        <template slot="end">
          <b-navbar-item tag="div">
            <div class="buttons">
              <a class="button is-primary" @click="isLoginModalActive = true">Log in</a>
              <a class="button is-light">
                <strong>Sign up</strong>
              </a>
            </div>
          </b-navbar-item>
        </template>
      </b-navbar>
      <router-view />
    </div>
    <footer class="footer">
      <div class="container">
        <div class="columns">
          <div class="column is-one-third">
            <router-link to="about">About</router-link>
          </div>
          <div class="column is-two-thirds">
            <p
              class="has-text-right"
            >This website has been created as a school project for a subject TNPW2</p>
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
      <LoginForm v-bind="loginData" />
    </b-modal>
  </div>
</template>
<script>
import LoginForm from "./components/LoginForm";

export default {
  data() {
    return {
      isLoginModalActive: false,
      loginData: {
        email: "",
        pass: ""
      }
    };
  },
  components: {
    LoginForm
  }
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
