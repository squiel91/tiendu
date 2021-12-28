<template>
  <router-link
    :to="{ 
      name: 'store-product',
      params: { productHandle: product.handle },
      query: from
    }"
    class="products-item-snippet" 
  >
    <div ref="productItem" class="front-product-image" :style="firstBackgroundImage">
      <div v-if="product.images?.length > 1" class="back-product-image" :style="secondBackgroundImage" />
      <div v-if="!inStock" class="out-of-stock" style="color: initial;">Agotado</div>
      <div v-if="discountPercentage" class="product-discount" style="color: initial;">
        {{ discountPercentage }}% OFF
      </div>
    </div>
    <div class="product-title">{{ product.title }}</div>
    <Stars :value="product.averageReview" :small="true" />
    <div class="product-price">
      {{ typeof product.price === 'number'? `$ ${product.price}` : `Desde $${product.price.min}` }}
      <span v-if="compareAt" class="compare-at">&nbsp;${{ compareAt }}&nbsp;</span>
    </div>
  </router-link>
</template>

<script>
  import Stars from './stars.snippet.vue'
  import isDev from '../../common/utils/isDev.js'
  
  export default {
    props: {
      product: Object,
      from: Object, // { title: categoryTitle, handle: categoryHandle }
      lazy: {
        type: Boolean,
        default: true
      }
    },
    created() {
      this.visible = !this.lazy
    },
    data() {
      return {
        visible: null
      }
    },
    components: {
      Stars
    },
    computed: {
      firstBackgroundImage () {
        if (this.visible && this.product?.images?.length > 0) {
          return { 'background-image': `url('${this.devHost}${this.product.images?.length > 0 ? this.product.images[0].thumbSrc : '/statics/assets/no-image.svg' }` }
        } else return {}
      },
      secondBackgroundImage () {
        if (this.visible && this.product) {
          return { 'background-image': `url('${this.devHost}${this.product.images[1].thumbSrc }')`}
        } else return {}
      },
      inStock () {
        return !this.product.hasVariants ? this.product.inStock : this.product.variants.reduce((accumulator, variant) => accumulator || variant.inStock, true)
      },
      compareAt () {
        return typeof this.product.compareAt === 'object' && this.product.compareAt !== null ? this.product.compareAt.aggregated : this.product.compareAt
      },
      discountPercentage () {
        if (!this.compareAt || typeof this.product.price !== 'number') return
        return ((1 - this.product.price / this.compareAt) * 100).toFixed(0)
      },
      devHost () {
        return isDev ? `http://${location.hostname}:5001` : ''
      }
    },
    mounted () {
      if (!this.lazy || !('IntersectionObserver' in window) ||
          !('IntersectionObserverEntry' in window) ||
          !('intersectionRatio' in window.IntersectionObserverEntry.prototype)) {
        // the browser doesn't support IntersectionObserver
        this.visible = true
      } else {
        (new IntersectionObserver(
          entries => {
            if (!this.visible && entries[0]?.isIntersecting) {
              this.visible = true  
            }
          },
          { rootMargin: "200px" }
        )).observe(this.$refs.productItem);
      }
    }
  }
</script>
