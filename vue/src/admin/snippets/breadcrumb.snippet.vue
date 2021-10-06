<template>
  <div class="breadcrumb-snippet" aria-label="breadcrumb">
    <!-- Homepage is always added first. The last page is assumend to be the active one -->
    <router-link :to="{ name: 'admin-dashboard'}" class="breadcrumb__link">Inicio</router-link>
    <span v-for="page in stack" :key="page.link">
      <span class="breadcrumb__separator"><i class="bi bi-caret-right-fill"></i></span>
      <router-link :to="page.routerLink" class="breadcrumb__link">{{ page.label }}</router-link>
    </span>

    <span class="breadcrumb__separator"><i class="bi bi-caret-right-fill"></i></span>
    <a aria-current="<%= activePage.label %>">{{ active }}</a>
  </div>
</template>

<script>
export default {
  props: {
    active: String,
    stack: {
      type: Array,
      default: []
    }
  }
}
</script>
