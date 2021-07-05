'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  props: {
    value: String,
    type: {
      type: String,
      default: 'text'
    },
    step: {
      type: Number,
      default: 0.1
    },
    placeholder: String,
    label: String,
    postLabel: String,
    options: Array,
    help: String,
    error: String,
    remove: Boolean,
    id: {
      type: String,
      required: true
    }
  },
  mounted: function mounted() {
    if (this.help) {
      tippy('#' + this.id + '-help', {
        content: this.help,
        offset: [0, 12]
      });
    }
  },

  watch: {
    error: function error(newErrorMessage) {
      var _this = this;

      if (newErrorMessage) {
        this.$nextTick(function () {
          tippy('#' + _this.id + '-error', {
            content: newErrorMessage,
            offset: [0, 12]
          });
        });
      }
    }
  },
  template: /* html */'\n  <label :id="id" :for="id + \'-input\'" class="tiendu-input">\n    <i v-if="error" :id="id +\'-error\'" class="error-icon bi bi-exclamation-circle-fill"></i>\n    <span v-if="label" class="label">{{ label }}</span>\n    <input v-if="!options" @blur="$emit(\'blur\', $event)" :placeholder="placeholder" :type="type" :step="step" :id="id + \'-input\'" :value="value" @input="$emit(\'input\', $event.target.value)">\n    <span v-if="postLabel" class="post-label">{{ postLabel }}</span>\n    <select v-if="options" @blur="$emit(\'blur\', $event)" :id="id + \'-input\'" :value="value" @input="$emit(\'input\', $event.target.value)">\n      <option v-for="option in options">{{ option }}</option>\n    </select>\n    <button v-if="remove" class="close-button" @click="$emit(\'remove\')"><i class="bi bi-x-lg"></i></button>\n    <i v-if="help" :id="id +\'-help\'" class="help-icon bi bi-question-circle-fill"></i>\n  </label>\n  '
};