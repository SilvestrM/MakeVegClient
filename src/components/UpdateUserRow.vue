<template>
  <form action="post" @submit.prevent="formHandle(updatedUser)">
    <b-field horizontal expanded is-grouped label="Name">
      <b-input :placeholder="user.firstName" v-model="updatedUser.firstName" type="text"></b-input>
      <b-input :placeholder="user.lastName" v-model="updatedUser.lastName" type="text"></b-input>
    </b-field>
    <hr />

    <b-field horizontal expanded label="Email:">{{user.email}}</b-field>
    <b-field horizontal expanded label="Diets:">
      <div class="tags">
        <span
          class="tag"
          v-for="(diet, i) in user.settings.diets.slice(0,5)"
          :index="i"
          :key="i"
        >{{diet}}</span>
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
      <button class="button is-primary" type="submit">Update</button>
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
    ...mapActions(["updateUser"]),
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