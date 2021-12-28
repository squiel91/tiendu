<template>
  <div class="textarea-snippet">
    <div ref="description">
    </div>
    <div v-show="editCode">
      <div @input="$emit('changed', $event.target.innerText)" contenteditable="true" ref="codeEditor" class="pell-html-container"></div>
    </div>
  </div>
</template>
<script>
import pell from 'pell'

export default {
  props: ['preset'],
  data() {
    return {
      editCode: false
    }
  },
  emits: [ 'changed' ],
  mounted () {
    this.descriptionEditor = pell.init({
      element: this.$refs.description,
      defaultParagraphSeparator: 'p',
      onChange: html => this.$emit('changed', html),
      actions: [
        'bold',
        'italic',
        'underline',
        'heading1',
        'heading2',
        { name: 'ulist', icon: '<i class="bi bi-list-ul"></i>' },
        { name: 'olist', icon: '<i class="bi bi-list-ol"></i>' },
        { name: 'link', icon: '<i class="bi bi-link-45deg"></i>' },
        { name: 'image', icon: '<i class="bi bi-image"></i>'},
        {
          name: 'code',
          icon: '<i class="bi bi-code-slash"></i>',
          title: 'Edit code',
          result: () => {
            this.editCode = !this.editCode
          }
        }
      ]
    })
  },
  methods: {
    format (html) {
      const tab = '  '
      let result = ''
      let indent = ''

      html.split(/>\s*</).forEach(element => {
        if (element.match(/^\/\w/)) {
          indent = indent.substring(tab.length)
        }

        result += indent + '<' + element + '>\r\n';

        if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith('input')) {
          indent += tab
        }
      })
      return result.substring(1, result.length - 3)
    },
    setUp (content) {
      this.descriptionEditor.content.innerHTML = content
    },
  },
  watch: {
    editCode (newVal) {
      if (newVal) {
        try {
          this.$refs.codeEditor.innerText = this.format(this.descriptionEditor.content.innerHTML)
        } catch (error) {
          console.warn(error)
          this.$refs.codeEditor.innerText = this.descriptionEditor.content.innerHTML
        }
        this.$refs.description.children[1].style.display = 'none'
      } else {
        this.descriptionEditor.content.innerHTML = this.$refs.codeEditor.innerText
        this.$refs.description.children[1].style.display = 'block'
      }
    },
    code (newCode) {
      this.$emit('input', newCode)
    }
  }
}
</script>

<style lang="scss">
  @import 'pell/src/pell';

  .pell-content, .pell-html-container {
    background-color: whitesmoke;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    padding: 16px;
    height: unset;
    min-height: 300px;
  }

  .pell-content *:first-child {
    margin-top: 0;
  }

  .pell-content a {
    color: blue;
  }

  .pell-content img {
    max-width: 100%;
  }

  .pell-html-container {
    background-color: #1e272e;
    font-family: monospace;
    color: white;
    outline: none;
    box-sizing: border-box;
    font-size: larger;
    line-height: 1.4em;
  }

  @media screen and (max-width: 992px) {
    .pell-content, .pell-html-container {
      min-height: 200px;
    }
  }
</style>
