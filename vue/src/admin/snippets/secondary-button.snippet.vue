<template>
  <button v-if="disabled" :class="{ stretch }" class="secondary-button-snippet secondary disabled">
    <slot></slot>
  </button>
  <router-link v-else-if="!disabled && link" :to="link">
    <button class="secondary" :class="{ stretch }">
      <slot @click="!disabled && $emit('click', $event)"></slot>
    </button>
  </router-link>
  <button v-else class="secondary" :class="{ stretch }">
      <slot @click="!disabled && $emit('click', $event)"></slot>
  </button>
</template>

<script>
export default {
  props: {
    link: [String, Object],
    stretch: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
