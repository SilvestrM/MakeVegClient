<template>
  <article class="card">
    <figure class="card-image">
      <p class="image is-4by3">
        <img :src="recipe.imageURL" />
      </p>
    </figure>
    <div class="card-header">
      <div class="card-header-title is-centered">
        <h3 class="title is-4 is-capitalized">{{recipe.name}}</h3>
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
      <nav class="level is-mobile">
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
      </nav>
    </div>
    <div class="card-footer">
      <div class="card-footer-item">
        added on:
        <time
          :datetime="recipe.dateAdded"
        >{{`${recipe.dateAdded.getDate()}/${recipe.dateAdded.getMonth()}/${recipe.dateAdded.getFullYear()}`}}</time>
      </div>
      <div class="card-footer-item">
        <div class="rate is-hidden">{{rate = countAvg(recipe.ratings)}}</div>
        <b-rate disabled v-model="rate" icon="leaf" :max="5"></b-rate>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  props: ["recipe"],
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

<style>
</style>