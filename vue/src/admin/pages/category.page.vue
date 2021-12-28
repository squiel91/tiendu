<template>
  <div id="category-page" class="container">
    <Breadcrumb :stack="[{ label: 'Categorías', routerLink: { name: 'admin-categories' } }]" active="Edición" />
    <div style="display: flex;">
      <h1 style="flex-grow: 1; margin-bottom: 40px;">Categoría</h1>
      <div>
        <SecondaryButton :disabled="createCategory" :link="`/categorias/${originalHandle}`" style="margin-right: 8px;">
          <div>
            <span class="hide-mobile">
              Visualizar
            </span>
            <i class="hide-tablet-and-up bi bi-box-arrow-up-right"></i>
          </div>
        </SecondaryButton>
        <SecondaryButton :disabled="createCategory" @click="remove()">
          <div>
            <span class="hide-mobile">
              Borrar
            </span>
            <i class="hide-tablet-and-up bi bi-trash-fill"></i>
          </div>
        </SecondaryButton>
      </div>
    </div>
    <div class="category-editor-grid">
      <Input label="Título" id="title" v-model="title" :error="titleError" help="El título principal, que se muestra arriba de la página."></Input> 
      <Input :label="handleRoute" @input="handleChanged()" v-model="handle" :error="handleError" help="Es como se verá la dirección de la página en la barra superior del navegador. Debe ser único para cada página (no se puede repetir)."></Input>
      <div class="first-col span-2-col">
        <Textarea ref="textarea" @changed="description = $event"></Textarea>
      </div>
      <ImagePicker v-model="coverImage" :just-one="true" class="first-col span-2-col">Imágen de portada</ImagePicker>
      <div class="first-col span-2-col">
        <h2>Productos</h2>
        <StaticSelectableTable :items="allProducts" :cols="colProds" />
      </div>
      <div class="first-col span-2-col" style="display: flex;">
        <input type="checkbox" id="listed" v-model="listed" style="margin-right: 8px"><label for="listed">Listada</label>
        <input type="checkbox" id="featured" v-model="featured" style="margin-right: 8px; margin-left: 16px;"><label for="featured">Destacada</label>
      </div>
      <div v-if="errorMessage" class="error-message first-col span-2-col">
        <i class="bi bi-exclamation-circle"></i> {{ errorMessage }}
      </div>
      <div class="first-col span-2-col">
        <Button normal-text="Guardar categoría" @click="save()"></Button>
      </div>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'
  import Textarea from '../snippets/textarea.snippet.vue'
  import Input from '../snippets/input.snippet.vue'
  import StaticSelectableTable from '../snippets/static-selectable-table.snippet.vue'
  import Button from '../snippets/button.snippet.vue'
  import SecondaryButton from '../snippets/secondary-button.snippet.vue'
  import ImagePicker from '../snippets/image-picker.snippet.vue'

  import isAdmin from '../../common/utils/isAdmin'

  export default {
    beforeRouteEnter: isAdmin,
    title: 'Nueva Categoría en tu Tiendu',
    props: ['categoryId'],
    data() {
      return {
        createCategory: undefined,
        allProducts: [],
        coverImage: [],
        colProds: [
          { 
            label: 'Título',
            val: 'title',
            span: 2,
            html: true,
            format: (title, product) => (product.published? '<i class="bi bi-circle-fill published" title="Publicado"></i>' : '<i class="bi bi-circle-fill not published" title="No publicado"></i>') + title?.replace( /(<([^>]+)>)/ig, '')
          },
          { label: 'Stock', html: true, val: 'stock', format: stock => {
            stock = typeof stock === 'object' && stock !== null ? stock.aggregated : stock
            if (stock === null) return '∞'
            if (stock === undefined) return '--'
            return stock // is a number 
          }},
          { label: 'Precio', val: 'price', format: price => '$ ' + (typeof price === 'number' ? price : `${price.min}~${price.max}`) }
        ],
        errorMessage: '',
        title: '',
        titleError: '',
        handle: '',
        originalHandle: '',
        description: '',
        products: [],
        handleError: '',
        handleModified: false,
        listed: true,
        featured: false,
        loading: false
      }
    },
    components: {
      Breadcrumb,
      Textarea,
      Input,
      StaticSelectableTable,
      Button,
      SecondaryButton,
      ImagePicker
    },
    computed: {
      handleRoute() {
        return 'Handle /categorias/'
      }
    },
    async created () {
      try {
        this.createCategory = this.categoryId === 'create'
        if (!this.createCategory) {
          const response = await this.axios.get(`categories/${this.categoryId}`)
          
          const category = response.data.category
          this.title = category.title
          this.setTitle(`Categoría '${this.title}' en tu Tiendu`)
          this.products = category.products
          this.handle = category.handle
          this.description = category.description
          this.$refs.textarea.setUp(this.description)
          if (category.image) this.coverImage = [ category.image ]
          this.originalHandle = category.handle
          this.handleModified = category.handle.length > 0 
          this.listed = category.listed
          this.featured = category.featured

          const includedIds = this.products.map(product => product.id)
          await this.getAllProducts(includedIds)
        } else {
          await this.getAllProducts([])
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
      async getAllProducts (includedIds) {
        const response = await this.axios.get(`products`, { params: { all: true } })
          this.allProducts = response.data.products?.map(product => {
            product.included = includedIds.includes(product.id)
            return product
          })
          this.allProducts.sort((prod1, prod2) => (prod1.included === prod2.included)? 0 : prod1.included? -1 : 1)
      },
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
      async save () {
        this.handleError = ''
        this.titleError = ''
        this.errorMessage = ''

        try {
          await (this.createCategory ? this.axios.post : this.axios.patch)(this.createCategory ? 'categories' : `categories/${this.categoryId}`, {
            title: this.title,
            handle: this.handle,
            products: this.allProducts.filter(prod => prod.included).map(prod => prod.id),
            description: this.description,
            image: this.coverImage.find(Boolean)?.id || null, 
            listed: this.listed,
            featured: this.featured
          })
          
          this.$router.push({ name: 'admin-categories' })

        } catch (error) {
          if (error.response?.data?.fields) {
            this.errorMessage = 'Se detectó algun error. Quedaron marcados arriba en rojo.' 
            const errorFields = error.response.data.fields
            for (const errorField of errorFields) {
              if ((errorField.name + 'Error') in this)
              this[errorField.name + 'Error'] = errorField.message
            }
          } else {
            this.errorMessage = error.response?.data?.message || 'Ocurrió un error en el servidor' 
          }
        }
      },
      async remove () {
        try {
          const response = await this.axios.delete(`categories/${this.categoryId}`)
          this.$router.push({ name: 'admin-categories' })

        } catch (error) {
          alert('Ocurrió un error')  
          console.error(error)
        }
      }
    }
  }
</script>
