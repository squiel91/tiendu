'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tienduButtonVue = require('/scripts/tiendu-button.vue.js');

var _tienduButtonVue2 = _interopRequireDefault(_tienduButtonVue);

var _tienduSecondaryButtonVue = require('/scripts/tiendu-secondary-button.vue.js');

var _tienduSecondaryButtonVue2 = _interopRequireDefault(_tienduSecondaryButtonVue);

var _tienduInputVue = require('/scripts/tiendu-input.vue.js');

var _tienduInputVue2 = _interopRequireDefault(_tienduInputVue);

var _tienduImagePickerVue = require('/scripts/tiendu-image-picker.vue.js');

var _tienduImagePickerVue2 = _interopRequireDefault(_tienduImagePickerVue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  props: {
    value: Object,
    defaultPrice: Number,
    defaultCompareAt: Number,
    defaultStock: Number
  },
  components: {
    tienduButton: _tienduButtonVue2.default,
    tienduSecondaryButton: _tienduSecondaryButtonVue2.default,
    tienduInput: _tienduInputVue2.default,
    imagePicker: _tienduImagePickerVue2.default
  },
  methods: {
    addOption: function addOption() {
      this.value.options.push('');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.value.variants[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var variant = _step.value;

          variant.values.push('');
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    },
    moveVariant: function moveVariant(variantIndex, direction) {
      if (direction === 'up') {
        if (variantIndex > 0) {
          var temporal = this.value.variants[variantIndex];
          this.$set(this.value.variants, variantIndex, this.value.variants[variantIndex - 1]);
          this.$set(this.value.variants, variantIndex - 1, temporal);
        }
      } else {
        // direction === 'down'
        if (variantIndex < this.value.variants.length - 1) {
          var _temporal = this.value.variants[variantIndex];
          this.$set(this.value.variants, variantIndex, this.value.variants[variantIndex + 1]);
          this.$set(this.value.variants, variantIndex + 1, _temporal);
        }
      }
    },
    toggleDetails: function toggleDetails(variant) {
      if (typeof variant.showDetails === 'undefined') {
        this.$set(variant, 'showDetails', true);
      } else {
        variant.showDetails = !variant.showDetails;
      }
    },
    removeOption: function removeOption(index) {
      this.value.options.splice(index, 1);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.value.variants[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var variant = _step2.value;

          variant.values.splice(index, 1);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    },
    addVariant: function addVariant() {
      var variant = {
        values: this.value.options.map(function (option) {
          return '';
        }),
        price: this.defaultPrice,
        compareAt: this.defaultCompareAt,
        stock: this.defaultStock,
        images: []
      };
      this.value.variants.push(variant);
    },
    removeVariant: function removeVariant(index) {
      this.value.variants.splice(index, 1);
    }
  },
  template: /* html */'\n<div class="variants-container">\n  <div style="overflow-y: auto;">\n    <div style="margin-bottom: 16px;" :style="{minWidth: ((this.value?.options?.length || 0) * 250 + 250) + \'px\'}">\n      <div class="variants-vertical-grid">\n        <div class="variants-horizontal-grid">\n          <div v-for="(option, optionIndex) in value.options" key="option" class="option">\n            <tiendu-input placeholder="Talle" :id="\'opt-\' + optionIndex" :remove="value.options.length > 1" @remove="removeOption(optionIndex)" label="Opci\xF3n" v-model="value.options[optionIndex]"></tiendu-input>\n          </div>\n          <div class="handler">\n            <tiendu-button style="width: 100%;" @click="addOption()">Agregar opci\xF3n</tiendu-button>\n          </div>\n        </div>\n        <template v-for="(variant, variantIndex) in value.variants">\n          <div class="variants-horizontal-grid variant">\n            <div v-for="(value, optionIndex) in variant.values">\n              <tiendu-input placeholder="Valor" :id="\'opt-\' + optionIndex + \'-var-\' + variantIndex" v-model="variant.values[optionIndex]"></tiendu-input>\n            </div>\n            <div class="edit-button" style="display: grid; gap: 8px; grid-auto-flow: column; align-self: stretch;">\n              <tiendu-secondary-button :stretch="true" @click="moveVariant(variantIndex, \'up\')"><i class="bi bi-chevron-up"></i></tiendu-secondary-button>\n              <tiendu-secondary-button :stretch="true" @click="moveVariant(variantIndex, \'down\')"><i class="bi bi-chevron-down"></i></tiendu-secondary-button>\n              <tiendu-secondary-button :stretch="true" @click="toggleDetails(variant)"><i class="bi bi-pencil-square"></i></tiendu-secondary-button>\n              <tiendu-secondary-button :stretch="true" @click="removeVariant(variantIndex)"><i class="bi bi-trash-fill"></i></tiendu-secondary-button>\n            </div>\n          </div>\n          <div class="variant-details-grid" v-if="variant.showDetails">\n            <tiendu-input label="Precio $" :id="\'price-var-\' + variantIndex" v-model.number="variant.price" type="number" step="1"></tiendu-input>\n            <tiendu-input label="Referencia $" :id="\'compare-at-var-\' + variantIndex" type="number" step="1" v-model.number="variant.compareAt" help="Puramente de m\xE1rketing. Es el precio que aparece como el que estaba antes de hacer un descuento. Aparece tachado al lado del precio real."></tiendu-input>\n            <tiendu-input label="Stock" v-model.number="variant.stock" :id="\'stock-var-\' + variantIndex" type="number" step="1" placeholder="ilimitado" help="Cada vez que se compra un producto el stock baja. Se puede dejar vac\xEDo para no llevara un registro del stock."></tiendu-input>\n            <image-picker v-model="variant.images" style="grid-column: 1/-1">\n              <span>\n                Seleccionar im\xE1genes\n              </span>\n            </image-picker>\n          </div>\n        </template>\n      </div>\n    </div>\n  </div>\n  <tiendu-button normal-text="Agregar variante" @click="addVariant()"></tiendu-button>\n</div>'
};