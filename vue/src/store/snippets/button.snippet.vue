<template>
  <button class="button-snippet" :class="{primary: !secondary, secondary, success, noExapansionMobile }" type="button" :disabled="loading || success || disabled">
    <div v-if="loading" class="loader-widget">
      <div class="loader">
        <svg class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="3" stroke-miterlimit="10"/>
        </svg>
      </div>
    </div>
    <span :style="{ opacity: loading ? '0' : '1' }">{{ buttonText }}</span>
    <slot @click="$emit('click')"></slot>
  </button>
</template>

<script>
  export default {
    props: {
      text: String,
      success: null,
      loading: {
        type: Boolean,
        default: false
      },
      secondary: {
        type: Boolean,
        default: false
      },
      noExapansionMobile: {
        type: Boolean,
        default: false
      },
      disabled: Boolean
    },
    data () {
      return {
        error: false
      }
    },
    computed: {
      buttonText () {
        if (this.success) return this.success
        return this.text
      }
    }
  }
</script>
