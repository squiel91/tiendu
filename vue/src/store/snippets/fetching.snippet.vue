<template>
  <div v-if="status === 'loading' || status === 'fetching'" class="container loading-widget">
    <div class="loader" :class="{ center }">
      <svg class="circular" viewBox="25 25 50 50">
        <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="3" stroke-miterlimit="10"/>
      </svg>
    </div>
  </div>
  <div v-else-if="status === 'error' || status === 'failed'" class="container">
    <p>Hubo un error al cargar los datos.</p>
    <Button text="Recargar página" @click="realod" />
  </div>
</template>

<script setup>
  import Button from '../snippets/button.snippet.vue'

  defineProps({
    status: String,
    center: {
      type: Boolean,
      default: false
    }
  })

  function reload() {
    location.reload()
  }
</script>
