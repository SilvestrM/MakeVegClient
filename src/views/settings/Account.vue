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
        <b-field horizontal expanded label="Old password">
          <b-input
            :required="pass.length > 0"
            v-model="oldPass"
            type="password"
            password-reveal
            placeholder="Your old password"
          ></b-input>
        </b-field>
        <b-field expanded horizontal label="New password">
          <b-input
            expanded
            v-model="pass"
            type="password"
            password-reveal
            placeholder="Your new password"
          ></b-input>
          <b-input
            expanded
            v-model="repass"
            type="password"
            :required="pass.length > 0"
            password-reveal
            placeholder="Your new password again"
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
      oldPass: "",
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
    diets() {
      return this.$store.getters.getDiets;
    }
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
      this.oldpass = "";
    },
    async formHandle() {
      // if password is to be changed
      if (this.pass.length > 0) {
        if (this.pass === this.repass) {
          this.newUser.newPass = this.pass;
          this.newUser.oldPass = this.oldPass;
        } else {
          this.$buefy.toast.open({
            duration: 5000,
            message: `Passwords do not match`,
            position: "is-top",
            type: "is-danger"
          });
          return;
        }
      }
      await this.fetchFindUsers(this.newUser.email).then(async () => {
        if (
          this.isDuplicateMail(this.newUser.email) === false ||
          this.newUser.email === this.user.email
        ) {
          this.newUser._id = this.user._id;
          await this.updateUserSelf(this.newUser).then(() => {
            this.$router.push(`/user/${this.user._id}`);
          });
        } else {
          this.$buefy.toast.open({
            duration: 5000,
            message: `An user with this email already exists`,
            position: "is-top",
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