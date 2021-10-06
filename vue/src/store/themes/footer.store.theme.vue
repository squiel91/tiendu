<template>
  <footer>
    <div class="container">
      <div class="grid mobile-1-tablet-2-desktop-4">
        <div class="hide-tablet-and-up">
          <template v-if="listedCategories?.length > 0">
            <div @click="categoriesMobileMenu = !categoriesMobileMenu" class="collapsable-footer-menu toggleMenu">
              <div>Todas las categorías</div>
              <div class="expand-collapsable-menu" :class="{ open: categoriesMobileMenu }">+</div>
            </div>
            <Collapsable :collapsed="!categoriesMobileMenu">
              <div style="padding-bottom: 16px; padding-top: 8px;">
                <router-link
                  v-for="listedCategory in listedCategories"
                  @click="categoriesMobileMenu = false"
                  :key="listedCategory"
                  class="footerMenuItem"
                  :to="{ name: 'store-category', params: { categoryHandle: listedCategory.handle } }"
                >
                  {{ listedCategory.title }}
                </router-link>
              </div>
            </Collapsable>
          </template>
          
          <template v-if="menuItems?.length > 0">
            <div @click="informationMobileMenu = !informationMobileMenu" class="collapsable-footer-menu toggleMenu">
              <div>Más información</div>
              <div class="expand-collapsable-menu" :class="{ open: informationMobileMenu }">+</div>
            </div>
            <Collapsable :collapsed="!informationMobileMenu">
              <div style="padding-bottom: 16px; padding-top: 8px;">
                <router-link
                  v-for="menuItem in menuItems"
                  @click="informationMobileMenu = false"
                  :key="menuItem"
                  class="footerMenuItem"
                  :to="{ name: 'store-category', params: { categoryHandle: menuItem.link } }"
                >
                  {{ menuItem.text }}
                </router-link>
              </div>
            </Collapsable>
          </template>
        </div>
        <div class="hide-mobile">
          <template v-if="listedCategories?.length > 0">
            <div style="font-size: small; color: gray; margin-bottom: 12px">Todas las categorías</div>
            <router-link
              v-for="listedCategory in listedCategories"
              :key="listedCategory"
              :to="{ name: 'store-category', params: { categoryHandle: listedCategory.handle } }"
              style="display: block; padding: 6px 0;"
            >
              {{ listedCategory.title }}
            </router-link>
          </template>
        </div>
        <div>
          <div class="get-in-touch">
            <a href="https://www.instagram.com/"><i class="bi bi-instagram"></i> @Vivero.uy</a>
            <a href="tel:099579667"><i class="bi bi-whatsapp"></i> 099 579 667</a>
            <a href="mailto:info@tiendu.uy"><i class="bi bi-envelope"></i> info@tiendu.uy</a>
          </div>
          <div v-if="menuItems.length > 0" class="hide-mobile">
            <div style="font-size: small; color: gray; margin-bottom: 12px; margin-top: 24px;">Más información</div>
            <router-link
              v-for="menuItem in menuItems"
              :key="menuItem" class="category-item"
              :to="menuItem.link"
              style="display: block; padding: 6px 0;"
            >
              {{ menuItem.text }}
            </router-link>
          </div>
        </div>
        <div class="newsletter-col span-2-col-tablet-and-up">
          <template v-if="!subscribed">
            <div class="newsletter-group">
              <Input id="footer-subscription" style="flex-grow: 1;" @enter="subscribe" label="Email" v-model="email" :error="error" >
                <template v-slot:button>
                  <button class="subscribe-input-button" @click="subscribe" :disabled="loading">
                    {{ loading? 'Enviando' : 'Subscribete' }}
                  </button>
                </template>
              </Input>
            </div>
            <p>Únete a la comunidad y recibe en tu correo las mejores ofertas.</p>
          </template>
          <p v-else>
            <span style="font-weight: bold; color: green;">¡Lo hiciste!</span> Pronto escucharás más sobre nosotros.
          </p>
        </div>
      </div>
      <div style="align-items: center;" class="footer-message-grid">
        <div class="final-legend">
          Tienda creada usando <a target="_blank" href="https://tiendu.uy/">Tiendu.uy</a>.
        </div>
        <div>
        <img src="./../assets/payment_methods-uruguay.svg" alt="Payment methods">
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
  import Collapsable from '../snippets/collapsable.snippet.vue'
  import Input from '../snippets/input.snippet.vue'
  import validatorMixin from '../../common/utils/validator.mixin'

  export default {
    mixins: [ validatorMixin ],
    props: ['listedCategories', 'menuItems'],
    components: {
      Input,
      Collapsable
    },
    data() {
      return {
        categoriesMobileMenu: false,
        informationMobileMenu: false,

        email: undefined,
        loading: false,
        error: undefined,
        subscribed: false
      }
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
    },
  }
</script>
