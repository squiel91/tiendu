import staticPagingMixin from '/statics/scripts/tiendu-static-paging-mixin.vue.js'
import secondaryButton from '/statics/scripts/tiendu-secondary-button.vue.js'

export default {
  mixins: [staticPagingMixin],
  props: {
    imageQty: {
      type: Number,
      default: 1
    },
    value: {
      type: Array,
      default: []
    },
    justOne: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      pickerVisible: false,
      items: [],
      currentPage: 1
    }
  },
  methods: {
    show () {
      this.pickerVisible = true
    },
    hide () {
      this.pickerVisible = false
    },
    selectItem (item) {
      const selection = !item.selected
      if (this.justOne) {
        for (const image of this.items) {
          image.selected = false
        }
      }
      item.selected = selection
    },
    select () {
      const selectedImages = []
      for (const image of this.items) {
        if (image.selected) {
          selectedImages.push(image)
        }
      }
      this.$emit('input', selectedImages)
      this.hide()
    },
    async uploadImage (event) {
      const fileInput = event.target
      for (const file of fileInput.files) {
        try {
          const formData = new FormData()
          formData.append('image', file)
          const response = await axios.post('/images', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          if (response.data.success) {
            const newImage = response.data.image
            this.items.unshift(newImage)
            this.$set(newImage, 'selected', false)
            this.currentPage = 1 // move to the beggining
            this.selectItem(newImage)
          }
        } catch (error) {
          alert('Hubo un error subiendo la imágen')
          console.error(error)
        }
      }
    },
    removeSelected (image) {
      this.$emit('input', this.value.filter(imageIter => imageIter.id !== image.id))
    }
  },
  computed: {
    selectedId () {
      return this.value.map(image => image.id)
    },
    hasItems () {
      return this.items?.length > 0
    }
  },
  watch: {
    value () {
      for (const image of this.items) {
        image.selected = this.selectedId.includes(image.id)
      }
    }
  },
  async created () {
    try {
      const response = await axios.get('images')

      this.items = response.data.images.map(image => {
        image.selected = this.selectedId.includes(image.id)
        return image
      })
    } catch (error) {
      console.error(error)
    }
  },
  template: /* html */ `
    <div>
      <div v-if="!pickerVisible">
        <div class="image-picker-actions">
          <secondary-button @click="show()"><slot></slot></secondary-button>
        </div>
        <draggable class="selected-image-grid" :value="value" @input="$emit('input', $event)" group="people" @start="drag=true" @end="drag=false">
          <div 
            v-for="image in value"
            :key="image.id"
            class="img-thumb"
            :style="{ backgroundImage: 'url(\\'' + image.src + '\\')' }"
          >
            <button class="remove" @click="removeSelected(image)"><i class="bi bi-trash-fill"></i></button>
          </div>
        </draggable>
      </div>
      <div v-else class="image-picker-select-panel">
        <div class="image-picker-actions">
          <div style="display: flex;">
            <secondary-button v-if="hasItems" @click="select()" style="margin-right: 8px;">Seleccionar</secondary-button>
            <secondary-button @click="$refs.imageUpload.click()">Subir Imágen</secondary-button>
          </div>
          <div class="image-picker-close">
            <secondary-button @click="hide()"><i class="bi bi-x-lg"></i></secondary-button>
          </div>
        </div>
        <div class="picker-grid">
          <div 
            v-for="image in pageItems"
            :key="image.id"
            class="img-thumb"
            :class="{ selected: image.selected }"
            :style="{ backgroundImage: 'url(\\'' + image.src + '\\')' }"
            @click="selectItem(image)"
          ></div>          
        </div>
        <div v-if="totalPages > 1" class="pagination" style="padding-bottom: 0;">
          <span class="details">
            {{ from }}-{{ to }} de  {{ currentPage }} de {{ totalItems }}
          </span>
          <button @click="--currentPage" :disabled="!hasPrev"><i class="bi bi-chevron-left"></i></button>
          <button @click="++currentPage" :disabled="!hasNext"><i class="bi bi-chevron-right"></i></button>
        </div>
        <input type="file" ref="imageUpload" style="display: none;"  @change="uploadImage($event)" multiple/>
      </div>
    </div>
  `,
  components: {
    secondaryButton
  }
}
