import staticPagingMixin from '/statics/scripts/tiendu-static-paging-mixin.vue.js'
import tienduButton from '/statics/scripts/tiendu-button.vue.js'
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
      uploading: 0
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
      this.uploading = fileInput.files.length
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
            this.items.splice(1, 0, newImage)
            this.$set(newImage, 'selected', false)
            this.currentPage = 1 // move to the beggining
            this.selectItem(newImage)
          }
        } catch (error) {
          alert('Hubo un error subiendo la imágen')
          console.error(error)
        } finally {
          this.uploading -= 1
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
      return this.items?.length > 1 // has a dummy first element to upload image
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
      this.items.unshift({
        uploadImage: true
      })
    } catch (error) {
      console.error(error)
    }
  },
  template: /* html */ `
    <div>
      <div>
        <div class="image-picker-actions">
          <secondary-button @click="show()"><slot></slot></secondary-button>
        </div>
        <draggable class="selected-image-grid" :value="value" @input="$emit('input', $event)">
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
      <div v-if="pickerVisible" class="image-picker-select-panel">
        <div class="image-picker-select-panel-overlay" @click="hide()"></div>
        <div class="container">
          <div class="image-picker-select-panel-inner">
            <div class="image-picker-actions" style="justify-content: flex-end;">
              <div class="image-picker-close">
                <button style="color: blue; border: none; background-color: transparent; padding: 8px;" @click="hide()"><i class="bi bi-x-lg"></i></button>
              </div>
            </div>
            <div class="picker-grid">
              <div 
                v-for="image in pageItems"
                v-if="image.uploadImage"
                @click="$refs.imageUpload.click()"
                class="img-thumb uploadImageButton"
              >
                <div style="color: blue; font-size: xx-large; position: absolute; flex-direction: column; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; text-align: center;">
                  <i v-if="uploading <= 0" class="bi bi-upload"></i>
                  <i v-if="uploading > 0" class="bi bi-hourglass-split animate-rotate"></i>
                  <p v-if="uploading <= 0" style="font-size: small; padding: 0px; margin: 0px; font-weight: bold;">Subir</p>
                  <p v-if="uploading > 0" style="font-size: small; padding: 0px; margin: 0px; font-weight: bold;">Subiendo...</p>
                </div>
              </div>
              <div
                v-else
                :key="image.id"
                class="img-thumb"
                :class="{ selected: image.selected }"
                :style="{ backgroundImage: 'url(\\'' + image.thumbSrc + '\\')' }"
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
            <tiendu-button v-if="hasItems" @click="select()" style="margin-top: 12px;">Seleccionar</secondary-button>
          </div>
        </div>
      </div>
    </div>
  `,
  components: {
    tienduButton,
    secondaryButton
  }
}
