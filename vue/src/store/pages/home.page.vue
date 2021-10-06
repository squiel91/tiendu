<template>
  <div id="home-page">
    <!-- <Attributes /> -->
    <!-- <section v-if="featuresStatus === 'ready' && featured.length > 0" class="container">
      <ProductList :products="featured" :lazy="false" />
    </section> -->
    <FeaturedCategories v-if="homeCategoriesStatus === 'ready' && featuredCategories.length > 0" :categories="featuredCategories" />
    <Fetching center :status="combinedStatus" /> 
    <template v-if="homeCategoriesStatus === 'ready' && homeCategories.length > 0">
      <Category v-for="homeCategory in homeCategories" :category="homeCategory.category" :title="homeCategory.alternativeTitle" :key="homeCategory" />
    </template>
    <Shipping />
    <Subscriptions />
    <!-- <Instagram /> -->
    <Reviews />
  </div>
</template>

<script>
  import Fetching from '../snippets/fetching.snippet.vue'
  import Attributes from '../sections/attributes.section.vue'
  import ProductList from '../snippets/product-list.snippet.vue'
  import FeaturedCategories from '../sections/featured-categories.section.vue'
  import Category from '../sections/category.section.vue'
  import Shipping from '../sections/shipping.section.vue'
  import Subscriptions from '../sections/subscriptions.section.vue'
  import Instagram from '../sections/instagram.section.vue'
  import Reviews from '../sections/reviews.sections.vue'
  import isDev from '../../common/utils/isDev.js'

  export default {
    data () {
      return {
        featuresStatus: 'fetching',
        featured: [],
        homeCategoriesStatus: 'fetching',
        featuredCategories: [],
        homeCategories: []
      }
    },
    components: {
      Fetching,
      Attributes,
      Category,
      FeaturedCategories,
      Shipping,
      Subscriptions,
      Instagram,
      Reviews,
      ProductList
    },
    created () {
      this.axios(`/products`, { params: {  featured: true, publishedOnly: true } })
        .then(response => {
          this.featured = response.data.products
          this.featuresStatus = 'ready'
        })
        .catch (error => {
          this.featuresStatus = 'error'
          console.error(error)
        })
      this.axios(`/customization/home-categories`)
        .then(response => {
          this.featuredCategories = response.data.featuredCategories
          this.homeCategories = response.data.homeCategories
          this.homeCategoriesStatus = 'ready'
        })
        .catch (error => {
          this.homeCategoriesStatus = 'error'
          console.error(error)
        })
    },
    computed: {
      combinedStatus () {
        if (this.featuresStatus === 'ready' && this.homeCategoriesStatus === 'ready') return 'ready'
        if (this.featuresStatus === 'error' || this.homeCategoriesStatus === 'error') return 'ready'
        return 'fetching'
      },
      devHost () {
        return isDev ? 'http://localhost:5001' : ''
      }
    }
  }
</script>
