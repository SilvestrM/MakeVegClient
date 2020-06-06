<template>
  <div class="section">
    <div class="container">
      <div class="is-flex is-justified-center">
        <h1 class="title is-4">Adding a new recipe</h1>
      </div>
      <form novalidate ref="form" action="post" @submit.prevent="formHandle">
        <b-steps style="padding-top:2rem" v-model="activeStep">
          <hr class="is-marginless" />
          <b-step-item step="1" icon="clipboard-text" label="Description">
            <div class="columns is-centered">
              <div class="column is-half is-narrow">
                <b-field
                  :type="{'is-danger' : errors.name}"
                  label="Name"
                  :message="[`Your recipe's name. Maximum 50 characters`,
                     {'Must be minimum of 3 characters!': errors.name}]"
                >
                  <b-input
                    @blur="validate()"
                    v-model="recipe.name"
                    minlength="1"
                    maxlength="50"
                    :has-counter="false"
                    type="text"
                    placeholder="Vegetable Soup"
                    validation-message="Must be between 1 and 50 characters"
                    required
                  ></b-input>
                </b-field>
                <b-field
                  :type="{'is-danger' : errors.diets}"
                  label="Diets"
                  :message="['Recipe diet tags. Choose those that best describe the recipe.',{'You need to choose atleast one!' : errors.diets}]"
                >
                  <b-taginput
                    @blur="validate()"
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
                <b-field
                  :type="{'is-danger' : errors.desc}"
                  message="Describe your recipe here. Atleast 10 and maximum 500 characters"
                  label="Description"
                >
                  <b-input
                    @blur="validate()"
                    required
                    v-model="recipe.description"
                    type="textarea"
                    minlength="10"
                    maxlength="500"
                    placeholder="Lovely soup..."
                    validation-message="Must be between 5 and 500 characters"
                    spellcheck
                  ></b-input>
                </b-field>
              </div>
            </div>
          </b-step-item>
          <b-step-item step="2" icon="chef-hat" label="Instructions">
            <div class="columns is-centered">
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
                      <!-- <b-button type="is-primary" @click="close()">Confirm</b-button> -->
                    </div>
                  </b-clockpicker>
                </b-field>
                <b-field
                  :message="[`Preferred format is: 'amount+unit ingredient' e.g. '1l water'`, {'You need to provide atleast 1 ingredient!': errors.ingredients}]"
                  label="Ingredients"
                  :type="{'is-danger' : errors.ingredients}"
                >
                  <b-taginput
                    v-model="recipe.ingredients"
                    :allow-new="true"
                    open-on-focus
                    icon="label"
                    placeholder="Add an ingredient"
                    maxtags="30"
                    maxlength="70"
                    allow-duplicates
                    ellipsis
                    @blur="validate()"
                  ></b-taginput>
                </b-field>
                <b-field
                  :message="[`Write your cooking instructions/directions here. Maximum 2000 characters`]"
                  label="Instructions"
                  :type="{'is-danger' : errors.instructions === true}"
                >
                  <!-- <TextEditor :max="1000" v-model="recipe.instructions" /> -->
                  <b-input
                    v-model="recipe.instructions"
                    type="textarea"
                    validation-message="Maximum 2000 characters."
                    maxlength="2000"
                    placeholder="Prepare and boil for 20 minutes..."
                    spellcheck
                  ></b-input>
                </b-field>
              </div>
            </div>
          </b-step-item>

          <b-step-item step="3" icon="upload" label="Images">
            <div class="columns is-centered">
              <div class="column is-narrow is-flex is-justified-center is-column">
                <b-field :type="{'is-danger' : errors.image}" label="Upload Images" expanded>
                  <b-upload
                    @input="checkUpload"
                    accept=".jpg, .png, .jpeg"
                    v-model="dropFiles"
                    multiple
                    validation-message="Choose atleast one file."
                    drag-drop
                    expanded
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
              <div class="column is-half is-flex is-column is-justified-center">
                <b-message
                  :has-icon="true"
                  :icon="!errors.image ? dropFiles.length > 0 ? 'check' : 'exclamation':'alert-circle'"
                  icon-size="is-small"
                  :class="{'is-primary' : !errors.image, 'is-danger' : errors.image}"
                >Atleast one image is required!</b-message>
              </div>
            </div>
          </b-step-item>
          <b-step-item step="4" icon="check" label="Summary" clickable>
            <div class="columns is-centered">
              <div class="column box is-half is-info has-background-white-bis">
                <h3 class="subtitle has-text-weight-medium">Summary</h3>
                <hr />
                <table
                  style="background-color: transparent"
                  class="table is-fullwidth is-borderless"
                >
                  <tbody>
                    <tr>
                      <td>
                        <span class="label">Name*</span>
                      </td>
                      <td>
                        <p class="is-italic">{{recipe.name ? recipe.name : "None provided"}}</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="label">Description</span>
                      </td>
                      <td>
                        <p
                          class="is-italic"
                        >{{recipe.description ? (recipe.description.length > 30 ? `${recipe.description.substring(0,30)}...`:recipe.description ) : "None provided"}}</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="label">Diets*</span>
                      </td>
                      <td>
                        <p
                          class="is-italic"
                        >{{recipe.dietTypes.length > 0 ? recipe.dietTypes.slice(0,5).toString() : "None provided"}}</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="label">Cook Time</span>
                      </td>
                      <td>
                        <p
                          class="is-italic"
                        >{{recipe.cookTime.getMinutes() > 0 ? `${recipe.cookTime.getMinutes() + (recipe.cookTime.getHours()*60)}` : "0"}} min</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="label">Ingredients*</span>
                      </td>
                      <td>
                        <p
                          class="is-italic"
                        >{{recipe.ingredients.length > 0 ? recipe.ingredients.slice(0,5).toString() : "None provided"}}</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="label">Instructions</span>
                      </td>
                      <td>
                        <p
                          class="is-italic"
                        >{{recipe.instructions ? (recipe.instructions.length > 30 ? `${recipe.instructions.substring(0,30)}...`:recipe.instructions ): "None provided"}}</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="label">Images*</span>
                      </td>
                      <td>
                        <p class="is-italic">{{dropFiles.length}}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
          <div v-if="uploading" class="columns is-centered">
            <div class="column is-two-fifths" style="padding-top:1.5rem; padding-bottom:1rem">
              <b-progress
                size="is-medium"
                type="is-primary"
                show-value
              >Uploading... This process can take a while.</b-progress>
            </div>
          </div>
          <template slot="navigation" slot-scope="{previous, next}">
            <div class="columns is-centered">
              <div class="column is-narrow is-flex is-justified-center">
                <div style>
                  <b-button
                    style="margin-right:0.25rem;"
                    outlined
                    icon-left="chevron-left"
                    :disabled="previous.disabled"
                    @click.prevent="previous.action"
                  >Previous</b-button>
                  <template v-if="!next.disabled">
                    <b-button
                      outlined
                      :form="`form-${activeStep}`"
                      icon-right="chevron-right"
                      :disabled="next.disabled"
                      native-type="button"
                      @click.prevent="goNext(next)"
                    >Next</b-button>
                    <!-- <button
                      :form="`form-${activeStep}`"
                      class="button is-outline"
                      @click="nextStep = next"
                      type="submit"
                    >Next</button>-->
                  </template>
                  <template v-else>
                    <button class="button is-primary" type="submit">Add this recipe</button>
                  </template>
                </div>
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
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
//import TextEditor from "../components/TextEditor";

