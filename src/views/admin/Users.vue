<template>
  <div class>
    <h3 class="title is-4">User management</h3>
    <div class="section">
      <b-field label="Search">
        <b-input type="search" icon="magnify" @input="search"></b-input>
      </b-field>
      <b-table :data="users" :loading="isLoading">
        <template slot-scope="props">
          <b-table-column field="lastName" label="Name">
            <router-link
              :to="`/user/${props.row._id}/recipes`"
            >{{`${props.row.firstName} ${props.row.lastName}`}}</router-link>
          </b-table-column>
          <!-- <b-table-column field="dietTypes" label="Diets">
              <div class="tags">
                <span
                  class="tag"
                  v-for="(diet, i) in props.row.diets.slice(0,5)"
                  :index="i"
                  :key="i"
                >{{diet}}</span>
              </div>
          </b-table-column>-->
          <b-table-column field="createdAt" label="Date added" numeric>
            <span class="tag is-info">{{ new Date(props.row.createdAt).toLocaleDateString() }}</span>
          </b-table-column>
          <b-table-column v-if="true" field="_id" label="Controls" numeric>
            <button class="button is-text">
              <b-icon icon="pencil"></b-icon>
            </button>
            <button class="button is-text" @click="deleteDialog(props.row)">
              <b-icon icon="delete"></b-icon>
            </button>
          </b-table-column>
        </template>

        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon icon="exclamation" size="is-large"></b-icon>
              </p>
              <p>Nothing found</p>
            </div>
          </section>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      query: "",
      isLoading: false
    };
  },
  computed: {
    ...mapGetters(["getUsers"]),
    users: {
      get() {
        return this.getUsers;
      },
      set(found) {
        return found;
      }
    }
  },
  async mounted() {
    if (
      this.$store.state.loggedIn._id !== undefined &&
      this.$store.state.loggedIn._id === this.$route.params.id
    ) {
      this.me = true;
    }
  },
  methods: {
    ...mapActions(["fetchFindUsers", "deleteUser"]),
    async search(query) {
      if (query.length >= 1) {
        this.isLoading = true;
        await this.fetchFindUsers(query).then(() => {});
        this.isLoading = false;
      }
    },
    deleteDialog(user) {
      this.$buefy.dialog.prompt({
        title: "Deleting User",
        message: `Are you sure you want to <b>delete <em>${user.firstName} ${user.lastName}</em></b>? This action cannot be undone. To delete this user please type down their full name below.`,
        confirmText: "Delete User",
        inputAttrs: {
          placeholder: `${user.firstName} ${user.lastName}`
        },
        type: "is-danger",
        hasIcon: true,
        onConfirm: value => {
          if (value === user.firstName + " " + user.lastName) {
            this.deleteUser(user._id);
          } else {
            this.$buefy.toast.open({
              duration: 3000,
              message: `The entered name does not match the user's name`,
              position: "is-bottom",
              type: "is-warning"
            });
          }
        }
      });
    }
  }
};
</script>

<style>
</style>