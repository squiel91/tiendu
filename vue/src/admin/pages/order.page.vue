<template>
  <div id="order-page" class="container">
    <Breadcrumb :stack="[{ label: 'Órdenes', routerLink: { name: 'admin-orders' } }]" active="Detalle" />
    <div style="display: flex;">
      <h1 style="flex-grow: 1;">Orden <span class="number">#{{ order?.number }}</span></h1>
      <div>
        <SecondaryButton @click="remove()">
          <div>
            <span class="hide-mobile">
              Borrar
            </span>
            <i class="hide-tablet-and-up bi bi-trash-fill"></i>
          </div>
        </SecondaryButton>
      </div>
    </div>
    <div class="feedback" v-if="error">
      <i class="bi bi-plug-fill"></i> Ocurrió un error
    </div>
    <div class="feedback" v-if="!error && !order">
      <i class="bi bi-watch"></i> Cargando...
    </div>
    <div v-if="!error && order">
      <div class="order-container">
        <div>
          <h2>General</h2>
          <div class="vert-table">
            <div class="row">
              <div class="col header">
                Nombre
              </div>
              <div class="col">
                {{ order.personal.fullName }}
              </div>
            </div>
            <div v-if="order.personal?.idNumber" class="row">
              <div class="col header">
                Documento
              </div>
              <div class="col">
                {{ order.personal.idNumber }} ({{ order.personal.idType }})
              </div>
            </div>
            <div class="row">
              <div class="col header">
                Teléfono
              </div>
              <div class="col">
                {{ order.personal.phone }}
              </div>
            </div>
            <div class="row">
              <div class="col header">
                Email
              </div>
              <div class="col">
                {{ order.personal.email }}
              </div>
            </div>
            <div class="row">
              <div class="col header">
                Facturado
              </div>
              <div class="col">
                ${{ order.billed }} ({{ order.paymentMethod }})
              </div>
            </div>
            <div v-if="order.discount?.code" class="row">
              <div class="col header">
                Descuento
              </div>
              <div class="col">
                <router-link style="font-weight: bold; color: blue;" :to="{ name: 'admin-marketing-coupons-edit', params: { couponId: order.discount.id } }">{{ order.discount.code }}</router-link>
                {{ order.discount.description }}
              </div>
            </div>
            <div class="row">
              <div class="col header">
                Fecha
              </div>
              <div class="col">
                {{ order.createdFull }}
              </div>
            </div>
            <div class="row">
              <div class="col header">
                Estado
              </div>
              <div class="col">
                <Input v-model="status" id="status-select" :options="statusOptions"></Input>
              </div>
            </div>
          </div>
        </div>
        <div v-if="order.shipping">
          <h2>Envío</h2>
          <div class="vert-table">
            <div class="row">
              <div class="col header">
                Dirección
              </div>
              <div class="col">
                {{ order.shipping.address }}, {{ order.shipping.neighbourhood }}, {{ order.shipping.state }}
              </div>
            </div>
            <div class="row">
              <div class="col header">
                Tracking
              </div>
              <div class="col">
                <Input id="tracking-input" v-model="tracking"></Input>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <h2>Entrega</h2>
          <div class="vert-table">
            <div class="row">
              <div class="col header">
                Tipo
              </div>
              <div class="col">
                Retiro en persona
              </div>
            </div>
          </div>
        </div>
        <div class="items-container">
          <h2>Items</h2>
          <StaticTable :items="order.items" mainId="originalProduct" :link="item => `/admin/products/${item.originalProduct}`" :cols="itemsCol"></StaticTable>
        </div>
      </div>
      <Button @click="save()" ref="mainButton" :loading="loading" normal-text="Guardar cambios" :disabled="!hasChanged"></Button>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'
  import Input from '../snippets/input.snippet.vue'
  import StaticTable from '../snippets/static-table.snippet.vue'
  import Button from '../snippets/button.snippet.vue'
  import SecondaryButton from '../snippets/secondary-button.snippet.vue'
  
  import isAdmin from '../../common/utils/isAdmin'

  export default {
    beforeRouteEnter: isAdmin,
    props: ['orderId'],
    data() {
      return {
        order: undefined,
        error: false,
        tracking: undefined,
        status: undefined,
        statusOptions: [
          'impaga',
          'procesando pago',
          'a confirmar',
          'confirmada',
          'pausada',
          'enviada',
          'lista para retirar',
          'completada',
          'reembolsada',
          'cancelada'
        ],
        itemsCol: [
          { label: 'Producto', val: 'title', format: (title, item) => title + (item.variant? `: ${item.variant}` : '') , style: { 'grid-column': 'span 2' } },
          { label: 'Unidad', val: 'unitPrice', format: price => '$' + price },
          { label: 'Cantidad', val: 'quantity' }
        ],
        loading: false
      }
    },
    methods: {
      async save() {
        try {
          this.loading = true
          const response = await this.axios.patch(`orders/${this.orderId}`, {
            status: this.status,
            tracking: this.order.shipping? this.tracking : undefined,
            _csrf: 'help',
          })
          this.$refs.mainButton.isSuccess()
          this.loading = false
        } catch (error) {
          console.error('There was an error processing the order')
          this.loading = false
          console.error(error)
        }
      },
      async remove() {
        try {
          const response = await this.axios.delete(`/orders/${this.orderId}`)
          this.$router.push({ name: 'admin-orders' })

        } catch (error) {
          alert('Ocurrió un error al borrar la orden')  
          console.error(error)
        }
      }
    },
    computed: {
      hasChanged () {
        return this.status !== this.order.status || (this.order.shipping && this.tracking !== this.order.shipping.tracking)
      }
    },
    async created () {
      try {
        const response = await this.axios.get(`orders/${this.orderId}`)

        this.order = response.data.order
        this.status = this.order.status
        if (this.order.shipping) {
          if (!this.order.shipping.tracking) this.order.shipping.tracking = '' 
          this.tracking = this.order.shipping.tracking
        }
      } catch (error) {
        this.error = true
        console.error(error)
      }
    },
    components: {
      Breadcrumb,
      Input,
      StaticTable,
      Button,
      SecondaryButton
    }
  }
</script>

