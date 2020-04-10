<template>
  <div class="section">
    <p>{{user.firstName}} Test</p>
  </div>
</template>

<script>
export default {
  props: ["user"],
  mounted() {
    console.log(this.user);
  }
};
</script>

<style>
</style>