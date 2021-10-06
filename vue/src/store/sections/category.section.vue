<template>
  <section class="container category-section">
    <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 60px;">
      <h1 style="margin: 0 16px 0 0; padding-bottom: 8px;">{{ title || category.title }}</h1>
      <div><router-link class="see-more" :to="{ name: 'store-category', params: { categoryHandle: category.handle } }">Ver más <i class="bi bi-arrow-right"></i></router-link></div>
    </div>
    <ProductList :from="{ title: category.title, handle: category.handle }" :products="category.products" />
  </section>
</template>

<script>
  import ProductList from '../snippets/product-list.snippet.vue'

  export default {
    props: ['category', 'title'],
    components: {
      ProductList
    }
  }
</script>