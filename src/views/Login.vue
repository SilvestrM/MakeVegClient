<template>
  <div class="section">
    <div class="container">
      <div class="section">
        <div class="columns is-centered">
          <div class="column is-narrow">
            <LoginForm :isModal="false" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm";

export default {
  components: {
    LoginForm
  }
};
</script>

<style>
</style>