'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  data: function data() {
    return {
      editCode: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.descriptionEditor = pell.init({
      element: this.$refs.description,
      defaultParagraphSeparator: 'p',
      onChange: function onChange(html) {
        return _this.$emit('input', html);
      },
      actions: ['bold', 'italic', 'underline', 'heading1', 'heading2', { name: 'ulist', icon: '<i class="bi bi-list-ul"></i>' }, { name: 'olist', icon: '<i class="bi bi-list-ol"></i>' }, { name: 'link', icon: '<i class="bi bi-link-45deg"></i>' }, { name: 'image', icon: '<i class="bi bi-image"></i>' }, {
        name: 'code',
        icon: '<i class="bi bi-code-slash"></i>',
        title: 'Edit code',
        result: function result() {
          _this.editCode = !_this.editCode;
        }
      }]
    });
  },

  methods: {
    setUp: function setUp(content) {
      this.descriptionEditor.content.innerHTML = content;
    },
    format: function format(html) {
      var tab = '  ';
      var result = '';
      var indent = '';

      html.split(/>\s*</).forEach(function (element) {
        if (element.match(/^\/\w/)) {
          indent = indent.substring(tab.length);
        }

        result += indent + '<' + element + '>\r\n';

        if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith('input')) {
          indent += tab;
        }
      });
      return result.substring(1, result.length - 3);
    }
  },
  watch: {
    editCode: function editCode(newVal) {
      if (newVal) {
        try {
          this.$refs.codeEditor.innerText = this.format(this.descriptionEditor.content.innerHTML);
        } catch (error) {
          console.warn(error);
          this.$refs.codeEditor.innerText = this.descriptionEditor.content.innerHTML;
        }
        $('.pell-content').hide();
      } else {
        this.descriptionEditor.content.innerHTML = this.$refs.codeEditor.innerText;
        $('.pell-content').show();
      }
    },
    code: function code(newCode) {
      this.$emit('input', newCode);
    }
  },
  template: /* html */'\n    <div>\n      <div ref="description">\n      </div>\n      <div v-show="editCode">\n        <div @input="$emit(\'input\', $event.target.innerText)" contenteditable="true" ref="codeEditor" class="pell-html-container"></div>\n      </div>\n    </div>\n  '
};