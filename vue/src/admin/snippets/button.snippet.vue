<template>
  <button @click="$emit('click')" class="button-snippet primary" :class="{ success }" :disabled="loading || success || disabled">
    <i v-if="loading" class="bi bi-watch"></i> {{ success || text }}
    <slot></slot>
  </button>
</template>

<script>
  export default {
    emits: ['click'],
    props: {
      normalText: String,
      loadingText: {
        type: String,
        default: 'Procesando'
      },
      loading: {
        type: Boolean,
        default: false
      },
      secondary: {
        type: Boolean,
        default: false
      },
      disabled: Boolean
    },
    data () {
      return {
        success: '',
        error: false
      }
    },
    methods: {
      isSuccess (successMessage) {
        this.success = successMessage || 'Salvado'
        setTimeout(() => { this.success = '' }, 2000)
      }
    },
    computed: {
      text () {
        if (this.loading) return this.loadingText
        return this.normalText
      }
    }
  }
</script>