export default {
  data() {
    return {
      errors: {},
      activeStep: 0,
      nextStep: null,
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
  validations: {
    recipe: {
      name: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(50)
      },
      description: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(500)
      },
      instructions: {
        maxLength: maxLength(2000)
      },
      images: {
        minLength: minLength(1),
        required
      }
    }
  },
  computed: {
    ...mapGetters(["getLoggedIn"]),
    diets() {
      return this.$store.getters.getDiets;
    }
  },
  watch: {
    errors: {
      deep: true,
      handler() {}
    }
  },
  methods: {
    ...mapActions(["addRecipe"]),
    async formHandle() {
      this.recipe.images = this.dropFiles;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.uploading = true;
        await this.addRecipe(this.recipe)
          .then(() => {
            this.uploading = false;
            this.$router.push(`/user/${this.getLoggedIn._id}`);
          })
          .catch(() => {
            this.uploading = false;
            this.$buefy.toast.open({
              message: `Something went wrong while adding recipe!`,
              type: "is-danger"
            });
          });
      } else {
        this.$buefy.toast.open({
          message: `There has been invalid data provided! Please check the provided data.`,
          type: "is-warning"
        });
      }
    },
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1);
      this.validate();
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
    validate() {
      switch (this.activeStep) {
        case 0:
          if (this.recipe.name.length < 3) {
            this.$set(this.errors, "name", true);
            return false;
          } else {
            this.$set(this.errors, "name", false);
          }
          if (
            this.recipe.description.length > 500 ||
            this.recipe.description.length < 10
          ) {
            this.$set(this.errors, "desc", true);
            return false;
          } else {
            this.$set(this.errors, "desc", false);
          }
          if (this.recipe.dietTypes.length === 0) {
            this.$set(this.errors, "diets", true);
            return false;
          } else {
            this.$set(this.errors, "diets", false);
          }
          break;
        case 1:
          if (this.recipe.ingredients.length === 0) {
            this.$set(this.errors, "ingredients", true);
            return false;
          } else {
            this.$set(this.errors, "ingredients", false);
          }
          if (this.recipe.instructions.length > 2000) {
            this.$set(this.errors, "instructions", true);
            return false;
          } else {
            this.$set(this.errors, "instructions", false);
          }
          break;
        case 2:
          if (this.dropFiles.length === 0) {
            this.$set(this.errors, "image", true);
            return false;
          } else {
            this.$set(this.errors, "image", false);
            break;
          }
      }
      return true;
    },
    goNext(next) {
      if (this.validate()) {
        next.action();
      }
    },
    parseTime(str) {
      try {
        const times = str.split(":");
        if (times.length !== 2) {
          throw new Error("Bad format");
        }
        const time = new Date();
        time.setHours(times[0]);
        time.setMinutes(times[1]);
        return time;
      } catch (e) {
        throw new Error(e);
      }
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
        } else {
          this.validate();
        }
      });
    }
  },
  components: {
    //TextEditor
  }
};
</script>

<style scoped lang="scss">
// .section {
//   .section {
//     padding: 2rem 0;
//   }
// }

.table {
  tr {
    // overflow-x: hidden;
  }
  tr,
  td {
    border: hidden !important;
    padding: 0.3em 0.75em;
  }
  td:nth-child(odd) {
    // font-family: $family-secondary;
    // width: 2rem;
  }
  td:nth-child(even) {
    // font-family: $family-secondary;
    color: $grey;
  }
}
.step-item {
  min-height: 30rem;
  padding: 3rem 0 1.5rem;
}

.box {
  overflow-x: hidden;
  padding: 1.25rem;
  @media (min-width: $desktop) {
    padding: 2rem;
  }
}
</style>