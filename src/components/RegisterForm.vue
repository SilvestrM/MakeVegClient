<template>
  <form action="post" @submit.prevent="formHandle">
    <div class="modal-card" style="max-width:40rem;">
      <header class="modal-card-head">
        <p class="modal-card-title">Register</p>
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column is-half">
            <b-field label="First name">
              <b-input
                v-model="newUser.firstName"
                type="text"
                placeholder="Your first name"
                required
              ></b-input>
            </b-field>
          </div>
          <div class="column is-half">
            <b-field label="Last name">
              <b-input v-model="newUser.lastName" type="text" placeholder="Your last name" required></b-input>
            </b-field>
          </div>
        </div>
        <b-field label="Email">
          <b-input v-model="newUser.email" type="email" placeholder="Your email" required></b-input>
        </b-field>

        <b-field label="Password">
          <b-input
            v-model="pass"
            type="password"
            password-reveal
            placeholder="Your password"
            required
          ></b-input>
        </b-field>
        <b-field label="Repeat Password">
          <b-input
            v-model="repass"
            type="password"
            password-reveal
            placeholder="Your password again"
            required
          ></b-input>
        </b-field>
        <b-field label="Select your dietary preferences">
          <b-taginput
            v-model="newUser.diets"
            :data="diets"
            autocomplete
            :allow-new="false"
            open-on-focus
            icon="label"
            placeholder="Add a diet"
            @typing="getDiets"
          ></b-taginput>
        </b-field>
        <div class="content">
          <p
            class="is-italic has-text-grey-light is-size-7"
          >By registering you aggree with our Terms of Service and Privacy Policy</p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons is-pulled-right">
          <button class="button" type="button" @click="$parent.close()" v-if="isModal">Close</button>
          <button class="button is-primary" type="submit">Register</button>
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
      pass: "",
      repass: "",
      newUser: {
        firstName: "",
        lastName: "",
        email: "",
        pass: "",
        diets: []
      }
    };
  },
  computed: {
    ...mapGetters(["getLoggedIn", "isDuplicateMail"]),
    diets() {
      return this.$store.getters.getDiets;
    }
  },
  methods: {
    ...mapActions(["register", "fetchFindUsers"]),
    async formHandle() {
      if (this.pass.length > 0) {
        if (this.pass === this.repass) {
          this.newUser.pass = this.pass;
          await this.fetchFindUsers(this.newUser.email).then(async () => {
            if (this.isDuplicateMail(this.newUser.email) === false) {
              await this.register(this.newUser)
                .then(() => {
                  if (this.isModal) this.$parent.close();
                  if (this.$route.fullPath !== "/discover") {
                    this.$router.push("/discover");
                  }
                })
                .catch();
            } else {
              this.$buefy.toast.open({
                duration: 5000,
                message: `An user with this email already exists`,
                position: "is-bottom",
                type: "is-warning"
              });
            }
          });
        } else {
          this.$buefy.toast.open({
            duration: 5000,
            message: `Passwords do not match`,
            position: "is-bottom",
            type: "is-warning"
          });
        }
      } else {
        this.$buefy.toast.open({
          duration: 5000,
          message: `Please enter a valid password`,
          position: "is-bottom",
          type: "is-warning"
        });
      }
    },
    getDiets(text) {
      return this.diets.filter(
        diet =>
          diet
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
      );
    }
  }
};
</script>

<style lang="scss" scoped>
$dropdown-content-z: 50;
</style>
