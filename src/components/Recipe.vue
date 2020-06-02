<template>
  <article class="card">
    <figure class="card-image">
      <b-skeleton height="15rem" :active="isLoading"></b-skeleton>
      <p v-show="!isLoading" class="image is-4by3">
        <!-- <img :src="imgData" /> -->
        <ImageLazy
          :title="recipe.name"
          :alt="`${recipe.name} photo`"
          :src="imgData"
          :delay="400"
          @loading="isLoading = true"
          @load="isLoading = false"
        />
      </p>
      <div class="tags" v-show="!isLoading" style="position:absolute;top:0; padding: 0.25em .5em">
        <span
          v-for="(type, index) in recipe.dietTypes"
          :index="index"
          :key="index"
          class="tag is-primary has-text-weight-medium"
        >{{type}}</span>
      </div>
    </figure>
    <div class="card-header is-shadowless">
      <div class="card-header-title is-centered">
        <b-skeleton height="2rem" :active="isLoading"></b-skeleton>
        <h3 v-show="!isLoading" class="title is-5 is-capitalized">{{recipe.name}}</h3>
      </div>
    </div>
    <div class="card-content is-flex is-column">
      <b-skeleton height="3rem" :active="isLoading"></b-skeleton>

      <p
        class="is-size-7"
        v-show="!isLoading"
      >{{recipe.description.length > 150 ? recipe.description.substring(0,149) + "..." : recipe.description}}</p>
      <!-- <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item">
            <span class="icon is-small">
              <i class="fas fa-reply"></i>
            </span>
          </a>
          <a class="level-item">
            <span class="icon is-small">
              <i class="fas fa-retweet"></i>
            </span>
          </a>
          <a class="level-item">
            <span class="icon is-small">
              <i class="fas fa-heart"></i>
            </span>
          </a>
        </div>
      </nav>-->
    </div>
    <div style="margin-top:1rem;align-self:flex-end;padding:.5em 1rem">
      <b-skeleton width="20%" height="1.25rem" :active="isLoading"></b-skeleton>
      <p v-show="!isLoading" class="is-size-7 has-text-grey is-italic has-text-right">
        Added
        <time :datetime="recipe.createdAt">{{new Date(recipe.createdAt).toLocaleDateString()}}</time>
      </p>
    </div>
  </article>
</template>

<script>
export default {
  props: ["recipe"],
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    imgData() {
      return this.recipe.images.length > 0
        ? `data:image/jpeg;base64,${this.$encodeb64(
            this.recipe.images[0].data
          )}`
        : "";
    }
  },
  mounted() {
    if (this.recipe.images.length == 0) this.isLoading == false;
  },
  methods: {
    countAvg(arr) {
      if (arr && arr.length > 0)
        return (
          Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
        );
    }
  }
};
</script>

<style lang="scss" scoped>
.card-image .image img {
  object-fit: cover !important;
}
.card {
  box-shadow: 0 0.5em 1em -0.125em rgba($grey, 0.1),
    0 0px 0 1px rgba($grey, 0.02);
  .card-content {
    min-height: 8rem;
    padding: 0 1em;
  }
  transition: $speed;
  &:hover {
    box-shadow: 0 0.5em 1em -0.125em rgba($black, 0.1) !important;
    transition: $speed;
  }
}
</style>