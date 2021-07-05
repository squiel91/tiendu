"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
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
  template: "\n    <button v-if=\"disabled\" :class=\"{ stretch }\" class=\"secondary disabled\">\n      <slot></slot>\n    </button>\n    <a v-else :href=\"link\">\n      <button class=\"secondary\" :class=\"{ stretch }\" @click=\"!disabled && $emit('click', $event)\">\n        <slot></slot>\n      </button>\n    </a>\n  "
};