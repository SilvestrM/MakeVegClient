<template>
  <div class>
    <h3 class="title is-4">User management</h3>
    <hr />
    <div style="padding-top:.5rem;" class="section">
      <b-field label="Search" message="Search by user's name or email">
        <b-input type="search" icon="magnify" @input="search"></b-input>
      </b-field>
      <b-table
        detailed
        detail-key="_id"
        ref="table"
        :data="users"
        paginated
        per-page="10"
        :loading="isLoading"
      >
        <template slot-scope="props">
          <b-table-column field="lastName" label="Name">
            <button
              class="button is-text"
              @click="toggle(props.row)"
            >{{`${props.row.firstName} ${props.row.lastName}`}}</button>
          </b-table-column>
          <b-table-column field="email" label="Email">
            <span class>{{ props.row.email }}</span>
          </b-table-column>
          <b-table-column
            class="is-flex is-justified-right"
            v-if="true"
            field="_id"
            label="Controls"
            numeric
          >
            <!-- <button class="button is-text" @click="toggle(props.row)">
              <b-icon icon="pencil"></b-icon>
            </button>-->
            <div class="buttons row-controls">
              <b-tooltip
                type="is-light"
                :delay="500"
                position="is-bottom"
                label="User profile"
                animated
              >
                <router-link class="button is-text" :to="`/user/${props.row._id}`">
                  <b-icon icon="account"></b-icon>
                </router-link>
              </b-tooltip>
              <b-tooltip type="is-light" :delay="500" position="is-bottom" label="Delete" animated>
                <button class="button is-text" @click="deleteDialog(props.row)">
                  <b-icon icon="delete"></b-icon>
                </button>
              </b-tooltip>
            </div>
          </b-table-column>
        </template>

        <template slot="detail" slot-scope="props">
          <div class>
            <UpdateUserRow @updated="toggle(props.row)" :user="props.row" />
          </div>
        </template>

        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon icon="alert-circle" size="is-large"></b-icon>
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
import UpdateUserRow from "../../components/UpdateUserRow";

export default {
  components: { UpdateUserRow },
  data() {
    return {
      query: "",
      isLoading: false
    };
  },
  computed: {
    ...mapGetters(["getUsers"]),
    users() {
      return this.getUsers.filter(
        user => user._id !== this.$store.state.loggedIn._id
      );
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
    toggle(row) {
      this.$refs.table.toggleDetails(row);
    },
    deleteDialog(user) {
      this.$buefy.dialog.prompt({
        title: "Deleting User",
        message: `Are you sure you want to <b>delete <em>${user.firstName} ${user.lastName}</em></b>? This action cannot be undone. To delete this user please type down their full name below.`,
        confirmText: "Delete User",
        inputAttrs: {
          placeholder: `${user.firstName} ${user.lastName}`,
          required: true
        },
        type: "is-danger",
        hasIcon: true,
        closeOnConfirm: false,
        onConfirm: async value => {
          if (value === user.firstName + " " + user.lastName) {
            await this.deleteUser(user._id);
            // this.$buefy.dialog.confirm({
            //   title: "Deleting User",
            //   message: `Do you want to keep user's recipes?`,
            //   confirmText: "No, delete all",
            //   cancelText: "Yes, keep Recipes",
            //   type: "is-danger",
            //   hasIcon: true,
            //   focusOn: "cancel",
            //   closeOnConfirm: false,
            //   trapFocus: true,
            //   onConfirm: async ({ close }) => {

            //     close();
            //   },
            //   onCancel: async ({ close }) => {
            //     await this.deleteUser({ _id: user._id, keepRecipes: true });
            //     close();
            //   }
            // });
          } else {
            this.$buefy.toast.open({
              message: `The entered name does not match the user's name`,
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