<template>
  <div id="product-page" class="container">
    <Breadcrumb :stack="[{ label: 'Productos', routerLink: { name: 'admin-products' } }]" active="Edición" />
    <div style="display: flex;">
      <h1 style="flex-grow: 1; margin-bottom: 40px;">Editor de producto</h1>
      <div>
        <SecondaryButton v-if="originalHandle" :disabled="createProduct" :link="{ name: 'store-product', params: { productHandle: originalHandle } }" style="margin-right: 8px;">
          <div>
            <span class="hide-mobile">
              Visualizar
            </span>
            <i class="hide-tablet-and-up bi bi-box-arrow-up-right"></i>
          </div>
        </SecondaryButton>
        <SecondaryButton :disabled="createProduct" @click="remove()">
          <div>
            <span class="hide-mobile">
              Borrar
            </span>
            <i class="hide-tablet-and-up bi bi-trash-fill"></i>
          </div>
        </SecondaryButton>
      </div>
    </div>
    <div class="product-editor-grid">
      <Input label="Título" id="title" v-model="title" :error="titleError" class="span-2-col" help="El título principal, que se muestra arriba de la página."></Input> 
      <Input :label="handleRoute" id="handle" @input="handleChanged()" v-model="handle" :error="handleError" help="Es como se verá la dirección del producto en la barra superior del navegador. Debe ser único para cada página (no se puede repetir)."></Input>
      <Input label="Precio $" id="price" v-model.number="price" type="number" :step="1" :error="priceError"></Input>
      <Input label="Precio referencia $" id="compareAt" type="number" :step="1" v-model.number="compareAt" :error="compareAtError" help="Puramente de márketing. Es el precio que aparece como el que estaba antes de hacer un descuento. Aparece tachado al lado del precio real."></Input>
      <Input label="Stock" v-model.number="stock" id="stock" type="number" :step="1" placeholder="ilimitado" :error="stockError" help="Cada vez que se compra un producto el stock baja. Se puede dejar vacío para no llevara un registro del stock."></Input>
      <div v-if="hasVariants" style="grid-column: 1 / -1;">
        <div class="tip">
          Los valores anteriores son utilizados como valores por defecto para las nuevas variantes creadas.
        </div>
      </div>
      <div class="first-col span-3-col" style="align-items: center; display: flex;">
        <input type="checkbox" v-model="hasVariants" name="has-variants" id="has-variants">
        <label for="has-variants" style="margin-left: 8px;">Tiene variantes</label>
      </div>
      <div v-show="hasVariants" style="overflow: hidden;" class="first-col span-3-col">
        <ProductVariants ref="variants" :default-price="price" :default-compare-at="compareAt" :default-stock="stock" />
      </div>
      <div class="first-col span-3-col">
        <Textarea ref="textarea" @changed="this.description = $event"></Textarea>
      </div>
      <ImagePicker v-model="images" class="first-col span-3-col">
        <span>
          Seleccionar imágenes
        </span>
      </ImagePicker>
      <div class="first-col span-3-col">
        <h2>Categorías</h2>
        <StaticSelectableTable :items="allCategories" :cols="colCategories"></StaticSelectableTable>
      </div>
      <div class="first-col span-3-col" style="display: flex;">
        <input type="checkbox" id="listed" v-model="listed" style="margin-right: 8px"><label for="listed">Listado</label>
        <input type="checkbox" id="featured" v-model="featured" style="margin-right: 8px; margin-left: 24px;"><label for="featured">Destacado</label>
      </div>
      <div v-if="errorMessage" class="error-message first-col span-2-col">
        <i class="bi bi-exclamation-circle"></i> {{ errorMessage }}
      </div>
      <div class="first-col span-3-col">
        <Button normal-text="Guardar producto" @click="save()"></Button>
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
  import ProductVariants from '../snippets/product-variants.vue'
  
  import isAdmin from '../../common/utils/isAdmin'

  export default {
    beforeRouteEnter: isAdmin,
    components: {
      Breadcrumb,
      Textarea,
      Input,
      StaticSelectableTable,
      Button,
      SecondaryButton,
      ImagePicker,
      ProductVariants
    },
    props: [
      'productId' // router URL
    ],
    data() {
      return {
        createProduct: undefined,
        allCategories: [],
        images: [],
        colCategories: [
          { 
            label: 'Título', 
            val: 'title',
            span: 2,
            html: true,
            format: (title, category) => (category.listed? '<i class="bi bi-circle-fill published" title="Publicado"></i>' : '<i class="bi bi-circle-fill not published" title="No publicado"></i>') + title.replace( /(<([^>]+)>)/ig, '') 
          },
          { label: '# Productos', val: 'products', format: products => products.length }
        ],
        errorMessage: '',
        title: '',
        titleError: '',
        handle: '',
        handleError: '',
        originalHandle: '',
        description: '',
        price: undefined,
        priceError: '',
        compareAt: null,
        compareAtError: '',
        stock: null,
        stockError: '',
        hasVariants: false,
        products: [], // deprecated
        handleModified: false,
        listed: true,
        featured: false,
        loading: false
      }
    },
    computed: {
      handleRoute() {
        return 'Handle /productos/'
      }
    },
    watch: {
      title() {
        this.autocompleteHandle()
      }
    },
    async created () {
      try {
        this.createProduct = this.productId === 'create' 
        if (!this.createProduct) {
          const response = await this.axios.get(`products/${this.productId}`)
          const product = response.data.product
          this.title = product.title
          this.products = product.products
          this.handle = product.handle
          this.price = product.price.default || product.price
          this.compareAt = typeof product.compareAt === 'object' && product.compareAt !== null ? product.compareAt.default : product.compareAt
          this.stock = typeof product.stock === 'object' && product.stock !== null ? product.stock.default : product.stock
          this.hasVariants = product.hasVariants
          if (this.hasVariants) {
            this.$refs.variants.setVariants(product.options, product.variants)
          }
          this.description = product.description
          this.$refs.textarea.setUp(this.description)
          this.images = product.images || []
          this.originalHandle = product.handle
          this.handleModified = product.handle.length > 0 
          this.listed = product.listed,
          this.featured =  product.featured

          await this.getAllCategories()
        } else {
          await this.getAllCategories()
        }
      } catch (error) {
        this.error = true
        console.error(error)
      }
    },
    methods: {
      async getAllCategories () {
        const response = await this.axios.get(`categories`, { params: { all: true } })
          this.allCategories = response.data.categories?.map(category => {
            category.included = category.products.includes(this.productId)
            return category
          })
          this.allCategories.sort((cat1, cat2) => (cat1.included === cat2.included)? 0 : cat1.included? -1 : 1)
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
          const params = {
            title: this.title,
            handle: this.handle,
            price: this.price,
            compareAt: this.compareAt || null,
            stock: this.stock === 0 ? 0 : this.stock || null,
            hasVariants: this.hasVariants,
            categories: this.allCategories.filter(cat => cat.included).map(cat => cat.id),
            description: this.description,
            images: this.images?.map(img => img.id), 
            listed: this.listed,
            featured: this.featured
          }
          if (this.hasVariants) {
            params.options = this.$refs.variants.options
            params.variants = this.$refs.variants.variants
          }
          await (this.createProduct? this.axios.post : this.axios.patch)(this.createProduct? 'products' : `products/${this.productId}`, params)

          this.$router.push({ name: 'admin-products' })
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
          await this.axios.delete(`products/${this.productId}`)
          this.$router.push({ name: 'admin-products' })
        } catch (error) {
          alert('Ocurrió un error')  
          console.error(error)
        }
      }
    }
  }

</script>
