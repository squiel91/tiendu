<template>
  <div id="content-page" class="container">
    <breadcrumb active="Contenido" />
    <h1>Páginas</h1>
    <DynamicTable :cols="colPages" resource-name="pages" />
    <router-link :to="{ name: 'admin-content-pages-edit', params: { pageId: 'create' } }">
      <button class="primary">Nueva Página</button>
    </router-link>

    <h1 style="margin-top: 40px;">Blog</h1>
    <DynamicTable :cols="colPosts" resource-name="posts" />
    <router-link :to="{ name: 'admin-content-posts-edit', params: { postId: 'create' } }">
      <button class="primary">Nuevo Post</button>
    </router-link>
  </div>
</template>

<script type="module">
  import DynamicTable from '../snippets/dynamic-table.snippet.vue'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'

  import isAdmin from '../../common/utils/isAdmin'

  export default {
    beforeRouteEnter: isAdmin,
    title: 'Gestión de Contenido en tu Tiendu',
    components: {
      DynamicTable,
      Breadcrumb
    },
    data() {
      return {
        colPages: [
          { 
            label: 'Título',
            val: 'title',
            html: true,
            format: (title, page) => (page.published? '<i class="bi bi-circle-fill published" title="Publicado"></i>' : '<i class="bi bi-circle-fill not published" title="No publicado"></i>') + title?.replace( /(<([^>]+)>)/ig, '')
          },
          { label: 'Contenido', format: content => content?.replace( /(<([^>]+)>)/ig, ''), val: 'content' },
        ],
        colPosts: [
          { 
            label: 'Título',
            val: 'title',
            html: true,
            format: (title, page) => (page.published? '<i class="bi bi-circle-fill published" title="Publicado"></i>' : '<i class="bi bi-circle-fill not published" title="No publicado"></i>') + title?.replace( /(<([^>]+)>)/ig, '')
          },
          { label: 'Autor', format: author => author || '--', val: 'author' },
          { label: 'Contenido', format: content => content?.replace( /(<([^>]+)>)/ig, ''), val: 'content' },
          { label: 'Publicado', val: 'created' },
        ]
      }
    },
  }

</script>