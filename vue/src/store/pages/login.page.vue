<template>
  <div class="container">
    <Breadcrumb active="Ingresar" />
    <h1>Ingresa al Vivero</h1>
    <div class="grid center mobile-1-tablet-and-up-2">
      <Input id="email" v-model="email" @clear-error="emailError = null" :error="emailError" label="Email" />
      <Input id="password" v-model="password" @clear-error="passwordError = null" :error="passwordError" label="Constraseña" type="password" class="first-col" />
      <div>¿Olvidaste tu contraseña? <router-link :to="{ name: 'store-request-new-password', query: { from } }">Restablécela</router-link></div>
      <div class="first-col">
        <input v-model="remember" type="checkbox" id="remember"> <label for="remember">Recordarme en este dispositivo</label>
      </div>
      <div v-if="error" class="first-column error-message">{{ error }}</div>
      <div class="first-column">
        <Button text="Inicia sesión" :success="success" :loading="loading" @click="login"></Button>
      </div>
      <div class="first-column">¿No tenés una cuenta? <router-link :to="{ name: 'store-register', query: { from } }">Registrate</router-link></div>
    </div>
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
        email: this.$route.query.email,
        emailError: null,
        password: '',
        passwordError: null,
        remember: true,
        loading: false,
        error: null,
        success: null
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
      async login () {
        this.clearErrors()
        if (this.checkErrors()) return
        this.loading = true
        try {
          const response = await this.axios.post('/account/login', { 
            email: this.email,
            password: this.password,
            cartItems: this.$store.getters.cartItemsSlim
          })
          this.$store.commit('cartReset')
          this.$store.commit('user', {
            authToken: response.data.token,
            email: response.data.user.email,
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            admin: !!response.data.user.admin,
          })
          this.$store.commit('cartQuantity', response.data.cartQty)
          const user = response.data.user
          this.success = `Bienvenido ${user.firstName}` 
          setTimeout(() => {
            if (this.from) {
              // redirect the user back to the original page
              this.$router.push(this.from)
            } else {
              // fallback to the default
              if (user.admin) {
                this.$router.push({ name: 'admin-dashboard' })
              } else {
                this.$router.push({ name: 'store-home' })
              }
            }
          }, 2000)
        } catch (error) {
          if (!error.response)
          return this.error = 'No nos pudimos conectar al servidor. Intentalo nuevamente.'
          this.error = error.response.data?.error
        } finally {
          this.loading = false
        }
      },
      checkErrors() {
        let hasErrors = false
        if (!this.validEmail(this.email)) {
          this.emailError = 'El email no es válido'
          hasErrors = true
        }
        if (!this.validPassword(this.password)) {
          this.passwordError = 'La contraseña debe tener 6 o más caracteres'
          hasErrors = true
        }
        return hasErrors
      },
      clearErrors () {
        this.emailError = null
        this.passwordError = null
        this.error = null
      }
    }
  }
</script>
