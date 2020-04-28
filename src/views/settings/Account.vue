<template>
  <div class>
    <h3 class="title is-4">My Account</h3>
    <hr />
    <div class="section">
      <form action="post" @submit.prevent="formHandle">
        <b-field horizontal expanded is-grouped label="Name">
          <b-input v-model="newUser.firstName" type="text" placeholder="Your first name"></b-input>
          <b-input v-model="newUser.lastName" type="text" placeholder="Your last name"></b-input>
        </b-field>
        <hr />
        <b-field horizontal expanded label="Email">
          <b-input v-model="newUser.email" type="email" placeholder="Your email"></b-input>
        </b-field>
        <hr />
        <b-field horizontal expanded label="New password">
          <b-input
            v-model="pass"
            type="password"
            password-reveal
            placeholder="Your password"
            disabled
          ></b-input>
        </b-field>
        <b-field horizontal expanded label="Repeat Password">
          <b-input
            v-model="repass"
            type="password"
            password-reveal
            placeholder="Your password again"
            disabled
          ></b-input>
        </b-field>
        <hr />
        <b-field>
          <b-taglist>
            <b-tag v-for="(diet, i) in user.diets" :key="i">{{diet}}</b-tag>
          </b-taglist>
        </b-field>
        <b-field horizontal :label-position="'on-border'" expanded label="Dietary preferences">
          <b-taginput
            v-model="newUser.settings.diets"
            :data="diets"
            autocomplete
            :allow-new="false"
            open-on-focus
            icon="label"
            placeholder="Add a diet"
            @typing="getDiets"
          ></b-taginput>
        </b-field>
        <div class="buttons is-centered">
          <button class="button is-primary" type="submit">Update</button>
          <button class="button" @click="reset" type="button">Reset</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["user"],
  data() {
    return {
      pass: "",
      repass: "",
      newUser: {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        pass: "",
        settings: {
          diets: this.user.settings.diets
        }
      }
    };
  },
  computed: {
    ...mapGetters(["getLoggedIn", "isDuplicateMail"]),
    // newUser: {
    //   get() {
    //     return this.user;
    //   },
    //   set(values) {
    //     console.log(values);
    //   }
    // },
    diets() {
      return this.$store.getters.getDiets;
    }
  },
  mounted() {
    console.log(this.user);
  },
  methods: {
    ...mapActions(["updateUserSelf", "fetchFindUsers"]),
    reset() {
      this.newUser.firstName = this.user.firstName;
      this.newUser.lastName = this.user.lastName;
      this.newUser.email = this.user.email;
      this.newUser.settings.diets = this.user.settings.diets;
      this.pass = "";
      this.repass = "";
    },
    async formHandle() {
      // TODO pass logic
      await this.fetchFindUsers(this.newUser.email).then(async () => {
        if (
          this.isDuplicateMail(this.newUser.email) === false ||
          this.newUser.email === this.user.email
        ) {
          this.newUser._id = this.user._id;
          await this.updateUserSelf(this.newUser)
            .then(() => {
              // if (this.$route.fullPath !== `/user/${this.$route.params}/account`) {
              //   this.$router.push("/discover");
              // }
              this.$router.push(`/user/${this.user._id}`);
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

<style>
</style>