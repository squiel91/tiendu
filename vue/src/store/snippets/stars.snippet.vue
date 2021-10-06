<template>
  <div class="star-reviews">
    <img v-for="i in Math.floor(roundedHalf)" :key="i" class="star" :class="{ small: small }" src="../assets/star-fill.svg">
    <img v-if="(roundedHalf % 1) > 0"  class="star" :class="{ small: small }" src="../assets/star-half.svg">
    <template v-if="5 >= Math.ceil(roundedHalf)">
      <img v-for="i in 5 - Math.ceil(roundedHalf)" :key="i + 40" class="star" :class="{ small: small }" src="../assets/star-empty.svg">
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Number,
        default: 0
      },
      small: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      roundedHalf () { return Math.round(this.value * 2) / 2 }, // rounded to half
    }
  }
</script>
