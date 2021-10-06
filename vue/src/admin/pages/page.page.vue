<template>
  <div id="page-page" class="container">
    <Breadcrumb :stack="[{ label: 'Contenido', routerLink: { name: 'admin-content' } }]" active="Página" />
    <div style="display: flex;">
      <h1 style="flex-grow: 1; margin-bottom: 40px;">Página</h1>
      <div>
        <SecondaryButton :disabled="createPage" :link="`/paginas/${originalHandle}`" style="margin-right: 8px;">
          <div>
            <span class="hide-mobile">
              Visualizar
            </span>
            <i class="hide-tablet-and-up bi bi-box-arrow-up-right"></i>
          </div>
        </SecondaryButton>
        <SecondaryButton :disabled="createPage" @click="remove()">
          <div>
            <span class="hide-mobile">
              Borrar
            </span>
            <i class="hide-tablet-and-up bi bi-trash-fill"></i>
          </div>
        </SecondaryButton>
      </div>
    </div>
    <div class="page-editor-grid">
      <Input label="Título" id="title" v-model="title" :error="titleError" help="El título principal, que se muestra arriba de la página."></Input> 
      <Input :label="handleRoute" @input="handleChanged()" v-model="handle" :error="handleError" help="Es como se verá la dirección de la página en la barra superior del navegador. Debe ser único para cada página (no se puede repetir)."></Input>
      <div class="first-col span-2-col">
        <Textarea ref="textarea" @changed="content = $event"></Textarea>
      </div>
      <div class="first-col span-2-col" style="display: flex;">
        <input type="checkbox" id="published" v-model="published" style="margin-right: 8px"><label for="published">Publicada</label>
      </div>
      <div v-if="errorMessage" class="error-message first-col span-2-col">
        <i class="bi bi-exclamation-circle"></i> {{ errorMessage }}
      </div>
      <div class="first-col span-2-col">
        <Button normal-text="Guardar página" @click="send()"></Button>
      </div>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'
  import Button from '../snippets/button.snippet.vue'
  import Textarea from '../snippets/textarea.snippet.vue'
  import SecondaryButton from '../snippets/secondary-button.snippet.vue'
  import Input from '../snippets/input.snippet.vue'

  import isAdmin from '../../common/utils/isAdmin'

  export default {
    beforeRouteEnter: isAdmin,
    props: ['pageId'],
    data() {
      return {
        createPage: undefined,
        errorMessage: '',
        title: '',
        titleError: '',
        handle: '',
        originalHandle: '',
        handleError: '',
        content: '',
        handleModified: false,
        published: true,
        loading: false
      }
    },
    components: {
      Breadcrumb,
      Button,
      Textarea,
      SecondaryButton,
      Input
    },
    computed: {
      handleRoute() {
        return 'Handle: /paginas/'
      }
    },
    async created () {
      try {
        this.createPage = this.pageId === 'create' 
        if (!this.createPage) {
          const response = await this.axios.get(`pages/${this.pageId}`)
          
          const page = response.data.page
          this.title = page.title
          this.handle = page.handle
          this.originalHandle = page.handle
          this.handleModified = page.handle.length > 0
          this.content = page.content
          this.$refs.textarea.setUp(this.content)
          this.published = page.published
        }
      } catch (error) {
        this.error = true
        console.error(error)
      }
    },
    watch: {
      title() {
        this.autocompleteHandle()
      }
    },
    methods: {
      handleChanged() {
        this.handleModified = this.handle.length > 0
      },
      autocompleteHandle() {
        if (this.title) {
          if (!this.handleModified) {
            this.handle = this.title
              .normalize("NFD")
              .replace('ñ', 'n')
              .replace(/[^\w\s]/g, "")
              .replaceAll(' ', '-')
              .toLowerCase()
          }
        }
      },
      async send () {
        this.handleError = ''
        this.titleError = ''
        this.errorMessage = ''

          const response = await (this.createPage ? this.axios.post : this.axios.patch)(this.createPage ? 'pages' : `pages/${this.pageId}`, {
            title: this.title,
            handle: this.handle,
            content: this.content,
            published: this.published,
          })
          
          this.$router.push({ name: 'admin-content' })
        
      },
      async remove () {
        try {
          const response = await this.axios.delete(`pages/${this.pageId}`)
          this.$router.push({ name: 'admin-content' })
        } catch (error) {
          alert('Ocurrió un error')  
          console.error(error)
        }
      }
    }
  }
</script>
