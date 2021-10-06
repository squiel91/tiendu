<template>
  <div id="dashboard-page" class="container">
    <breadcrumb active="Resúmen" />
    <h1>Úlitmas órdenes</h1>
    <DynamicTable :params="params" :cols="cols" resource-name="orders" />
  </div>
</template>

<script type="module">
  import DynamicTable from '../snippets/dynamic-table.snippet.vue'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'

  import isAdmin from '../../common/utils/isAdmin'

  export default {
    beforeRouteEnter: isAdmin,
    title: 'Resúmen de tu Tiendu',
    components: {
      DynamicTable,
      Breadcrumb
    },
    data() {
      return {
        cols: [
          { label: '#', val: 'number' },
          { label: 'Cliente', val: 'personal.fullName', span: 3},
          { label: 'Email', hideMobile: true, val: 'personal.email', span: 3 },
          { label: 'Facturado', format: value => '$' + value, val: 'billed', span: 2 },
          { label: 'Fecha', hideMobile: true, val: 'created', span: 2 },
          { label: 'Estado', val: 'status', span: 2, html: true, format: status => `<span class="status-chip ${status.replace(' ', '-')}">${status}</span>` }
        ],
        params: { status: ['impaga', 'procesando pago', 'a confirmar', 'confirmada'] }
      }
    }
  }

</script>