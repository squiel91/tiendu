<template>
  <nav :class="{ 'is-home': isHome }">
    <div class="container" style="position: relative;">
      <div class="topMenu">
        <router-link class="logo-title-link" :to="{ name: 'store-home' }">
          <img src="./../assets/main-logo.svg">
        </router-link>
        <div class="separator"></div>
        <div v-if="isLogged" class="menuItem hide-mobile">
          <router-link :to=" { name: 'store-account' }">Mi cuenta</router-link>
        </div>
        <div v-else class="menuItem hide-mobile"><router-link :to="{ name: 'store-login', query: { from: currentLocation } }">Ingresa</router-link> / <router-link :to="{ name: 'store-register', query: { from: currentLocation } }">Registrate</router-link></div>
        <div class="menuItem hide-mobile">
          <router-link :to=" { name: 'store-blog' }">Blog</router-link>
        </div>
        <div v-if="menuItems.length > 0" class="menuItem hide-mobile positionRelative">
          <div @click="infoMenu = true" class="toggleMenu pseudo-a">
            Información
            <svg style="width: 16px; margin-top: -2px; margin-left: 2px; transform: scale(0.8);" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66.33 41.46">
              <polyline class="chevronLine" points="57.29 10.18 33.85 32.23 10.4 10.18"/></svg>
          </div>
          <transition name="fade-down">
            <div v-if="infoMenu" class="collapsableMenu">
              <router-link @click="infoMenu = false" v-for="menuItem in menuItems" :key="menuItem" class="menuItem" :to="menuItem.link">{{ menuItem.text }}</router-link>
            </div>
          </transition>
          <transition name="fade">
            <div v-if="infoMenu" @click="infoMenu = false" class="menuOverlay"></div>
          </transition>
        </div>
        <div v-if="listedCategories.length > 0" class="menuItem hide-mobile positionRelative">
          <div @click="categoryMenu = true" class="toggleMenu pseudo-a">
            Categorías
            <svg style="width: 16px; margin-top: -2px; margin-left: 2px; transform: scale(0.8);" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66.33 41.46">
              <polyline class="chevronLine" points="57.29 10.18 33.85 32.23 10.4 10.18"/></svg>
          </div>
          <transition name="fade-down">
            <div v-if="categoryMenu" class="collapsableMenu left">
              <router-link @click="categoryMenu = false" v-for="listedCategory in listedCategories" :key="listedCategory" class="menuItem" :to="{ name: 'store-category', params: { categoryHandle: listedCategory.handle } }">{{ listedCategory.title }}</router-link>
            </div>
          </transition>
          <transition name="fade">
            <div v-if="categoryMenu" @click="categoryMenu = false" class="menuOverlay"></div>
          </transition>
        </div>
        <div class="menuItem hide-tablet-and-up">
          <div @click="mobileMenu = !mobileMenu" class="toggleMenu pseudo-a">
            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="menuIcon" viewBox="0 0 100 100">
              <line class="menuLines" x1="90.1" y1="21.3" x2="33.8" y2="21.3"/>
              <line class="menuLines" x1="90.1" y1="48.6" x2="15.3" y2="48.6"/>
              <line class="menuLines" x1="90.1" y1="75.9" x2="44.8" y2="75.9"/>
            </svg>
          </div>
          <transition name="fade-down">
            <div v-if="mobileMenu" class="collapsableMenu left">
              <router-link v-if="isLogged" @click="mobileMenu = false" class="menuItem" :to="{ name: 'store-account' }">Mi cuenta</router-link>
              <div v-else class="menuItem"><router-link @click="mobileMenu = false" :to="{ name: 'store-login', query: { from: currentLocation } }">Ingresa</router-link> / <router-link @click="mobileMenu = false" :to="{ name: 'store-register', query: { from: currentLocation } }">Registrate</router-link></div>
              <router-link @click="mobileMenu = false" class="menuItem" :to="{ name: 'store-blog' }">Blog</router-link>
              <template v-if="listedCategories.length > 0">
                <div class="titleSeparator" style="padding-top: 12px;">Todas las categorías</div>
                <router-link @click="mobileMenu = false" v-for="listedCategory in listedCategories" :key="listedCategory" class="menuItem" :to="{ name: 'store-category', params: { categoryHandle: listedCategory.handle } }">{{ listedCategory.title }}</router-link>
              </template>
              <template v-if="menuItems.length > 0">
                <div class="titleSeparator">Más información</div>
                <router-link @click="mobileMenu = false" v-for="menuItem in menuItems" :key="menuItem" class="menuItem" :to="menuItem.link">{{ menuItem.text }}</router-link>
              </template>
            </div>
          </transition>
          <transition name="fade">
            <div v-if="mobileMenu" @click="mobileMenu = false" class="menuOverlay"></div>
          </transition>
        </div>
      </div>
    </div>
    <div v-if="isHome" class="container">
      <Header />
    <!-- <Attributes /> -->
    </div>
  </nav>
</template>

<script>
  import Header from '../sections/header.section.vue'
  import Attributes from '../sections/attributes.section.vue'

  export default {
    props: ['listedCategories', 'menuItems'],
    components: {
      Header,
      Attributes
    },
    data() {
      return {
        infoMenu: false,
        categoryMenu: false,
        mobileMenu: false,
      }
    },
    computed: {
      isHome () {
        return this.$route.name === 'store-home'
      },
      isLogged () {
        return this.$store.getters.isAuthenticated
      },
      currentLocation () {
        return window.location.pathname
      },
    }
  }
</script>