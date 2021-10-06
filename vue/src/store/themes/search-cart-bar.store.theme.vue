<template>
  <div class="search-cart-bar-store-theme" :class="{ focused }">
    <div class="container" style="display: flex; align-items: center;">
      <i class="bi bi-search" style="color: #a7a7a7;"></i>
      <Input placeholder="Busca una planta" @focus="focused = true" @blur="focused = false" style="flex-grow: 1;" v-model="searchQuery" @enter="search" />
      <div class="menuItem cart">
        <router-link :to="{ name: 'store-cart' }">
          <i class="bi bi-bag" style="display: inline-block; transform: scale(1.4);"></i>
          <span v-if="cartQty" class="cart-quantity">{{ cartQty }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import Input from '../snippets/input.snippet.vue'

  export default {
    components: {
      Input
    },
    data() {
      return {
        focused: false,
        searchQuery: null
      }
    },
    computed: {
      cartQty() {
        return this.$store.getters.cartQuantity
      },
    },
    methods: {
      search() {
        if (!this.searchQuery) return
        this.$router.push({ name: 'store-search', query: { q: this.searchQuery } })
        document.activeElement.blur()
      }
    },
    created() {
      this.searchQuery = this.$route.query.q
    }
  }
</script>