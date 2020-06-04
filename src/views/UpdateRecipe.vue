<template>
  <div class="section">
    <div class="container">
      <h1 class="title is-4">
        Editing Recipe
        <em class="has-text-grey has-text-weight-light">{{recipe.name}}</em>
      </h1>
      <hr />
      <form action="post" @submit.prevent="formHandle">
        <div class="columns is-centered">
          <div class="column is-half is-narrow">
            <b-field label="Name" message="Your recipe's name. Maximum 50 characters">
              <b-input
                minlength="1"
                maxlength="50"
                validation-message="Must be between 5 and 50 characters"
                v-model="updatedData.name"
                type="text"
                placeholder="Recipe name"
                required
              ></b-input>
            </b-field>
            <b-field label="Diets" message="Recipe diet tags">
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
            <b-field
              label="Description"
              message="Describe your recipe here. Maximum 500 characters"
            >
              <b-input
                v-model="updatedData.description"
                type="textarea"
                minlength="1"
                maxlength="500"
                placeholder="Recipe description"
              ></b-input>
            </b-field>
          </div>
          <div class="column is-half">
            <b-field label="Cooktime" message="Format HH:MM">
              <b-clockpicker
                :increment-minutes="5"
                v-model="recipe.cookTime"
                required
                placeholder="Click to select..."
                icon="clock"
                hour-format="24"
              >
                <div class="is-flex is-justified-center">
                  <b-button class @click="recipe.cookTime=new Date(0,0)">Clear</b-button>
                </div>
              </b-clockpicker>
            </b-field>
            <b-field
              label="Ingredients"
              message="Preferred format is: 'amount+unit ingredient' e.g. '1l water'"
            >
              <b-taginput
                v-model="updatedData.ingredients"
                :allow-new="true"
                open-on-focus
                icon="label"
                placeholder="Add an ingredient"
                maxtags="30"
                maxlength="100"
                allow-duplicates
                ellipsis
              ></b-taginput>
            </b-field>
            <b-field
              label="Instructions"
              message="Write your cooking instructions/directions here. Maximum 2000 characters"
            >
              <!-- <TextEditor v-model="updatedData.instructions" /> -->
              <b-input
                v-model="updatedData.instructions"
                type="textarea"
                validation-message="Maximum 2000 characters"
                maxlength="2000"
                placeholder="Recipe Instructions"
                required
              ></b-input>
            </b-field>
          </div>
        </div>
        <hr />
        <div class="columns is-centered">
          <div class="column is-full">
            <b-field label="Recipe images">
              <div class="has-background-white-ter">
                <b-carousel-list :items-to-show="2" :data="imagesFormatted">
                  <template slot="item" slot-scope="props">
                    <figure class="16by9 is-relative">
                      <img :src="props.list" />
                      <button
                        style="position:absolute; top:.5rem; right:.5rem;"
                        type="button"
                        class="delete is-medium"
                        @click.prevent="removeImage(props.index)"
                      ></button>
                    </figure>
                  </template>
                </b-carousel-list>
              </div>
            </b-field>
          </div>
        </div>

        <!-- <b-message has-icon type="is-info">Updating images is not supported yet..</b-message> -->
        <div class="columns is-centered">
          <div class="column is-narrow">
            <b-field label="Upload Images" expanded>
              <b-upload
                @input="checkUpload"
                accept=".jpg, .png, .jpeg"
                v-model="dropFiles"
                multiple
                drag-drop
                expanded
                :required="!this.images.length > 0 && this.dropFiles.length === 0"
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
        <div v-if="uploading" class="columns is-centered">
          <div class="column is-two-fifths">
            <b-progress size="is-medium" type="is-primary" show-value>Processing...</b-progress>
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column is-narrow is-flex is-justified-center">
            <button class="button is-primary" type="submit">Save changes</button>
          </div>
        </div>
      </form>
      <b-loading :active.sync="isLoading"></b-loading>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
//import TextEditor from "../components/TextEditor";

export default {
  components: {
    //TextEditor
  },
  data() {
    return {
      uploading: false,
      isLoading: false,
      dropFiles: [],
      removedImages: []
      // images: []
    };
  },
  computed: {
    ...mapGetters(["getLoggedIn", "getRecipe"]),
    recipe() {
      const recipe = this.getRecipe(this.$route.params.id);
      recipe.cookTime = new Date(recipe.cookTime);
      return recipe;
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
    },
    images: {
      get() {
        return this.getRecipe(this.$route.params.id).images;
      }
      // set(images) {
      //   this.$store.commit("setRecipe", { images });
      // }
    },
    imagesFormatted() {
      const arr = [];
      if (this.images) {
        this.images.forEach(img => {
          if (img.data !== undefined)
            arr.push(`data:image/jpeg;base64,${this.$encodeb64(img.data)}`);
        });
      }
      return arr;
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
      if (!(this.images.length > 0 || this.dropFiles.length > 0)) {
        this.$buefy.toast.open({
          message: `Recipe has to have atleast one image!`,
          type: "is-danger"
        });
        return;
      }
      if (this.updatedData.instructions.length >= 2000) {
        this.$buefy.toast.open({
          message: `Instructions can't be longer than 2000 characters!`,
          type: "is-danger"
        });
        return;
      }
      this.updatedData.images = this.images;
      this.updatedData.newImages = this.dropFiles;
      this.updatedData.removedImages = this.removedImages;
      this.uploading = true;
      await this.updateRecipe(this.updatedData)
        .then(() => {
          this.uploading = false;
          this.$router.push(`/recipe/${this.recipe._id}`);
        })
        .catch(reason => {
          this.uploading = false;
          this.$buefy.toast.open({
            message: `Something went wrong while updating recipe! ${reason}`,
            type: "is-danger"
          });
        });
    },
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1);
    },
    removeImage(index) {
      this.removedImages = this.removedImages.concat(
        this.images.splice(index, 1)
      );
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
          this.dropFiles.splice(files.indexOf(file), 1);
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
      // vm.images = vm.getRecipe(to.params.id).images;
      vm.isLoading = false;
    });
  },
  beforeRouteUpdater(to, from, next) {
    next(async vm => {
      vm.isLoading = true;
      await vm.fetchRecipe(to.params.id);
      // vm.images = vm.getRecipe(to.params.id).images;
      vm.isLoading = false;
    });
  }
};
</script>

<style>
</style>