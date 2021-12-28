<template>
  <div class="container">
    <Breadcrumb :stack="[{ label: 'Ingresar', to: { name: 'store-login' } }]" active="Restablecer" />
  </div>
  <div id="request-new-password-page" class="container">
    <h1>Restablece tu contraseña</h1>
    <div v-if="!sent" class="grid center mobile-1-tablet-and-up-2">
      <Input id="email" v-model="email" :error="emailError" label="Email" @clear-error="emailError = null" />
      <div>Te enviaremos un email con un link para restablecerla.</div>
      <div v-if="error" class="first-column error-message">{{ error }}</div>
      <div class="first-column">
        <Button text="Enviar email" :loading="loading" @click="requestPasswordReset" />
      </div>
      <div class="first-column">¿Recordaste tu constraseña? <router-link :to="{ name: 'store-login', query: { from } }">Ingresa</router-link></div>
    </div>
    <p v-else>Ya te enviamos un email a <b>{{ email }}</b> con un link para restablecer tu contraseña.</p>
  </div>
</template>

<script>

  import validatorMixin from '../../common/utils/validator.mixin'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'
  import Input from '../snippets/input.snippet.vue'
  import Button from '../snippets/button.snippet.vue'
  
  export default {
    mixins: [validatorMixin],
    data () {
      return {
        email: null,
        emailError: null,
        loading: false,
        sent: false,
        error: null
      }
    },
    components: {
      Breadcrumb,
      Input,
      Button
    },
    computed: {
      from () {
        return this.$route.query.from
      }
    },
    methods: {
      async requestPasswordReset () {
        this.error = null
        this.emailError = null

        if (!this.validEmail(this.email)) {
          return this.emailError = 'El email no parece ser válido'
        }
        this.loading = true
        try {
          await this.axios.post('/account/request-password-reset', { email: this.email })
          this.sent = true
        } catch (error) {
          if (!error.response)
            return this.error = 'No nos pudimos conectar al servidor. Intentalo nuevamente.'
          this.error = error.response.data?.error
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>