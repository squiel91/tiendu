<template>
  <div class="container">
    <Breadcrumb active="Busqueda" />
  </div>
  <Loading :status="status" />
  <template v-if="status === 'ready'">
    <div v-if="orderedProducts.length > 0" class="container">
      <div class="grid center mobile-1-tablet-and-up-3 mg-b-lg">
        <div class="span-2-col-tablet-and-up">
          {{ orderedProducts.length }} resultado{{ orderedProducts.length > 1 ? 's' : '' }} para tu busqueda.
        </div>
        <Input label="Orden" id="order-selector" v-model="order" :options="orderOptions" />
      </div>
      <ProductList :products="orderedProducts" empty="No hay productos para mostrar." />    
    </div>
    <div v-else class="empty-container">
      <img class="empty" src="../assets/no-found.svg" alt="">
      <p>Sin resultados para tu <strong>Busqueda</strong>.<br>Prueba con otros términos.</p>
    </div>
  </template>
</template>

<script>
  import Loading from '../snippets/fetching.snippet.vue'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'
  import ProductList from '../snippets/product-list.snippet.vue'
  import Input from '../snippets/input.snippet.vue'

  export default {
    data() {
      return {
        status: 'loading',
        products: [],
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
      this.fetchProducts()
    },
    methods: {
      async fetchProducts () {
        try {
          this.status = 'loading'
          const response = await this.axios(`products`, { params: { q: this.$route.query.q, publishedOnly: true, all: true } })
          this.products = response.data.products
          this.status = 'ready'
        } catch (error) {
          this.status = 'error'
          console.error(error)
        }
      }
    },
    computed: {
      orderedProducts () {
        switch (this.order) {
          case 'recomendado':
            return this.products.sort((a, b) => b.sold - a.sold)
          case 'precio':
            return this.products.sort((a, b) => a.price - b.price)
          case 'alfabetico':
            return this.products.sort((a, b) => a.title.localeCompare(b.title))
        }
      }
    },
    watch: {
      '$route.query.q' () {
        this.fetchProducts()
      }
    }
  }
</script>
