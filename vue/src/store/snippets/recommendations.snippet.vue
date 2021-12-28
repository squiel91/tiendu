<template>
  <div class="recommendations-snippet">
    <h2 v-if="productIdsToFetch.length > 0">También te puede interesar</h2>
    <h2 v-else>Te puede interesar</h2>
    <ProductList :products="recommendedProducts" items-responsive />
  </div>
</template>

<script>
  import ProductList from '../snippets/product-list.snippet.vue'

  export default {
    props: {
      productIds: {
        type: Array,
        default: []
      },
      productId: String
    },
    computed: {
      productIdsToFetch() {
        if (this.productIds?.length > 0) {
          return this.productIds
        }
        if (this.productId) {
          return [this.productId]
        }
        return []
      }
    },
    watch: {
      productIdsToFetch () {
        this.fetchRecommendedProducts()
      }
    },
    created () {
      this.fetchRecommendedProducts()
    },
    data() {
      return {
        recommendedProducts: []
      }
    },
    components: {
      ProductList
    },
    methods: {
      async fetchRecommendedProducts() {
        try {
          const response = await this.axios('recommendations/products', { params: { products: this.productIdsToFetch } })
          this.recommendedProducts = response.data.recommendedProducts
        } catch (error) {
          console.error('Could not show the recommendations', error)
        }
      }
    }
  }
</script>
