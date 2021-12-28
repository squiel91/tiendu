<template>
  <div class="product-variants-snippet variants-container">
    <div style="overflow-y: auto;">
      <div style="margin-bottom: 16px;" :style="{minWidth: ((this.options?.length || 0) * 250 + 250) + 'px'}">
        <div class="variants-vertical-grid">
          <div class="variants-horizontal-grid">
            <div v-for="(option, optionIndex) in options" :key="optionIndex" class="option">
              <Input placeholder="Talle" :id="'opt-' + optionIndex" :remove="options.length > 1" @remove="removeOption(optionIndex)" label="Opción" v-model="options[optionIndex]" />
            </div>
            <div class="handler">
              <Button style="width: 100%;" @click="addOption()">Agregar opción</Button>
            </div>
          </div>
          <template v-for="(variant, variantIndex) in variants" :key="variant">
            <div class="variants-horizontal-grid variant">
              <div v-for="(value, optionIndex) in variant.values" :key="optionIndex">
                <Input placeholder="Valor" :id="'opt-' + optionIndex + '-var-' + variantIndex" v-model="variant.values[optionIndex]" />
              </div>
              <div class="edit-button" style="display: grid; gap: 8px; grid-auto-flow: column; align-self: stretch;">
                <SecondaryButton :stretch="true" @click="moveVariant(variantIndex, 'up')"><i class="bi bi-chevron-up"></i></SecondaryButton>
                <SecondaryButton :stretch="true" @click="moveVariant(variantIndex, 'down')"><i class="bi bi-chevron-down"></i></SecondaryButton>
                <SecondaryButton :stretch="true" @click="toggleDetails(variant)"><i class="bi bi-pencil-square"></i></SecondaryButton>
                <SecondaryButton :stretch="true" @click="removeVariant(variantIndex)"><i class="bi bi-trash-fill"></i></SecondaryButton>
              </div>
            </div>
            <div class="variant-details-grid" v-if="variant.showDetails">
              <Input label="Precio $" :id="'price-var-' + variantIndex" v-model.number="variant.price" type="number" :step="1"></Input>
              <Input label="Referencia $" :id="'compare-at-var-' + variantIndex" type="number" :step="1" v-model.number="variant.compareAt" help="Puramente de márketing. Es el precio que aparece como el que estaba antes de hacer un descuento. Aparece tachado al lado del precio real."></Input>
              <Input label="Stock" v-model.number="variant.stock" :id="'stock-var-' + variantIndex" type="number" :step="1" placeholder="ilimitado" help="Cada vez que se compra un producto el stock baja. Se puede dejar vacío para no llevara un registro del stock."></Input>
              <ImagePicker v-model="variant.images" style="grid-column: 1/-1">
                <span>
                  Seleccionar imágenes
                </span>
              </ImagePicker>
            </div>
          </template>
        </div>
      </div>
    </div>
    <Button normal-text="Agregar variante" @click="addVariant()"></Button>
  </div>
</template>

<script>
  import Button from './button.snippet.vue'
  import SecondaryButton from './secondary-button.snippet.vue'
  import Input from './input.snippet.vue'
  import ImagePicker from './image-picker.snippet.vue'

  export default {
    props: {
      modelValue: Object,
      defaultPrice: Number,
      defaultCompareAt: Number,
      defaultStock: Number,
    },
    data() {
      return {
        options: [''],
        variants: []
      }
    },
    emits: ['update:modelValue'],
    components: {
      Button,
      SecondaryButton,
      Input,
      ImagePicker
    },
    methods: {
      addOption () {
        console.log('addOption')
        this.options.push('')
        for (const variant of this.variants) {
          variant.values.push('')
        }
      },
      moveVariant (variantIndex, direction) {
        if (direction === 'up') {
          if (variantIndex > 0) {
            const temporal = this.variants[variantIndex]
            this.variants[variantIndex] = this.variants[variantIndex - 1]
            this.variants[variantIndex - 1] = temporal
          }
        } else {
          // direction === 'down'
          if (variantIndex < this.variants.length - 1) {
            const temporal = this.variants[variantIndex]
            this.variants[variantIndex] = this.variants[variantIndex + 1]
            this.variants[variantIndex + 1] = temporal
          }
        }
      },
      toggleDetails (variant) {
        if (typeof variant.showDetails === 'undefined') {
          variant['showDetails'] = true
        } else {
          variant.showDetails = !variant.showDetails
        }
      },
      removeOption (index) {
        this.options.splice(index, 1)
        for (const variant of this.variants) {
          variant.values.splice(index, 1)
        }
      },
      addVariant () {
        const variant = {
          values: this.options.map(option => ''),
          price: this.defaultPrice,
          compareAt: this.defaultCompareAt,
          stock: this.defaultStock,
          images: []
        }
        this.variants.push(variant)
      },
      removeVariant (index) {
        this.variants.splice(index, 1)
      },
      setVariants(options, variants) {
        this.options = options
        this.variants = variants
      }
    }
  }
</script>

