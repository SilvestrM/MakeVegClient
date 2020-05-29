<template>
  <span class>
    <div
      class="section blur-bcg"
      style="padding: 1rem"
      :style="`background-image: url(${photos[activeImage]})`"
    >
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-full">
            <b-carousel
              v-model="activeImage"
              :autoplay="false"
              :indicator-inside="true"
              :overlay="gallery"
              :arrow="photos.length > 1"
              @change="activeImage = $event"
              :indicator="photos.length > 1"
            >
              <b-carousel-item v-for="(item, i) in photos" :key="i">
                <a
                  @click.left="switchGallery(!gallery)"
                  class="image is-16by9"
                  style="max-height:10rem"
                >
                  <img :src="item" />
                </a>
              </b-carousel-item>
              <template slot="overlay">
                <span v-if="gallery" @click="switchGallery(false)" class="modal-close is-large" />
              </template>
              <!-- <template slot="indicators" slot-scope="props">
                <figure class="al image" :draggable="false">
                  <img :draggable="false" :src="props.i" :title="props.i" />
                </figure>
              </template>-->
            </b-carousel>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <h1 class="title is-italic has-text-weight-normal is-capitalized">{{recipe.name}}</h1>
            </div>
            <div v-if="$store.state.loggedIn" class="level-item">
              <b-tooltip
                type="is-light"
                :delay="500"
                position="is-bottom"
                :label="liked === true ? 'Remove Favorite' : 'Add Favorite'"
                animated
              >
                <button
                  @click="toggleLike()"
                  class="button is-inverted is-borderless is-text is-flex is-aligned-center is-justified-center"
                  :class="{'is-info': liked === true}"
                >
                  <b-icon :icon="liked === true ? 'heart' : 'heart-outline'"></b-icon>
                </button>
              </b-tooltip>
            </div>
          </div>
          <div class="level-item">
            <!-- <div class="level-item">
                <div class="rate is-hidden">{{rate = countAvg(recipe.ratings)}}</div>
                <b-rate disabled v-model="rate" spaced show-score :icons="'star'" :max="5"></b-rate>
            </div>-->
            <div class="level-item">
              <!-- <div class="span">by:&nbsp;{{recipe.ratings.length}}&nbsp;users</div> -->
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <p>
                Created on
                {{`${new Date(recipe.createdAt).toLocaleDateString()} `}}
                by
                <router-link :to="`/user/${author._id}`">
                  <span class="is-italic">{{`${author.firstName} ${author.lastName}`}}</span>
                </router-link>
              </p>
            </div>
          </div>
        </div>
        <hr />
        <div class="columns is-variable is-5">
          <div class="column is-half">
            <!-- <div class="rate is-hidden">{{rate = countAvg(recipe.ratings)}}</div>
            <b-rate disabled v-model="rate" spaced show-score :icons="'star'" :max="5"></b-rate>-->
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
            <hr />
            <div class="content has-text-left">
              <h3 class="subtitle is-5">Ingredients</h3>
              <ul>
                <li v-for="(ing, i) in recipe.ingredients" :key="i">{{ing.toString()}}</li>
              </ul>
            </div>
          </div>
          <div class="column is-half">
            <hr class="is-hidden-tablet" />
            <div class="content">
              <p class="is-right">
                <span class="icon">
                  <i class="mdi mdi-timelapse"></i>
                </span>
                Estimated cooking time:
                <em>{{`${new Date(recipe.cookTime).getHours() * 60 + new Date(recipe.cookTime).getMinutes()} min`}}</em>
              </p>
            </div>

            <div class="content has-text-left">
              <h3 class="subtitle is-5">Directions</h3>
              <p v-html="recipe.instructions"></p>
            </div>
            <figure class="image">
              <img
                style="opacity: .1; bottom:0; left:0; margin-top:5rem; width:90%"
                :src="`${publicPath}images/decoration_ingredients2.svg`"
              />
            </figure>
          </div>
        </div>
      </div>

      <!-- <div class="section">
      <div class="container">
        <hr />
        <h2 class="title is-5">Reviews</h2>
      </div>
      </div>-->
      <b-loading :active.sync="isLoading" :is-full-page="false"></b-loading>
    </div>
  </span>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      // liked: false,
      activeImage: 0,
      gallery: false,
      isLoading: false,
      images: [],
      publicPath: process.env.BASE_URL
    };
  },
  computed: {
    ...mapGetters(["getRecipe", "getUser"]),
    recipe() {
      return this.getRecipe(this.$route.params.id);
    },
    author() {
      return this.getUser(this.recipe.author);
    },
    photos() {
      const arr = [];
      if (this.images) {
        this.images.forEach(img => {
          if (img.data !== undefined);
          arr.push(`data:image/jpeg;base64,${this.$encodeb64(img.data)}`);
        });
      }
      return arr;
    },
    liked() {
      if (this.$store.state.loggedIn) {
        if (this.$store.state.loggedIn.favorites !== undefined) {
          return this.$store.state.loggedIn.favorites.some(
            fav => fav === this.recipe._id
          );
        }
      }
      return false;
    }
  },
  // watch: {
  //   liked() {
  //     if (this.$store.state.loggedIn) {
  //       console.log(this.$store.state.loggedIn.favorites.some(this.recipe._id));
  //       this.liked = this.$store.state.loggedIn.favorites.some(this.recipe._id);
  //     }
  //   }
  // },
  methods: {
    ...mapActions(["fetchRecipe", "fetchUser", "updateFavorites"]),
    switchGallery(value) {
      this.gallery = value;
      if (value) {
        return document.documentElement.classList.add("is-clipped");
      } else {
        return document.documentElement.classList.remove("is-clipped");
      }
    },
    async toggleLike() {
      await this.updateFavorites(this.recipe._id);
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
      vm.images = vm.getRecipe(to.params.id).images;
      vm.isLoading = false;
    });
  },
  async created() {
    // await this.fetchRecipe(this.$route.params.id);
  }
};
</script>

<style lang="scss">
.blur-bcg {
  background-repeat: no-repeat;
  background-size: cover;
  background-color: $grey-dark;
  background-blend-mode: multiply;
  transition: background-image $speed;
}
</style>