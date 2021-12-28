<template>
  <div id="post-page" class="container">
    <Breadcrumb :stack="[{ label: 'Contenido', routerLink: { name: 'admin-content' } }]" active="Post" />
    <div style="display: flex;">
      <h1 style="flex-grow: 1; margin-bottom: 40px;">Blog post</h1>
      <div>
        <SecondaryButton :disabled="createPost" :link="{ name: 'store-blog-post', params: { postHandle: originalHandle || 'dummy' } }" style="margin-right: 8px;">
          <div>
            <span class="hide-mobile">
              Visualizar
            </span>
            <i class="hide-tablet-and-up bi bi-box-arrow-up-right"></i>
          </div>
        </SecondaryButton>
        <SecondaryButton :disabled="createPost" @click="remove()">
          <div>
            <span class="hide-mobile">
              Borrar
            </span>
            <i class="hide-tablet-and-up bi bi-trash-fill"></i>
          </div>
        </SecondaryButton>
      </div>
    </div>
    <div class="post-editor-grid">
      <Input label="Título" id="title" v-model="title" :error="titleError" help="El título principal, que se muestra arriba de la página."></Input> 
      <Input :label="handleRoute" @input="handleChanged()" v-model="handle" :error="handleError" help="Es como se verá la dirección de la página en la barra superior del navegador. Debe ser único para cada página (no se puede repetir)."></Input>
      <div class="first-col span-2-col">
        <ImagePicker v-model="cover" :just-one="true" class="first-col span-2-col">Imágen del post</ImagePicker>
      </div>
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
  import ImagePicker from '../snippets/image-picker.snippet.vue'
  import Button from '../snippets/button.snippet.vue'
  import Textarea from '../snippets/textarea.snippet.vue'
  import SecondaryButton from '../snippets/secondary-button.snippet.vue'
  import Input from '../snippets/input.snippet.vue'

  import isAdmin from '../../common/utils/isAdmin'

  export default {
    beforeRouteEnter: isAdmin,
    props: ['postId'],
    data() {
      return {
        createPost: undefined,
        errorMessage: '',
        title: '',
        titleError: '',
        handle: '',
        originalHandle: '',
        handleError: '',
        cover: [],
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
      ImagePicker,
      SecondaryButton,
      Input
    },
    computed: {
      handleRoute() {
        return 'Handle: /posts/'
      }
    },
    async created () {
      try {
        this.createPost = this.postId === 'create' 
        if (!this.createPost) {
          const response = await this.axios.get(`posts/${this.postId}`)
          
          const post = response.data.post
          this.title = post.title
          this.handle = post.handle
          this.originalHandle = post.handle
          if (post.cover) this.cover = [ post.cover ]
          this.handleModified = post.handle.length > 0
          this.content = post.content
          this.$refs.textarea.setUp(this.content)
          this.published = post.published
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

        const response = await (this.createPost ? this.axios.post : this.axios.patch)
          (this.createPost ? 'posts' : `posts/${this.postId}`, {
          title: this.title,
          handle: this.handle,
          cover: this.cover.find(Boolean)?.id || null,
          content: this.content,
          published: this.published,
        })
          
        this.$router.push({ name: 'admin-content' })
        
      },
      async remove () {
        try {
          const response = await this.axios.delete(`posts/${this.postId}`)
          this.$router.push({ name: 'admin-content' })
        } catch (error) {
          alert('Ocurrió un error')  
          console.error(error)
        }
      }
    }
  }
</script>
