<template>
  <div id="admin-theme">
    <nav>
      <div class="container">
        <div class="top-menu">
          <router-link class="logo-title-link" :to="{ name: 'admin-dashboard'}">
            <img class="logo" src="./../assets/awning.svg">
          </router-link>
          <div class="extra-actions">
            <router-link :to="{ name: 'store-home'}">
              <button>
                <span class="hide-on-mobile">Tienda</span>
                <i class="bi bi-box-arrow-up-right"></i>
              </button>
            </router-link>
            <button @click="logout">                
              <i class="bi bi-door-open"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="container no-padding-mobile">
        <menu>
          <router-link class="menu-item" :class="{ current: currentPage.startsWith('admin-dashboard') }" :to="{name: 'admin-dashboard'}"><i class="bi bi-flag-fill" /> <span class="hide-on-mobile">Resúmen</span></router-link>
          <router-link class="menu-item" :class="{ current: currentPage.startsWith('admin-orders') }" :to="{name: 'admin-orders'}"><i class="bi bi-inboxes-fill" /> <span class="hide-on-mobile">Órdenes</span></router-link>
          <router-link class="menu-item" :class="{ current: currentPage.startsWith('admin-products') }" :to="{name: 'admin-products'}"><i class="bi bi-bag-fill" /> <span class="hide-on-mobile">Productos</span></router-link>
          <router-link class="menu-item" :class="{ current: currentPage.startsWith('admin-categories') }" :to="{name: 'admin-categories'}"><i class="bi bi-tag-fill" /> <span class="hide-on-mobile">Categorías</span></router-link>
          <router-link class="menu-item" :class="{ current: currentPage.startsWith('admin-users') }" :to="{name: 'admin-users'}"><i class="bi bi-people-fill" /> <span class="hide-on-mobile">Usuarios</span></router-link>
          <router-link class="menu-item" :class="{ current: currentPage.startsWith('admin-content') }" :to="{name: 'admin-content'}"><i class="bi bi-file-earmark-fill" /> <span class="hide-on-mobile">Contenido</span></router-link>
          <router-link class="menu-item" :class="{ current: currentPage.startsWith('admin-marketing') }" :to="{name: 'admin-marketing'}"><i class="bi bi-megaphone-fill" /> <span class="hide-on-mobile">Marketing</span></router-link>
          <router-link class="menu-item" :class="{ current: currentPage.startsWith('admin-customize') }" :to="{name: 'admin-customize'}"><i class="bi bi-nut-fill" /> <span class="hide-on-mobile">Personalización</span></router-link>
        </menu>
      </div>
    </nav>
    <router-view />
    <footer>
      <div class="container">
        Tiendu 2021 © Todos los derechos reservados.
      </div>
    </footer>
  </div>
</template>

<script>

  import logoutMixin from '../../common/utils/logoutMixin'

  export default {
    created () {
      this.currentPage = this.$route.name
    },
    mixins: [
      logoutMixin // includes logout function
    ],
    watch: {
      '$route': function () {
          this.currentPage = this.$route.name
      }
    },
    data() {
      return {
        currentPage: undefined
      }
    }
  }
</script>

<style lang="scss">
  @import './admin.theme.scss';
</style>