<template>
  <div class="container">
    <Breadcrumb active="Registrarse" />
    <h1>Registrate al Vivero</h1>
    <div class="grid mobile-1-tablet-2-desktop-4">
      <Input id="email" v-model="email" label="Email" :error="emailError" class="span-2-col-tablet-and-up" />
      <Input id="first-name" v-model="firstName" :error="firstNameError" label="Nombre" class="first-col" />
      <Input id="last-name" v-model="lastName" :error="lastNameError" label="Apellido" />
      <Input id="password" v-model="password" label="Constraseña" :error="passwordError" type="password" class="first-col span-2-col-tablet-and-up" />
      <div class="first-col span-2-col-tablet-and-up">
        <input v-model="remember" type="checkbox" id="remember"> <label for="remember">Recordarme en este dispositivo</label>
      </div>
      <div v-if="error" class="error-message first-column span-2-col-tablet-and-up">{{ error }}</div>
      <div class="first-col span-2-col-tablet-and-up">
        <Button text="Registrarme" :success="success" :loading="loading" @click="register"></Button>
      </div>
      <div class="first-col span-2-col-tablet-and-up">Ya tenés una cuenta? <router-link :to="{ name: 'store-login', query: { from } }">Ingresá</router-link></div>
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
        firstName: this.$route.query.nombre,
        firstNameError: '',
        lastName: this.$route.query.apellido,
        lastNameError: '',
        password: '',
        passwordError: '',
        error: null,
        success: null,
        remember: true
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
      async register () {
        this.clearErrors()
        if (this.checkErrors()) return
        this.loading = true
        try {
          const response = await this.axios.post('/account/register', {
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
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
          this.success = `Bienvenido ${response.data.user.firstName}` 
          setTimeout(() => {
            if (this.from) {
              // redirect the user back to the original page
              this.$router.push(this.from)
            } else {
              this.$router.push({ name: 'store-home' })
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
        if (!this.firstName) {
          this.firstNameError = 'Ingresa tu nombre'
          hasErrors = true
        }
        if (!this.lastName) {
          this.lastNameError = 'Ingresa tu apellido'
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
        this.firstNameError = null
        this.lastNameError = null
        this.passwordError = null
        this.error = null
      }
    }
  }
</script>
