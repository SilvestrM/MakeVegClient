<template>
  <div class="section">
    <div class="container">
      <h1 class="title is-4">New Recipe</h1>
      <hr />
      <form ref="form" action="post" @submit.prevent="formHandle">
        <b-steps v-model="activeStep">
          <b-step-item step="1" icon="clipboard-text" label="Description">
            <div class="columns is-centered">
              <div class="column is-half is-narrow">
                <form action="post" id="form-0" @submit.prevent="goNext()">
                  <b-field label="Name" message="Your recipe's name. Maximum 50 characters">
                    <b-input
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
                    label="Diets"
                    message="Recipe diet tags. Choose those that best describe the recipe."
                  >
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
                  <b-field
                    message="Describe your recipe here. Maximum 500 characters"
                    label="Description"
                  >
                    <b-input
                      required
                      min="10"
                      v-model="recipe.description"
                      type="textarea"
                      minlength="1"
                      maxlength="500"
                      placeholder="Lovely soup..."
                      validation-message="Must be between 1 and 500 characters"
                    ></b-input>
                  </b-field>
                </form>
              </div>
            </div>
          </b-step-item>
          <b-step-item step="2" icon="chef-hat" label="Instructions">
            <div class="columns is-centered">
              <div class="column is-half">
                <form action="post" id="form-1" @submit.prevent="goNext()">
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
                    :message="`Preferred format is: 'amount+unit ingredient' e.g. '1l water'`"
                    label="Ingredients"
                  >
                    <b-taginput
                      v-model="recipe.ingredients"
                      :allow-new="true"
                      open-on-focus
                      icon="label"
                      placeholder="Add an ingredient"
                    ></b-taginput>
                  </b-field>
                  <b-field
                    message="Write your cooking instructions/directions here. Must be atleast 10 and maximum 1000 characters"
                    label="Instructions"
                  >
                    <div>
                      <editor-menu-bar
                        :editor="editor"
                        keep-in-bounds
                        v-slot="{ commands, isActive}"
                      >
                        <div class="level is-marginless">
                          <div class="level-left">
                            <div class="level-item">
                              <div class="field has-addons">
                                <p class="control">
                                  <button
                                    class="button"
                                    :class="{ 'is-active': isActive.bold() }"
                                    @click.prevent="commands.bold"
                                  >
                                    <b-icon icon="format-bold" />
                                  </button>
                                </p>
                                <p class="control">
                                  <button
                                    class="button"
                                    :class="{ 'is-active': isActive.italic() }"
                                    @click.prevent="commands.italic"
                                  >
                                    <b-icon icon="format-italic" />
                                  </button>
                                </p>
                                <p class="control">
                                  <button
                                    class="control button"
                                    :class="{ 'is-active': isActive.underline() }"
                                    @click.prevent="commands.underline"
                                  >
                                    <b-icon icon="format-underline" />
                                  </button>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </editor-menu-bar>
                      <EditorContent style="max-height:auto" :editor="editor" />
                    </div>
                    <!-- <b-input
                      v-model="recipe.instructions"
                      type="textarea"
                      min="10"
                      validation-message="Must be between 10 and 1000 characters!"
                      minlength="10"
                      maxlength="1000"
                      placeholder="Prepare and boil for 20 minutes..."
                      required
                    ></b-input>-->
                  </b-field>
                </form>
              </div>
            </div>
          </b-step-item>

          <b-step-item step="3" icon="upload" label="Images">
            <div class="columns is-centered">
              <div class="column is-narrow is-flex is-justified-center is-column">
                <form action="post" id="form-2" @submit.prevent="goNext()">
                  <b-field label="Upload Images" expanded>
                    <b-upload
                      @input="checkUpload"
                      accept=".jpg, .png, .jpeg"
                      v-model="dropFiles"
                      multiple
                      validation-message="Choose atleast one file."
                      drag-drop
                      expanded
                      required
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
                </form>
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
                <b-message type="is-info">Atleast one image is required!</b-message>
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
                        <span class="label">Description*</span>
                      </td>
                      <td>
                        <p
                          class="is-italic"
                        >{{recipe.description ? (recipe.description.length > 30 ? `${recipe.description.substring(0,30)}...`:recipe.description ) : "None provided"}}</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="label">Diets</span>
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
                        <span class="label">Ingredients</span>
                      </td>
                      <td>
                        <p
                          class="is-italic"
                        >{{recipe.ingredients.length > 0 ? recipe.ingredients.slice(0,5).toString() : "None provided"}}</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="label">Instructions*</span>
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
                      native-type="submit"
                      @click="nextStep = next"
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
import { required, minLength } from "vuelidate/lib/validators";
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import { Bold, Italic, HardBreak, Underline } from "tiptap-extensions";

export default {
  data() {
    return {
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
      },
      editor: new Editor({
        extensions: [
          new Bold(),
          new Italic(),
          new Underline(),
          new HardBreak()
        ],
        content: "tt"
      })
    };
  },
  validations: {
    recipe: {
      name: {
        required
      },
      description: {
        required,
        minLength: minLength(5)
      },
      instructions: {
        required,
        minLength: minLength(10)
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
    /*   editor: {
      get() {
        return new Editor({
          extensions: [
            new Bold(),
            new Italic(),
            new Underline(),
            new HardBreak()
          ],
          content: this.recipe.instructions
        });
      },
      set(value) {
        this.editor.content = value;
      }
    } */
  },
  watch: {
    editor() {}
  },
  methods: {
    ...mapActions(["addRecipe"]),
    async formHandle() {
      this.recipe.images = this.dropFiles;
      this.recipe.instructions = this.editor.getHTML().toString();
      console.log(typeof this.editor.getHTML());
      console.log(this.recipe.instructions);
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
    validate(next) {
      // this.$refs[`form-${this.activeStep}`].submit();
      this.nextStep = next;
      //next.action();
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
    goNext() {
      this.nextStep.action();
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
  components: {
    EditorContent,
    EditorMenuBar
  },
  beforeDestroy() {
    this.editor.destroy();
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
    overflow-x: hidden;
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