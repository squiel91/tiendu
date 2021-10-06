<template>
  <div class="container">
    <Breadcrumb :stack="[{ label: 'Ingresar', to: { name: 'store-login' } }]" active="Restablecer" />
  </div>
  <div id="request-new-password-page" class="container">
    <h1>Restablece tu contraseña</h1>
    <div class="grid mobile-1-tablet-and-up-2">
      <Input id="password" type="password" v-model="password" :error="passwordError" label="Nueva contraseña" @clear-error="passwordError = null" />
      <div v-if="error" class="first-column error-message">{{ error }}</div>
      <div class="first-column">
        <Button text="Cambiar contraseña" :success="success" :loading="loading" @click="resetPassword" />
      </div>
      <div class="first-column">¿Recordaste tu constraseña? <router-link :to="{ name: 'store-login' }">Ingresa</router-link></div>
    </div>
  </div>
</template>

<script>

  import validatorMixin from '../../common/utils/validator.mixin'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'
  import Input from '../snippets/input.snippet.vue'
  import Button from '../snippets/button.snippet.vue'
  
  export default {
    props: ['resetToken'],
    mixins: [validatorMixin],
    data () {
      return {
        password: null,
        passwordError: null,
        loading: false,
        success: null,
        error: null
      }
    },
    components: {
      Breadcrumb,
      Input,
      Button
    },
    methods: {
      async resetPassword () {
        this.error = null
        this.passwordError = null

        if (!this.validPassword(this.password)) {
          return this.passwordError = 'La contraseña debe tener al menos 6 caracteres'
        }
        this.loading = true
        try {
          await this.axios.post('account/reset-password', { password: this.password, passResetToken: this.resetToken })
          this.success = 'Contraseña cambiada'
          setTimeout(() => {
            this.$router.push({ name: 'store-login' })
          }, 2000)
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