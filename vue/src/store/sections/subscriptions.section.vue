<template>
  <section ref="subscribeSection" class="subscribe-section">
    <div class="container">
      <h1 style="margin-bottom: 0.3em;">Se parte de una revolución natural</h1>
      <p style="margin-bottom: 2.5em;">Recibe las últimas ofertas, enterate de nuevas plantas ¡y mucho más!</p>
      <template v-if="!subscribed">
        <Input style="width: 100%;" label="Email" id="subscribe-email" v-model="email" :error="error" white>
          <template v-slot:button>
            <button class="subscribe-input-button" @click="subscribe" :disabled="loading">
              {{ loading? 'Un momento' : 'Subscribete' }}
            </button>
          </template>
        </Input>
      </template>
      <p v-else>
        <span style="font-weight: bold; color: green;">¡Lo hiciste!</span> Pronto escucharás más sobre nosotros.
      </p>
    </div>
  </section>
</template>

<script>      


  import validateEmailMixin from '../../common/utils/validator.mixin'
  import Input from '../snippets/input.snippet.vue'

  export default {
    mixins: [validateEmailMixin],
    components: {
      Input
    },
    data() {
      return {
        email: '',
        loading: false,
        error: undefined,
        subscribed: false
      }
    },
    mounted () {
      setTimeout(()=> {
        var io = new IntersectionObserver(
          entries => {
              console.log(`SUBSCRIPTIONNN`, entries)
          },
          {
            rootMargin: "200px",
            /* Using default options. Details below */
          }
        );
        // Start observing an element
        io.observe(this.$refs.subscribeSection);

      }, 2000)
    },
    methods: {
      async subscribe () {
        this.error = undefined
        const email = this.email
        if (this.validEmail(email)) {
          this.loading = true
          try {
            await this.axios.post(`/subscriptions`, { email })
            this.subscribed = true
          } catch (error) {
            this.error = error.response?.data?.message || '¡Ocurrió un error! Intentalo nuevamente.'
            console.log(error)
          } finally {
            this.loading = false
          }
        } else {
          this.error = 'Ingresa un email válido'
        }
      }
    }
  }
</script>
