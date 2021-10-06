<template>
  <div class="image-picker-snippet">
    <div>
      <div class="image-picker-actions">
        <SecondaryButton @click="show()"><slot></slot></SecondaryButton>
      </div>
      <div class="selected-image-grid">
        <draggable v-model="modelValue" @change="$emit('update:modelValue', modelValue)" tag="transition-group" item-key="id">
          <template #item="{element}">
            <div
              class="img-thumb"
              :style="{ backgroundImage: `url('${devHost}${element.thumbSrc}')` }"
            >
              <button class="remove" @click="removeSelected(element)"><i class="bi bi-trash-fill"></i></button>
            </div>
          </template>
        </draggable>
      </div>
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
            <template 
              v-for="image in pageItems"
              :key="image"
            >
              <div v-if="image.uploadImage" @click="$refs.imageUpload.click()" class="img-thumb uploadImageButton">
                <div class="loading-icons">
                  <i v-if="uploading <= 0" class="bi bi-upload"></i>
                  <i v-if="uploading > 0" class="bi bi-hourglass-split animate-rotate"></i>
                  <p v-if="uploading <= 0" style="font-size: small; padding: 0px; margin: 0px; font-weight: bold;">Subir</p>
                  <p v-if="uploading > 0" style="font-size: small; padding: 0px; margin: 0px; font-weight: bold;">Subiendo...</p>
                </div>
              </div>
              <div
                v-else
                class="img-thumb"
                :class="{ selected: image.selected }"
                :style="{ backgroundImage: `url('${devHost}${image.thumbSrc}')` }"
                @click="selectItem(image)"
              ></div> 
            </template>
          </div>
          <div v-if="totalPages > 1" class="pagination" style="padding-bottom: 0;">
            <span class="details">
              {{ from }}-{{ to }} de {{ totalItems }}
            </span>
            <button @click="--currentPage" :disabled="!hasPrev"><i class="bi bi-chevron-left"></i></button>
            <button @click="++currentPage" :disabled="!hasNext"><i class="bi bi-chevron-right"></i></button>
          </div>
          <input type="file" ref="imageUpload" style="display: none;"  @change="uploadImage($event)" multiple/>
          <Button v-if="hasItems" @click="select()" style="margin-top: 12px;">Seleccionar</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'

  import StaticPagingMixin from '../utils/static-paging.mixin.vue'
  import Button from './button.snippet.vue'
  import SecondaryButton from './secondary-button.snippet.vue'

  import isDev from '../../common/utils/isDev.js'

  export default {
    components: {
      Button,
      SecondaryButton,
      draggable
    },
    mixins: [StaticPagingMixin],
    props: {
      imageQty: {
        type: Number,
        default: 1
      },
      modelValue: {
        type: Array,
        default: []
      },
      justOne: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:modelValue'],
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
        this.$emit('update:modelValue', selectedImages)
        this.hide()
      },
      async uploadImage (event) {
        const fileInput = event.target
        this.uploading = fileInput.files.length
        for (const file of fileInput.files) {
          try {
            const formData = new FormData()
            formData.append('image', file)
            const response = await this.axios.post('/images', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            const newImage = response.data.image
            this.items.splice(1, 0, newImage)
            newImage['selected'] = false
            this.currentPage = 1 // move to the beggining
            this.selectItem(newImage)
          } catch (error) {
            alert('Hubo un error subiendo la imágen')
            console.error(error)
          } finally {
            this.uploading -= 1
          }
        }
      },
      removeSelected (image) {
        this.$emit('update:modelValue', this.modelValue.filter(imageIter => imageIter.id !== image.id))
      }
    },
    computed: {
      selectedId () {
        return this.modelValue.map(image => image.id)
      },
      hasItems () {
        return this.items && this.items.length > 1 // has a dummy first element to upload image
      },
      devHost () {
        return isDev ? 'http://localhost:5001' : ''
      }
    }, 
    watch: {
      modelValue () {
        for (const image of this.items) {
          image.selected = this.selectedId.includes(image.id)
        }
      }
    },
    async created () {
      try {
        const response = await this.axios.get('images')

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
    }
  }
</script>

<style lang="scss">
  .uploadImageButton {
    color: blue;
    font-size: xx-large;
    flex-direction: column;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    .loading-icons {
      position: absolute;
    }
  }

  .uploadImageButton:after {
  content: none;
  display: none;
  padding-bottom: initial;
  }
</style>