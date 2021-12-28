<template>
  <div class="container">
    <Breadcrumb :stack="$route.query.from === 'account' ? [{ label: 'Cuenta', to: { name: 'store-account' } }] : []" :active="order && `Orden #${ order.number }`" />
  </div>
  <Loading :status="status" />
  <div v-if="status === 'ready'" class="container" id="printable">
    <h1 v-html="orderTitle"></h1>
    <p v-if="orderSubtitle" v-html="orderSubtitle" class="mb-5" />

    <div class="grid mobile-1-tablet-and-up-2">
      <div>
        <table>
          <tr>
            <th>Estado*</th>
            <td><span class="badge bg-primary" style="text-transform: uppercase;">{{ order.status }}</span></td>
          </tr>
          <tr>
            <th>Fecha</th>
            <td>{{ order.prettyCreated }}</td>
          </tr>
          <tr>
            <th>Nombre</th>
            <td>{{ order.personal.firstName }}</td>
          </tr>
          <tr>
            <th>Contacto</th>  
            <td>
              {{ order.personal.phone }} /
              {{ order.personal.email  }} 
            </td>      
          </tr>
          <tr>
            <th>Pagado</th>  
            <td>$ {{ order.billed }} <span v-if="order.discount?.coupon">({{ order.discount.description || order.discount.coupon }}</span></td>      
          </tr>
          <tr>
            <th>Envío</th>  
            <td><span class="badge bg-secondary" style="text-transform: uppercase;">Gratis</span> {{ order.shipping.address }}, {{ order.shipping.neighborhood }} ({{ order.shipping.state }})</td>      
          </tr>
          <tr v-if="order.shipping.tracking">
            <th>Tracking</th>
            <td>
              {{ order.shipping.tracking }}
            </td>
          </tr>
        </table>
        <p class="tip" style="margin-top: 16px;">
          (*) Te enviaremos un email cada vez que tu orden cambie de estado.
          En caso de duda escribinos a <a target="_blank" href="https://api.whatsapp.com/send?phone=59899579667">nuestro WhatsApp</a>, <a target="_blank" href="mailto:info@tiendu.uy">info@tiendu.uy</a> o llamando al <a href="tel:+099579667">099 579 667</a>.
        </p>
      </div>
      <div>
        <table>
          <tr>
            <th>Producto</th>
            <th>Precio unitario</th>
            <th>Cantidad</th>
          </tr>
          <tr v-for="item in order.items" :key="item">
            <td>
              <router-link :to="{ name: 'store-product', params: { productHandle: item.handle } }">{{ item.title }}</router-link>
              <span v-if="item.variant"><br>{{ item.variant }}</span>
            </td>
            <td>$ {{ item.unitPrice }}</td>
            <td>{{ item.quantity }}</td>
          </tr>
        </table>
      </div>
      <div class="hide-print span-all-cols">
        <Button text="Imprimir orden" secondary @click="print" />
      </div>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'
  import Loading from '../snippets/fetching.snippet.vue'
  import Button from '../snippets/button.snippet.vue'

  export default {
    props: ['orderId'],
    components: {
      Breadcrumb,
      Loading,
      Button
    },
    data() {
      return {
        status: 'loading',
        order: undefined
      }
    },
    computed: {
      orderTitle () {
        if (!this.order) return
        if (this.order.status === 'impaga') return `Paga $ ${this.order.billed} en el <span style="text-transform: capitalize;">${this.order.paymentMethod}</span> más cercano para completar tu compra.`
        if (this.order.status === 'procesando pago') return 'Aún no podemos confirmar tu pago.'
        if (this.order.paymentMethod === 'card' && this.order.status === 'a confirmar') return '¡Hemos recibido tu pedido!'
        return 'Orden'
      },
      orderSubtitle () {
        if (!this.order) return
        if (this.order.status === 'impaga') return 'Decile al cajero que es un <b>pago para MercadoPago</b> con tu <b>número de documento</b>. Tenés hasta 72 horas para realizar el pago, de lo contrario tu orden será cancelada.'
        if (this.order.status === 'procesando pago') return 'Aguardamos ahora la confirmación de la compañia de tu tarjeta, que debería ser a la brevedad. Te informaremos a tu email enseguida nos llegue la confirmacón (o rechazo) de pago.'
        if (this.order.paymentMethod === 'card' && this.order.status === 'a confirmar') return 'Recibirás un email con la confirmación de tu orden a la brevedad.'
      }
    },
    async created() {
      try {
        const response = await this.axios.get(`orders/${this.orderId}`)
        this.order = response.data.order
        this.orderTitle = this.order.status === 'pending' ? 'Orden pendiente' : 'Orden confirmada'
        this.orderSubtitle = this.order.status === 'pending' ? 'Esta orden está pendiente de pago' : 'Esta orden ya fue confirmada'
        this.status = 'ready'
      } catch (error) {
        console.error(error)
        this.status = 'error'
      }
    },
    methods: {
      print () {
        window.print()
      }
    }
  }

</script>
