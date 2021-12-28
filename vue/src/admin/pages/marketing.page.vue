<template>
  <div id="marketing-page" class="container">
    <Breadcrumb active="Marketing" />
    <h1>Cupones</h1>
    <DynamicTable :cols="colCoup" resource-name="coupons" />
    <router-link :to="{ name: 'admin-marketing-coupons-edit', params: { couponId: 'create' } }">
      <button class="primary">Nuevo Cupón</button>
    </router-link>

    <h1 style="margin-top: 40px;">Subscriptores</h1>
    <DynamicTable :cols="colSubsc" resource-name="subscriptions" :link="false" />
  </div>
</template>

<script type="module">
  import DynamicTable from '../snippets/dynamic-table.snippet.vue'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'

  import isAdmin from '../../common/utils/isAdmin'

  export default {
    beforeRouteEnter: isAdmin,
    title: 'Gestión de Marketing de tu Tiendu',
    components: {
      DynamicTable,
      Breadcrumb
    },
    data() {
      return {
        colCoup: [
          {
            label: 'Código',
            val: 'code',
            html: true,
            format: (code, coupon) => (coupon.active && (!coupon.maxUses || coupon.timesUsed < coupon.maxUses) ? '<i class="bi bi-circle-fill published" title="Publicado"></i>' : '<i class="bi bi-circle-fill not published" title="No publicado"></i>') + code
          },
          { label: 'Descripción', val: 'description', hideMobile: true },
          { label: 'Descuento', format: (_, coupon) => coupon.percentage? coupon.percentage + '%' :  '$' + coupon.amount },
          { 
            label: '# Usos',
            val: 'timesUsed',
            format: (timesUsed, coupon) => timesUsed + (coupon.maxUses ? ` / ${coupon.maxUses}` : '')
          }
        ],
        colSubsc: [
          { label: 'Email', val: 'email' },
          { label: 'Desde', val: 'since' }
        ]
      }
    }
  }
</script>