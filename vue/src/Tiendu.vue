<template>
  <router-view />
</template>

<script>
export default {
  beforeCreate() {
    this.$store.commit('initializeStore')
  }
}
</script>

<style lang="scss">
  body {
    font-family: 'Karla', sans-serif;
    margin: 0;
  }

  a {
    text-decoration: none;
  }
  
  /* container */

  .container {
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 12px;
  }

  @media screen and (max-width: 1400px) {
    .container {
      max-width: 1140px;
    }
  }
  @media screen and (max-width: 1200px) {
    .container {
      max-width: 960px;
    }
  }
  @media screen and (max-width: 992px) {
    .container {
      max-width: 720px;
    }
  }
  @media screen and (max-width: 768px) {
    .container {
      max-width: 540px;
    }
  }
  @media screen and (max-width: 576px) {
    .container {
      max-width: 100%;
    }
  }


</style>