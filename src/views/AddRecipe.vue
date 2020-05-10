<template>
  <div class="section">
    <div class="container">
      <div class="section">
        <h1 class="title">New Recipe</h1>
        <hr />
        <form action="post" @submit.prevent="formHandle">
          <div v-if="uploading" class="columns">
            <div class="column">
              <b-progress size="is-small" type="is-primary">Uploading...</b-progress>
            </div>
          </div>
          <b-steps>
            <b-step-item step="1" icon="clipboard-text" label="Description" clickable>
              <div class="columns is-centered">
                <div class="column is-half is-narrow">
                  <b-field label="Name">
                    <b-input v-model="recipe.name" type="text" placeholder="Recipe name" required></b-input>
                  </b-field>
                  <b-field label="Diets">
                    <b-taginput
                      v-model="recipe.dietTypes"
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
                      v-model="recipe.description"
                      type="textarea"
                      maxlength="500"
                      placeholder="Recipe description"
                    ></b-input>
                  </b-field>
                </div>
              </div>
            </b-step-item>
            <b-step-item step="2" icon="chef-hat" label="Instructions" clickable>
              <div class="columns is-centered">
                <div class="column is-half">
                  <b-field label="Cooktime">
                    <b-timepicker
                      :increment-minutes="5"
                      v-model="recipe.cookTime"
                      required
                      placeholder="Click to select..."
                      icon="clock"
                    ></b-timepicker>
                  </b-field>
                  <b-field class label="Ingredients">
                    <b-taginput
                      v-model="recipe.ingredients"
                      :allow-new="true"
                      open-on-focus
                      icon="label"
                      placeholder="Add an ingredient"
                    ></b-taginput>
                  </b-field>
                  <b-field label="Instructions">
                    <b-input
                      v-model="recipe.instructions"
                      type="textarea"
                      maxlength="1000"
                      placeholder="Recipe Instructions"
                      required
                    ></b-input>
                  </b-field>
                </div>
              </div>
            </b-step-item>

            <b-step-item step="3" icon="upload" label="Images" clickable>
              <div class="columns is-centered">
                <div class="column is-narrow is-flex is-justified-center is-column">
                  <b-field label="Upload Images" expanded>
                    <b-upload
                      @input="checkUpload"
                      accept=".jpg, .png, .jpeg"
                      v-model="dropFiles"
                      multiple
                      drag-drop
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
            </b-step-item>
            <b-step-item step="4" icon="check" label="Summary" clickable>
              <div class="columns is-centered">
                <div
                  class="column box is-half is-info has-background-white-bis"
                  style="padding: 2em"
                >
                  <h3 class="subtitle has-text-weight-medium">Summary</h3>
                  <hr />
                  <b-field label="Name*" horizontal>
                    <p class="is-italic">{{recipe.name ? recipe.name : "Not provided"}}</p>
                  </b-field>
                  <b-field label="Description" horizontal>
                    <p
                      class="is-italic"
                    >{{recipe.description ? (recipe.description.length > 30 ? `${recipe.description.substring(0,30)}...`:recipe.description ) : "Not provided"}}</p>
                  </b-field>
                  <b-field label="Diets" horizontal>
                    <p
                      class="is-italic"
                    >{{recipe.dietTypes.length > 0 ? recipe.dietTypes.slice(0,5).toString() : "Not provided"}}</p>
                  </b-field>
                  <b-field label="Cook Time" horizontal>
                    <p
                      class="is-italic"
                    >{{recipe.cookTime.getMinutes() > 0 ? recipe.cookTime : "0"}}</p>
                  </b-field>
                  <b-field label="Ingredients*" horizontal>
                    <p
                      class="is-italic"
                    >{{recipe.ingredients.length > 0 ? recipe.ingredients.slice(0,5).toString() : "Not provided"}}</p>
                  </b-field>
                  <b-field label="Instructions*" horizontal>
                    <p
                      class="is-italic"
                    >{{recipe.instructions ? (recipe.instructions.length > 30 ? `${recipe.instructions.substring(0,30)}...`:recipe.instructions ): "Not provided"}}</p>
                  </b-field>
                  <b-field label="Images" horizontal>
                    <p class="is-italic">{{dropFiles.length}}</p>
                  </b-field>
                  <hr />
                  <p class="is-italic has-text-grey">*required</p>
                </div>
              </div>
              <!-- <div class="columns is-centered">
                <div class="column is-narrow is-flex is-justified-center" style="margin-top:2rem">
                  <button class="button is-primary" type="submit">Add a new recipe</button>
                </div>
              </div>-->
            </b-step-item>
            <template slot="navigation" slot-scope="{previous, next}">
              <div class="columns is-centered">
                <div
                  class="column is-half is-flex is-justified-center is-relative"
                  style="top:3rem;"
                >
                  <b-button
                    outlined
                    icon-left="chevron-left"
                    :disabled="previous.disabled"
                    @click.prevent="previous.action"
                  >Previous</b-button>
                  <template v-if="!next.disabled">
                    <b-button
                      outlined
                      icon-right="chevron-right"
                      :disabled="next.disabled"
                      @click.prevent="next.action"
                    >Next</b-button>
                  </template>
                  <template v-else>
                    <button class="button is-primary" type="submit">Add this recipe</button>
                  </template>
                </div>
              </div>
            </template>
          </b-steps>
          <!-- <div class="columns is-centered" style="margin-top:3rem">
            <div class="column is-narrow is-flex is-justified-center">
              <button class="button is-primary" type="submit">Add this recipe</button>
            </div>
          </div>-->
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
      uploading: false,
      dropFiles: [],
      recipe: {
        name: "",
        cookTime: new Date("00"),
        description: "",
        ingredients: [],
        dietTypes: [],
        instructions: "",
        images: []
      }
    };
  },
  computed: {
    ...mapGetters(["getLoggedIn"]),
    diets() {
      return this.$store.getters.getDiets;
    }
  },
  methods: {
    ...mapActions(["addRecipe"]),
    async formHandle() {
      this.uploading = true;
      this.recipe.images = this.dropFiles;
      await this.addRecipe(this.recipe).then(() => {
        this.$router.push(`/user/${this.getLoggedIn._id}`);
      });
      this.uploading = false;
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
  components: {}
};
</script>

<style lang="scss">
.step-content {
  min-height: 24rem;
  margin-top: 2rem;
}
</style>