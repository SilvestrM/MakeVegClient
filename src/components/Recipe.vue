<template>
  <article class="card">
    <figure class="card-image">
      <p class="image is-4by3">
        <img :src="imgData" />
      </p>
    </figure>
    <div class="card-header">
      <div class="card-header-title is-centered">
        <h3 class="title is-5 is-capitalized">{{recipe.name}}</h3>
      </div>
    </div>
    <div class="card-content">
      <div class="content tags">
        <span
          v-for="(type, index) in recipe.dietTypes"
          :index="index"
          :key="index"
          class="tag is-medium"
        >{{type}}</span>
      </div>
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
    <div class="card-footer">
      <div class="card-footer-item">
        <span>
          Added
          <time
            :datetime="recipe.createdAt"
          >{{new Date(recipe.createdAt).toLocaleDateString()}}</time>
        </span>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  props: ["recipe"],
  computed: {
    imgData() {
      return this.recipe.images.length > 0
        ? `data:image/jpeg;base64,${this.$encodeb64(
            this.recipe.images[0].data
          )}`
        : "";
    }
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
  transition: $speed;
  &:hover {
    box-shadow: 0 0.5em 1em -0.125em rgba($black, 0.1),
      0 0px 0 1px rgba($black, 0.02);
    transition: $speed;
  }
}
</style>