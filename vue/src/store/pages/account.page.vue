<template>
  <div class="container">
    <Breadcrumb active="Cuenta" />
  </div>
  <Loading :status='status' />
  <div v-if="status === 'ready'" id="account-page" class="container">
    <h1 style="margin-bottom: 0">Mi cuenta</h1>
    <div class="grid mobile-1-tablet-and-up-2 mobile-small-tablet-and-up-big-gap">
      <div>
        <h2>General</h2>
        <table>
          <tr>
            <th>Nombre</th>
            <td>{{ user.firstName }}</td>
          </tr>
          <tr>
            <th>Apellido</th>
            <td>{{ user.lastName }}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{{ user.email }}</td>
          </tr>
          <tr>
            <th>Contraseña</th>
            <td><router-link :to="{ name: 'store-request-new-password' }">Cambiar contraseña</router-link></td>
          </tr>
        </table>
      </div>
      <div>
        <h2>Mis órdenes</h2>

        <table v-if="user.orders && user.orders.length > 0">
          <tr>
            <th>Fecha</th>
            <th>Facturado</th>
            <th>Estado</th>
          </tr>
          <tr v-for="order in user.orders.slice().reverse()" :key="order">
            <td>
              <router-link :to="{ name: 'store-order', params: { orderId: order.id}, query: { from: 'account'} }">
                {{ order.prettyCreated }}
              </router-link>
            </td>
            <td>$ {{ order.billed }}</td>
            <td><span class="badge bg-primary" style="text-transform: uppercase;">{{ order.status }}</span></td>
          </tr>
        </table>
        <p v-else>Aún no tienes ninguna orden</p>
      </div>
      <div>
        <Button text="Cerrar sesión" secondary @click="logoutUser"></Button>
      </div>
    </div>
  </div>
  
</template>


<script>
  import Loading from '../snippets/fetching.snippet.vue'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'
  import Button from '../snippets/button.snippet.vue'
  import logoutMixin from '../../common/utils/logoutMixin.js'
  import isUser from '../../common/utils/isUser'

  export default {
    beforeRouteEnter: isUser,
    components: {
      Loading,
      Breadcrumb,
      Button
    },
    data() {
      return {
        status: 'loading',
        user: undefined
      }
    },
    mixins: [
      logoutMixin // includes logout function
    ],
    methods: {
      logoutUser () {
        this.logout()
        this.$router.push({ name: 'store-home' })
      }
    },
    async created() {
      try {
        const response = await this.axios.get('account')
        this.user = response.data.user
        this.status = 'ready'
      } catch (error) {
        console.error(error)
        this.status = 'error'
      }
    }
  }
</script>
