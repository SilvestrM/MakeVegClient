<template>
  <form action="post" @submit.prevent="formHandle(updatedUser)">
    <b-field horizontal expanded is-grouped label="Name">
      <b-input :placeholder="user.firstName" v-model="updatedUser.firstName" type="text"></b-input>
      <b-input :placeholder="user.lastName" v-model="updatedUser.lastName" type="text"></b-input>
      <button class="button is-primary" type="submit">Update</button>
    </b-field>
    <hr />

    <b-field horizontal expanded label="Email:">{{user.email}}</b-field>
    <b-field horizontal expanded label="Diets:">
      <div v-if="user.settings.diets.length > 0" class="tags">
        <span
          class="tag"
          v-for="(diet, i) in user.settings.diets.slice(0,5)"
          :index="i"
          :key="i"
        >{{diet}}</span>
      </div>
      <div v-else class>
        <span class="is-italic has-text-grey">None provided</span>
      </div>
    </b-field>
    <b-field horizontal expanded label="Created:">{{new Date(user.createdAt).toLocaleDateString()}}</b-field>
    <b-field
      horizontal
      expanded
      label="Last Updated:"
    >{{new Date(user.updatedAt).toLocaleDateString()}}</b-field>
    <hr />
    <div class="buttons is-centered">
      <button
        v-if="!user.meta.isAdmin"
        @click="makeAdmin()"
        class="button is-text"
        type="button"
      >Promote to admin</button>
      <button v-else @click="demote()" class="button is-text" type="button">Demote admin</button>
      <button @click="resetPw()" class="button is-text is-link" type="button">Reset Password</button>
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: ["user"],
  data() {
    return {
      updatedUser: {
        firstName: this.user.firstName,
        lastName: this.user.lastName
      }
    };
  },
  methods: {
    ...mapActions(["updateUser", "resetPassword", "updateUserRole"]),
    async resetPw() {
      this.$buefy.dialog.confirm({
        title: "Reset User's Password",
        type: "is-warning",
        hasIcon: true,
        focusOn: "cancel",
        confirmText: `Reset ${this.user.firstName}'s password`,
        message: `Are you sure to <strong>reset ${this.user.firstName} ${this.user.lastName}'s</strong> password?`,
        onConfirm: async () => await this.resetPassword(this.user.email)
      });
    },
    async makeAdmin() {
      this.$buefy.dialog.confirm({
        title: "Promote User",
        type: "is-warning",
        hasIcon: true,
        focusOn: "cancel",
        confirmText: `Make ${this.user.firstName} admin`,
        message: `Are you sure to <strong>promote ${this.user.firstName} ${this.user.lastName}</strong> to admin?`,
        onConfirm: async () => await this.updateUserRole(this.user._id)
      });
    },
    async demote() {
      this.$buefy.dialog.confirm({
        title: "Demote User",
        type: "is-warning",
        hasIcon: true,
        focusOn: "cancel",
        confirmText: `Make ${this.user.firstName} regular user`,
        message: `Are you sure to <strong>demote ${this.user.firstName} ${this.user.lastName}</strong> to regular user?`,
        onConfirm: async () => await this.updateUserRole(this.user._id)
      });
    },
    async formHandle(data) {
      data._id = this.user._id;
      data.email = this.user.email;
      await this.updateUser(data)
        .then(() => {
          this.$emit("updated");
        })
        .catch();
    }
  }
};
</script>

<style>
</style>