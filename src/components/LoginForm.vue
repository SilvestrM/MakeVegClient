<template>
  <form action="post" @submit.prevent="formHandle">
    <div class="modal-card" style="max-width:25rem;">
      <header class="modal-card-head">
        <p class="modal-card-title">Login</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Email">
          <b-input v-model="email" type="email" placeholder="Your email" required></b-input>
        </b-field>

        <b-field label="Password">
          <b-input
            v-model="pass"
            type="password"
            :value="pass"
            password-reveal
            placeholder="Your password"
            required
          ></b-input>
        </b-field>

        <b-checkbox>Remember me</b-checkbox>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons is-pulled-right">
          <button class="button" type="button" @click="$parent.close()" v-if="isModal">Close</button>
          <button class="button is-primary" type="submit">Login</button>
        </div>
      </footer>
    </div>
  </form>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["isModal"],
  data() {
    return {
      email: "idk@mail.com",
      pass: "1234"
    };
  },
  computed: {
    ...mapGetters(["getLoggedIn"])
  },
  methods: {
    ...mapActions(["login"]),
    async formHandle() {
      if (this.pass.length > 0) {
        await this.login({ email: this.email, pass: this.pass })
          .then(() => {
            const res = this.getLoggedIn;
            localStorage.removeItem("jwt");
            localStorage.setItem("jwt", res.tokens[0].token);

            console.log(this.$route.params.nextUrl);

            if (localStorage.getItem("jwt").length > 0) {
              if (this.$route.params.nextUrl != null) {
                this.$router.push(this.$route.params.nextUrl);
              } else {
                if (this.isModal) {
                  this.$parent.close();
                } else {
                  this.$router.push("/");
                }
              }
            }
          })
          .catch();
      } else {
        this.$buefy.toast.open({
          duration: 5000,
          message: `Please enter valid password`,
          position: "is-bottom",
          type: "is-warning"
        });
      }
    }
  }
};
</script>

<style>
</style>