<template>
  <div class="container">
    <Breadcrumb :active="category?.title" />
  </div>
  <Loading :status="status" />
  <template v-if="status === 'ready'">
    <div v-if="category?.image" class="category-banner" :style="{ 'background-image': `url('${devHost}${category.image.src}')` }"></div>
    <div v-if="category" class="container">
      <div class="category-info-grid">
        <div class="categoryTitleDescription">
          <h1 class="categoryTitle">{{ category.title }}</h1>
          <div v-if="category.description?.length > 0" v-html="category.description" class="store__category__description" />
        </div>
        <Input label="Orden" id="order-selector" v-model="order" :options="orderOptions" />
      </div>
      <ProductList v-if="categoryProducts.length > 0" :products="categoryProducts" :from="{ title: category.title, handle: category.handle }" empty="No hay productos en esta categoría aún." />    
    </div>
    <div v-if="categoryProducts.length === 0" class="empty-container">
      <img class="empty" src="../assets/no-found.svg">
      <p>Esta categoría está <strong>vacía</strong><br>por el momento.</p>
    </div>
  </template>
</template>

<script>
  import Loading from '../snippets/fetching.snippet.vue'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'
  import ProductList from '../snippets/product-list.snippet.vue'
  import Input from '../snippets/input.snippet.vue'

  import isDev from '../../common/utils/isDev.js'


  export default {
    props: ['categoryHandle'],
    emits: ['resourceIdChanged'],
    data() {
      return {
        status: 'loading',
        category: null,
        categoryProducts: [],
        orderOptions: [
          { value: 'recomendado', text: 'Recomendado' },
          { value: 'precio', text: 'Precio (económico primero)' },
          { value: 'alfabetico', text: 'Alfabético' }
        ],
        order: 'recomendado'
      }
    },
    components: {
      Loading,
      Breadcrumb,
      ProductList,
      Input
    },
    created () {
      this.fetchCategory()
    },
    methods: {
      async fetchCategory () {
        try {
          this.category = null
          this.status = 'loading'
          const response = await this.axios(`categories/${this.categoryHandle}`, { params: { handle: true } })
          this.category = response.data.category
          this.categoryProducts = this.category.products
          this.$emit('resourceIdChanged', this.category.id)
          this.status = 'ready'
        } catch (error) {
          this.status = 'error'
          console.error(error)
        }
      }
    },
    watch: {
      categoryHandle () {
        this.fetchCategory()
      },
      order(newOrder) {
        // Before I was calling the API every time the order changed, now I do it locally
        // location.href = `${location.protocol}//${location.host}${location.pathname}?orden=${newOrder}`
        switch (newOrder) {
          case 'recomendado':
            this.categoryProducts = this.categoryProducts.sort((a, b) => b.sold - a.sold)
            break
          case 'precio':
            this.categoryProducts = this.categoryProducts.sort((a, b) => a.price - b.price)
            break
          case 'alfabetico':
            this.categoryProducts = this.categoryProducts.sort((a, b) => a.title.localeCompare(b.title))
        }
      }
    },
    computed: {
      devHost () {
        return isDev ? `http://${location.hostname}:5001` : ''
      }
    }
  }
</script>


