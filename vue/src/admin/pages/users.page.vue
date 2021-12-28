<template>
  <div id="users-page" class="container">
    <breadcrumb active="Usuarios" />
    <h1>Clientes</h1>
    <DynamicTable :cols="colUsers" resource-name="users" :link="false" />
  </div>
</template>

<script type="module">
  import DynamicTable from '../snippets/dynamic-table.snippet.vue'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'

  import isAdmin from '../../common/utils/isAdmin'

  export default {
    beforeRouteEnter: isAdmin,
    title: 'Gestión de Usuarios en tu Tiendu',
    components: {
      DynamicTable,
      Breadcrumb
    },
    data() {
      return {
        colUsers: [
          { 
            label: 'Nombre', 
            val: 'firstName',
            format: (firstName, user) => firstName + ' ' + user.lastName 
          },
          { label: 'Email', val: 'email' },
          { label: '# Canasta', val: 'cart', format: cart => cart?.length || '-' },
          { label: 'Desde', val: 'since', hideMobile: true }
        ],
        colAdmins: []
      }
    },
  }

</script>