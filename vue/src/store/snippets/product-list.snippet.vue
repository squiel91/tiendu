<template>
  <div class="grid mobile-2-tablet-and-up-3 mobile-small-gap">
    <template v-if="products.length > 0">
      <ProductItem 
        v-for="(product, index) in products"
        :class="{ 
          'hide-tablet-and-up': itemsResponsive && index >= Math.floor(products.length / 3) * 3,
          'hide-mobile': itemsResponsive && index >= Math.floor(products.length / 2) * 2,
        }"
        :from="from"
        :product="product"
        :lazy="lazy"
        :key="product.id"
      />
    </template>
    <div v-else>{{ empty }}</div>
  </div>
</template>

<script>
  import ProductItem from './product-item.snippet.vue'

  export default {
    props: {
      products: {
        type: Array,
        default: []
      },
      lazy: {
        type: Boolean,
        default: true
      },
      itemsResponsive: {
        type: Boolean,
        default: false
      },
      empty: {
        type: String,
        default: 'No hay nada para mostrar.'
      },
      from: Object // { title: categoryTitle, handle: categoryHandle }
    },
    components: {
      ProductItem
    }
  }
</script>
