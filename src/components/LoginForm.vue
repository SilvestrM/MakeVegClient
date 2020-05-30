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
        <b-field>
          <a
            @click.prevent="resetDialog()"
            class="is-italic is-size-7"
          >Have you forgotten your password?</a>
        </b-field>
        <!-- <b-field message="You are always remembered">
          <b-checkbox value="true" disabled>Remember me</b-checkbox>
        </b-field>-->
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
      email: "",
      pass: ""
    };
  },
  computed: {
    ...mapGetters(["getLoggedIn"])
  },
  methods: {
    ...mapActions(["login", "resetPassword"]),
    async formHandle() {
      if (this.pass.length > 0) {
        await this.login({ email: this.email, pass: this.pass })
          .then(() => {
            //const res = this.getLoggedIn;
            /* localStorage.removeItem("jwt");
            localStorage.setItem("jwt", res.tokens[0].token); */

            if (localStorage.getItem("jwt").length > 0) {
              if (this.$route.params.nextUrl != null) {
                this.$router.push(this.$route.params.nextUrl);
              } else {
                if (this.isModal) this.$parent.close();
                if (this.$route.path !== "/discover") {
                  this.$router.push("/discover");
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
    },
    resetDialog() {
      this.$buefy.dialog.prompt({
        title: "Password reset",
        message: `<p><strong>Forgot your password?</strong></p> <p>Type your account email below. If it matches an registered user's email, email with new password will be sent.</p>`,
        confirmText: "Send Reset Instructions",
        inputAttrs: {
          placeholder: "jon.doe@example.com",
          type: "email",
          required: true
        },
        type: "is-info",
        hasIcon: true,
        onConfirm: async value => {
          await this.resetPassword(value);
        }
      });
    }
  }
};
</script>

<style>
</style>