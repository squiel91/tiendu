export default {
  props: {
    link: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  template: `
    <button v-if="disabled" class="secondary disabled">
      <slot></slot>
    </button>
    <a v-else :href="link">
      <button class="secondary" @click="!disabled && $emit('click', $event)">
        <slot></slot>
      </button>
    </a>
  `
}