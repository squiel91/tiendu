'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
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
  data: function data() {
    return {
      success: '',
      error: false
    };
  },

  methods: {
    isSuccess: function isSuccess(successMessage) {
      var _this = this;

      this.success = successMessage || 'Salvado';
      setTimeout(function () {
        _this.success = '';
      }, 2500);
    }
  },
  computed: {
    text: function text() {
      if (this.loading) return this.loadingText;
      return this.normalText;
    }
  },
  template: '\n    <button class="primary" :class="{ success }" @click="$emit(\'click\')" :disabled="loading || success || disabled"><i v-if="loading" class="bi bi-watch"></i> {{ success || text }}<slot></slot></button>\n  '
};