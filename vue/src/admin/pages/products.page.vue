<template>
  <div id="products-page" class="container">
    <breadcrumb active="Productos" />
    <h1>Lista de productos</h1>
    <DynamicTable :cols="cols" resource-name="products" />
    <router-link :to="{ name: 'admin-products-edit', params: { productId: 'create' } }">
      <button class="primary">Nuevo Producto</button>
    </router-link>
  </div>
</template>

<script type="module">
  import DynamicTable from '../snippets/dynamic-table.snippet.vue'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'

  import isAdmin from '../../common/utils/isAdmin'

  export default {
    beforeRouteEnter: isAdmin,
    title: 'Gestión de Productos en tu Tiendu',
    components: {
      DynamicTable,
      Breadcrumb
    },
    data() {
      return {
        cols: [
          { 
            label: 'Título', 
            val: 'title',
            span: 2,
            html: true,
            format: (title, product) => (product.published? '<i class="bi bi-circle-fill published" title="Publicado"></i>' : '<i class="bi bi-circle-fill not published" title="No publicado"></i>') + title.replace( /(<([^>]+)>)/ig, '') },
          { label: 'Stock', html: true, val: 'stock', format: stock => {
            stock = typeof stock === 'object' && stock !== null ? stock.aggregated : stock
            if (stock === null) return '∞'
            if (stock === undefined) return '--'
            return stock // is a number 
          }},
          { label: 'Precio', val: 'price', format: price => '$ ' + (typeof price === 'number' ? price : `${price.min}~${price.max}`) },
        ] 
      }
    },
  }

</script>