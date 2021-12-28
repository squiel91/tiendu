<template>
  <div id="404-page" class="container">
    <breadcrumb active="404" />
    <h1>Página no encontrada</h1>
    <p>Parece que la página que buscas (ya) no exite. Si pensas que no es tu error, te podés comunicar con el <a href="https://tiendu.uy">soporte de Tiendu</a>.</p>
  </div>
</template>

<script type="module">
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'

  import isAdmin from '../../common/utils/isAdmin'

  export default {
    beforeRouteEnter: isAdmin,
    title: 'Página no encontrada',
    components: {
      Breadcrumb
    }
  }
</script>