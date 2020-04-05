<template>
  <form action>
    <div class="modal-card" style="max-width:25rem;">
      <header class="modal-card-head">
        <p class="modal-card-title">Login</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Email">
          <b-input type="email" :value="email" placeholder="Your email" required></b-input>
        </b-field>

        <b-field label="Password">
          <b-input
            type="password"
            :value="password"
            password-reveal
            placeholder="Your password"
            required
          ></b-input>
        </b-field>

        <b-checkbox>Remember me</b-checkbox>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons is-pulled-right">
          <button class="button" type="button" @click="$parent.close()">Close</button>
          <button class="button is-primary">Login</button>
        </div>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: ["email", "pass"]
};
</script>

<style>
</style>