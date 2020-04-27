<template>
  <div class="section">
    <div class="container">
      <div class="section">
        <h1 class="title">
          Edit Recipe
          <em class="has-text-grey has-text-weight-light">{{recipe.name}}</em>
        </h1>
        <hr />
        <form action="post" @submit.prevent="formHandle">
          <div class="columns is-centered">
            <div class="column is-half is-narrow">
              <b-field label="Name">
                <b-input v-model="updatedData.name" type="text" placeholder="Recipe name" required></b-input>
              </b-field>
              <b-field label="Diets">
                <b-taginput
                  v-model="updatedData.dietTypes"
                  :data="diets"
                  autocomplete
                  :allow-new="false"
                  open-on-focus
                  icon="label"
                  placeholder="Add a diet"
                  @typing="getDiets"
                ></b-taginput>
              </b-field>
              <b-field label="Description">
                <b-input
                  v-model="updatedData.description"
                  type="textarea"
                  maxlength="500"
                  placeholder="Recipe description"
                ></b-input>
              </b-field>
            </div>
            <div class="column is-half">
              <b-field label="Cooktime">
                <b-timepicker
                  :increment-minutes="5"
                  v-model="updatedData.cookTime"
                  required
                  placeholder="Click to select..."
                  icon="clock"
                ></b-timepicker>
              </b-field>
              <b-field class label="Ingredients">
                <b-taginput
                  v-model="updatedData.ingredients"
                  :allow-new="true"
                  open-on-focus
                  icon="label"
                  placeholder="Add an ingredient"
                ></b-taginput>
              </b-field>
              <b-field label="Instructions">
                <b-input
                  v-model="updatedData.instructions"
                  type="textarea"
                  maxlength="1000"
                  placeholder="Recipe Instructions"
                  required
                ></b-input>
              </b-field>
            </div>
          </div>
          <div class="columns is-centered">
            <div class="column is-narrow">
              <b-field label="Upload Images" expanded>
                <b-upload
                  @input="checkUpload"
                  accept=".jpg, .png, .jpeg"
                  v-model="dropFiles"
                  multiple
                  drag-drop
                  disabled
                >
                  <section class="section">
                    <div class="content has-text-centered">
                      <p>
                        <b-icon icon="upload" size="is-large"></b-icon>
                      </p>
                      <p>Drop your files here or click to upload</p>
                      <p
                        class="has-text-grey-light is-italic"
                      >Accepts .jpg or .png with maximum size of 10MB</p>
                    </div>
                  </section>
                </b-upload>
              </b-field>
              <div class="tags is-multiline">
                <span v-for="(file, index) in dropFiles" :key="index" class="tag is-primary">
                  {{file.name}}
                  <button
                    class="delete is-small"
                    type="button"
                    @click="deleteDropFile(index)"
                  ></button>
                </span>
              </div>
            </div>
          </div>
          <div class="columns is-centered">
            <div class="column is-narrow">
              <button class="button is-primary" type="submit">Add a new recipe</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      isLoading: false,
      images: [],
      dropFiles: []
    };
  },
  computed: {
    ...mapGetters(["getLoggedIn", "getRecipe"]),
    recipe() {
      return this.getRecipe(this.$route.params.id);
    },
    updatedData() {
      return {
        _id: this.recipe._id,
        name: this.recipe.name,
        cookTime: this.recipe.cookTime,
        description: this.recipe.description,
        ingredients: this.recipe.ingredients,
        dietTypes: this.recipe.dietTypes,
        instructions: this.recipe.instructions
      };
      //images
    },
    diets() {
      return this.$store.getters.getDiets;
    }
  },
  methods: {
    ...mapActions(["updateRecipe", "fetchRecipe"]),
    async formHandle() {
      // @todo images upload
      // this.recipe.images = this.dropFiles;
      await this.updateRecipe(this.updatedData).then(() => {
        this.$router.push(`/recipe/${this.recipe._id}`);
      });
    },
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1);
    },
    getDiets(text) {
      return this.diets.filter(
        diet =>
          diet
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
      );
    },
    checkUpload(files) {
      files.forEach(file => {
        if (file.size >= 10000000) {
          this.dropFiles.splice(files.indexOf(file));
          this.$buefy.toast.open({
            message: `File ${file.name} is too big`,
            position: "is-bottom",
            type: "is-warning"
          });
        }
      });
    }
  },
  // async mounted() {
  //   await this.fetchRecipe(this.$route.params.id);
  // },
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      vm.isLoading = true;
      await vm.fetchRecipe(to.params.id);
      vm.images = vm.getRecipe(to.params.id).images;
      vm.isLoading = false;
    });
  },
  beforeRouteUpdater(to, from, next) {
    next(async vm => {
      vm.isLoading = true;
      await vm.fetchRecipe(to.params.id);
      vm.images = vm.getRecipe(to.params.id).images;
      vm.isLoading = false;
    });
  }
};
</script>

<style>
</style>