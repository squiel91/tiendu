export default {
  props: {
    link: String,
    stretch: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  template: `
    <button v-if="disabled" :class="{ stretch }" class="secondary disabled">
      <slot></slot>
    </button>
    <a v-else :href="link">
      <button class="secondary" :class="{ stretch }" @click="!disabled && $emit('click', $event)">
        <slot></slot>
      </button>
    </a>
  `
}