import tienduButton from '/statics/scripts/tiendu-button.vue.js'
import tienduInput from '/statics/scripts/tiendu-input.vue.js'

export default {
  props: {
    value: Object,
    defaultPrice: Number,
    defaultCompareAt: Number,
    defaultStock: Number
  },
  components: {
    tienduButton,
    tienduInput
  },
  methods: {
    addOption () {
      this.value.options.push('')
      for (const variant of this.value.variants) {
        variant.values.push('')
      }
    },
    moveVariant(variantIndex, direction) {
      if (direction === 'up') {
        if (variantIndex > 0) {
          const temporal = this.value.variants[variantIndex]
          this.$set(this.value.variants, variantIndex, this.value.variants[variantIndex - 1])
          this.$set(this.value.variants, variantIndex - 1, temporal)
        }
      } else {
        // direction === 'down'
        if (variantIndex < this.value.variants.length - 1) {
          const temporal = this.value.variants[variantIndex]
          this.$set(this.value.variants, variantIndex, this.value.variants[variantIndex + 1])
          this.$set(this.value.variants, variantIndex + 1, temporal)
        }
      }
    },
    toggleDetails(variant) {
      if (typeof variant.showDetails === 'undefined') {
        this.$set(variant, 'showDetails', true)
      } else {
        variant.showDetails = !variant.showDetails
      }
    },
    removeOption (index) {
      this.value.options.splice(index, 1)
      for (const variant of this.value.variants) {
        variant.values.splice(index, 1)
      }
    },
    addVariant () {
      const variant = {
        values: this.value.options.map(option => ''),
        price: this.defaultPrice,
        compareAt: this.defaultCompareAt,
        stock: this.defaultStock
      }
      this.value.variants.push(variant)
    },
    removeVariant (index) {
      this.value.variants.splice(index, 1)
    }
  },
  template: /* html */ `
<div :style="{minWidth: ((this.value?.options?.length || 0) * 250 + 250) + 'px'}">
  <div class="variants-vertical-grid">
    <div class="variants-horizontal-grid">
      <div v-for="(option, index) in value.options" key="option" class="option">
        <tiendu-input placeholder="Talle" :remove="value.options.length > 1" @remove="removeOption(index)" label="Opción" v-model="value.options[index]"></tiendu-input>
      </div>
      <div class="handler">
        <tiendu-button style="width: 100%;" @click="addOption()">Agregar opción</tiendu-button>
      </div>
    </div>
    <template v-for="(variant, variantIndex) in value.variants">
      <div class="variants-horizontal-grid variant">
        <div v-for="(value, index) in variant.values">
          <tiendu-input placeholder="Valor" v-model="variant.values[index]"></tiendu-input>
        </div>
        <div class="edit-button" style="display: flex;">
        <tiendu-button style="flex-grow: 1; margin-right: 8px; padding: 16px; width: auto !important;" @click="moveVariant(variantIndex, 'up')"><i class="bi bi-chevron-up"></i></tiendu-button>
        <tiendu-button style="flex-grow: 1; margin-right: 8px; padding: 16px; width: auto !important;" @click="moveVariant(variantIndex, 'down')"><i class="bi bi-chevron-down"></i></tiendu-button>
        <tiendu-button style="flex-grow: 1; margin-right: 8px; padding: 16px; width: auto !important;" @click="toggleDetails(variant)"><i class="bi bi-pencil-square"></i></tiendu-button>
          <tiendu-button style="flex-grow: 1;padding: 16px; width: auto !important;" @click="removeVariant(variantIndex)"><i class="bi bi-trash-fill"></i></tiendu-button>
        </div>
      </div>
      <div class="variant-details-grid" v-if="variant.showDetails">
        <tiendu-input label="Precio $" id="price" v-model.number="variant.price" type="number" step="1"></tiendu-input>
        <tiendu-input label="Precio referencia $" id="compareAt" type="number" step="1" v-model.number="variant.compareAt" help="Puramente de márketing. Es el precio que aparece como el que estaba antes de hacer un descuento. Aparece tachado al lado del precio real."></tiendu-input>
        <tiendu-input label="Stock" v-model.number="variant.stock" id="stock" type="number" step="1" placeholder="ilimitado" help="Cada vez que se compra un producto el stock baja. Se puede dejar vacío para no llevara un registro del stock."></tiendu-input>
      </div>
    </template>
    <div>
      <tiendu-button normal-text="Agregar variante" @click="addVariant()"></tiendu-button>
    </div>
  </div>
</div>`
}
