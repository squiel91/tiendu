<template>
  <div id="categories-page" class="container">
    <breadcrumb active="Categorías" />
    <h1>Categorías</h1>
    <DynamicTable :cols="cols" resource-name="categories" />

    <router-link :to="{ name: 'admin-categories-edit', params: { categoryId: 'create' } }">
      <button class="primary">Nueva Categoría</button>
    </router-link>    
  </div>
</template>

<script type="module">
  import DynamicTable from '../snippets/dynamic-table.snippet.vue'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'

  import isAdmin from '../../common/utils/isAdmin'

  export default {
    beforeRouteEnter: isAdmin,
    title: 'Gestión de Categorías en tu Tiendu',
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
            format: (title, category) => (category.listed? '<i class="bi bi-circle-fill published" title="Publicado"></i>' : '<i class="bi bi-circle-fill not published" title="No publicado"></i>') + title.replace( /(<([^>]+)>)/ig, '') 
          },
        { label: '# Productos', val: 'products', format: products => products.length }
        ]
      }
    },
  }
</script>