<template>
  <div class="section">
    <div class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-two-thirds">
            <b-carousel :autoplay="false" :indicator-inside="true" :overlay="gallery">
              <b-carousel-item v-for="(item, i) in photos" :key="i">
                <a @click="switchGallery(true)" class="image is-16by9">
                  <img :src="item" />
                </a>
              </b-carousel-item>
              <span v-if="gallery" @click="switchGallery(false)" class="modal-close is-large" />
              <!-- <template slot="indicators" slot-scope="props">
            <figure class="al image" :draggable="false">
              <img :draggable="false" :src="props.i" :title="props.i" />
            </figure>
              </template>-->
            </b-carousel>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="container">
          <hr />
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <h1 class="title is-capitalized">{{recipe.name}}</h1>
              </div>
            </div>
            <div class="level-item">
              <div class="level-item">
                <div class="rate is-hidden">{{rate = countAvg(recipe.ratings)}}</div>
                <b-rate disabled v-model="rate" spaced show-score :icons="'star'" :max="5"></b-rate>
              </div>
              <div class="level-item">
                <!-- <div class="span">by:&nbsp;{{recipe.ratings.length}}&nbsp;users</div> -->
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <p>
                  <time
                    :datetime="recipe.dateAdded"
                  >{{`${recipe.dateAdded.getDate()}/${recipe.dateAdded.getMonth()}/${recipe.dateAdded.getFullYear()}`}}</time>
                  &nbsp;
                </p>
                <p>
                  by&nbsp;
                  <span>{{recipe.author}}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="columns is-variable is-5">
            <div class="column is-half">
              <div class="tags">
                <span
                  v-for="(type, index) in recipe.dietTypes"
                  :index="index"
                  :key="index"
                  class="tag is-medium"
                >{{type}}</span>
              </div>
              <div class="content has-text-left">
                <p>{{recipe.description}}</p>
              </div>
            </div>
            <div class="column is-half">
              <div class="content has-text-right">
                <p class="is-right">
                  <span class="icon">
                    <i class="mdi mdi-timelapse"></i>
                  </span>
                  Estimated cooking time:
                  <em>{{recipe.cookTime}}min</em>
                </p>
              </div>
              <hr />
              <div class="content has-text-left">
                <h3 class="subtitle is-5">Ingredients</h3>
                <ul>
                  <li v-for="(ing, i) in recipe.ingredients" :key="i">{{ing.amount}} {{ing.name}}</li>
                </ul>
              </div>
              <hr />
              <div class="content has-text-left">
                <h3 class="subtitle is-5">Directions</h3>
                <p>{{recipe.instructions}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <hr />
        <div class="container">
          <h2 class="title is-5">Reviews</h2>
        </div>
      </div>
    </div>
    <b-loading :active.sync="isLoading" :is-full-page="false"></b-loading>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      gallery: false,
      isLoading: false
    };
  },
  computed: {
    ...mapGetters(["getRecipe", "getUser"]),
    recipe() {
      return this.getRecipe(this.$route.params.id);
    },
    photos() {
      const arr = [];
      arr.push(this.recipe.imageURL);
      arr.push(this.recipe.imageURL);
      return arr;
    }
  },
  mounted() {},
  methods: {
    ...mapActions(["fetchRecipe", "fetchUser"]),
    switchGallery(value) {
      this.gallery = value;
      if (value) {
        return document.documentElement.classList.add("is-clipped");
      } else {
        return document.documentElement.classList.remove("is-clipped");
      }
    },
    countAvg(arr) {
      if (arr && arr.length > 0)
        return (
          Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
        );
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      vm.isLoading = true;
      await vm.fetchRecipe(to.params.id);
      await vm.fetchUser(vm.getRecipe(to.params.id).author);
      vm.isLoading = false;
    });
  },
  async created() {
    // await this.fetchRecipe(this.$route.params.id);
  }
};
</script>

<style>
</style>