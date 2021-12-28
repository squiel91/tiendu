<template>
  <div class="store-theme">
    <AdminBar :resource-id="resourceId" />
    <div v-if="globalTopMessage" class="top-banner" v-html="globalTopMessage" />
    <SearchCartBar />
    <NavBar :listed-categories="listedCategories" :menu-items="menuItems" />    
    <router-view @resourceIdChanged="resourceId = $event" />
    <Footer :listed-categories="listedCategories" :menu-items="menuItems" />
    <a class="live-chat" href="https://api.whatsapp.com/send?phone=59899579667">
      <i class="bi bi-whatsapp"></i>
    </a>
  </div>
</template>

<script>
  import AdminBar from '../snippets/admin-bar.snippet.vue'
  import SearchCartBar from './search-cart-bar.store.theme.vue'
  import NavBar from './nav.store.theme.vue'
  import Footer from './footer.store.theme.vue'

  export default {
    data() {
      return {
        resourceId: undefined,
        globalTopMessage: null,
        listedCategories: [],
        menuItems: []
      }
    },
    components: {
      AdminBar,
      SearchCartBar,
      NavBar,
      Footer
    },
    created () {
      this.axios('categories', { params: { listedOnly: true } })
      .then(response => {
        this.listedCategories = response.data.categories
      })
      
      this.axios('customization')
        .then(response => {
          const customization = response.data.customization
          this.globalTopMessage = customization.globalTopMessage
          this.menuItems = customization.menu
        })
    },
    watch: {
      currentRoute () {
        this.resourceId = undefined
      }
    }
  }
</script>

<style lang="scss">
  @import './store.theme.scss';
</style>