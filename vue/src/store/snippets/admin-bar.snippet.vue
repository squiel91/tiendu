<template>
  <div v-if="isAdmin" class="admin-bar-snippet">
    <div class="container" style="overflow-y: visible;">
      <div style="display: flex; justify-content: center;">
        <router-link class="admin-button" :to="{ name: 'admin-dashboard' }">
          <i class="bi bi-gear-fill"></i>
          Administrar tienda
        </router-link>
        <router-link v-if="currentRoute === 'store-category'" class="admin-button" :to="{ name: 'admin-categories-edit', params: { categoryId: resourceId } }">
          <i class="bi bi-tag-fill"></i>
          Editar categoría
        </router-link>
        <router-link v-if="resourceId && currentRoute === 'store-product'" class="admin-button" :to="{ name: 'admin-products-edit', params: { productId: resourceId } }">
          <i class="bi bi-bag-fill"></i>
          Editar producto
        </router-link>
        <router-link v-if="resourceId && currentRoute === 'store-page'" class="admin-button" :to="{ name: 'admin-content-pages-edit', params: { pageId: resourceId } }">
          <i class="bi bi-file-earmark-fill"></i>
          Editar página
        </router-link>
        <router-link v-if="resourceId && currentRoute === 'store-blog-post'" class="admin-button" :to="{ name: 'admin-content-posts-edit', params: { postId: resourceId } }">
          <i class="bi bi-chat-left-fill"></i>
          Editar post
        </router-link>
        <router-link v-if="resourceId && currentRoute === 'store-order'" class="admin-button" :to="{ name: 'admin-orders-edit', params: { orderId: resourceId } }">
          <i class="bi bi-inboxes-fill"></i>
          Editar orden
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['resourceId'],
    computed: {
      isAdmin () {
        return this.$store.getters.isAdmin
      },
      currentRoute () {
        return this.$route.name
      },
    }
  }
</script>
