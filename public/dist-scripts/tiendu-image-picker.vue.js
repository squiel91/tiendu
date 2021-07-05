'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tienduStaticPagingMixinVue = require('/scripts/tiendu-static-paging-mixin.vue.js');

var _tienduStaticPagingMixinVue2 = _interopRequireDefault(_tienduStaticPagingMixinVue);

var _tienduButtonVue = require('/scripts/tiendu-button.vue.js');

var _tienduButtonVue2 = _interopRequireDefault(_tienduButtonVue);

var _tienduSecondaryButtonVue = require('/scripts/tiendu-secondary-button.vue.js');

var _tienduSecondaryButtonVue2 = _interopRequireDefault(_tienduSecondaryButtonVue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
  mixins: [_tienduStaticPagingMixinVue2.default],
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
  data: function data() {
    return {
      pickerVisible: false,
      items: [],
      uploading: 0
    };
  },

  methods: {
    show: function show() {
      this.pickerVisible = true;
    },
    hide: function hide() {
      this.pickerVisible = false;
    },
    selectItem: function selectItem(item) {
      var selection = !item.selected;
      if (this.justOne) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var image = _step.value;

            image.selected = false;
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
      }
      item.selected = selection;
    },
    select: function select() {
      var selectedImages = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var image = _step2.value;

          if (image.selected) {
            selectedImages.push(image);
          }
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

      this.$emit('input', selectedImages);
      this.hide();
    },
    uploadImage: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
        var fileInput, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, file, formData, response, newImage;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                fileInput = event.target;

                this.uploading = fileInput.files.length;
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context.prev = 5;
                _iterator3 = fileInput.files[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context.next = 28;
                  break;
                }

                file = _step3.value;
                _context.prev = 9;
                formData = new FormData();

                formData.append('image', file);
                _context.next = 14;
                return axios.post('/images', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                });

              case 14:
                response = _context.sent;

                if (response.data.success) {
                  newImage = response.data.image;

                  this.items.splice(1, 0, newImage);
                  this.$set(newImage, 'selected', false);
                  this.currentPage = 1; // move to the beggining
                  this.selectItem(newImage);
                }
                _context.next = 22;
                break;

              case 18:
                _context.prev = 18;
                _context.t0 = _context['catch'](9);

                alert('Hubo un error subiendo la imágen');
                console.error(_context.t0);

              case 22:
                _context.prev = 22;

                this.uploading -= 1;
                return _context.finish(22);

              case 25:
                _iteratorNormalCompletion3 = true;
                _context.next = 7;
                break;

              case 28:
                _context.next = 34;
                break;

              case 30:
                _context.prev = 30;
                _context.t1 = _context['catch'](5);
                _didIteratorError3 = true;
                _iteratorError3 = _context.t1;

              case 34:
                _context.prev = 34;
                _context.prev = 35;

                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }

              case 37:
                _context.prev = 37;

                if (!_didIteratorError3) {
                  _context.next = 40;
                  break;
                }

                throw _iteratorError3;

              case 40:
                return _context.finish(37);

              case 41:
                return _context.finish(34);

              case 42:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 30, 34, 42], [9, 18, 22, 25], [35,, 37, 41]]);
      }));

      function uploadImage(_x) {
        return _ref.apply(this, arguments);
      }

      return uploadImage;
    }(),
    removeSelected: function removeSelected(image) {
      this.$emit('input', this.value.filter(function (imageIter) {
        return imageIter.id !== image.id;
      }));
    }
  },
  computed: {
    selectedId: function selectedId() {
      return this.value.map(function (image) {
        return image.id;
      });
    },
    hasItems: function hasItems() {
      return this.items && this.items.length > 1; // has a dummy first element to upload image
    }
  },
  watch: {
    value: function value() {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.items[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var image = _step4.value;

          image.selected = this.selectedId.includes(image.id);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  },
  created: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var _this = this;

      var response;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return axios.get('images');

            case 3:
              response = _context2.sent;


              this.items = response.data.images.map(function (image) {
                image.selected = _this.selectedId.includes(image.id);
                return image;
              });
              this.items.unshift({
                uploadImage: true
              });
              _context2.next = 11;
              break;

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2['catch'](0);

              console.error(_context2.t0);

            case 11:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[0, 8]]);
    }));

    function created() {
      return _ref2.apply(this, arguments);
    }

    return created;
  }(),

  template: /* html */'\n    <div>\n      <div>\n        <div class="image-picker-actions">\n          <secondary-button @click="show()"><slot></slot></secondary-button>\n        </div>\n        <draggable class="selected-image-grid" :value="value" @input="$emit(\'input\', $event)">\n          <div \n            v-for="image in value"\n            :key="image.id"\n            class="img-thumb"\n            :style="{ backgroundImage: \'url(\\\'\' + image.src + \'\\\')\' }"\n          >\n            <button class="remove" @click="removeSelected(image)"><i class="bi bi-trash-fill"></i></button>\n          </div>\n        </draggable>\n      </div>\n      <div v-if="pickerVisible" class="image-picker-select-panel">\n        <div class="image-picker-select-panel-overlay" @click="hide()"></div>\n        <div class="container">\n          <div class="image-picker-select-panel-inner">\n            <div class="image-picker-actions" style="justify-content: flex-end;">\n              <div class="image-picker-close">\n                <button style="color: blue; border: none; background-color: transparent; padding: 8px;" @click="hide()"><i class="bi bi-x-lg"></i></button>\n              </div>\n            </div>\n            <div class="picker-grid">\n              <div \n                v-for="image in pageItems"\n                v-if="image.uploadImage"\n                @click="$refs.imageUpload.click()"\n                class="img-thumb uploadImageButton"\n              >\n                <div style="color: blue; font-size: xx-large; position: absolute; flex-direction: column; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; text-align: center;">\n                  <i v-if="uploading <= 0" class="bi bi-upload"></i>\n                  <i v-if="uploading > 0" class="bi bi-hourglass-split animate-rotate"></i>\n                  <p v-if="uploading <= 0" style="font-size: small; padding: 0px; margin: 0px; font-weight: bold;">Subir</p>\n                  <p v-if="uploading > 0" style="font-size: small; padding: 0px; margin: 0px; font-weight: bold;">Subiendo...</p>\n                </div>\n              </div>\n              <div\n                v-else\n                :key="image.id"\n                class="img-thumb"\n                :class="{ selected: image.selected }"\n                :style="{ backgroundImage: \'url(\\\'\' + image.thumbSrc + \'\\\')\' }"\n                @click="selectItem(image)"\n              ></div> \n            </div>\n            <div v-if="totalPages > 1" class="pagination" style="padding-bottom: 0;">\n              <span class="details">\n                {{ from }}-{{ to }} de  {{ currentPage }} de {{ totalItems }}\n              </span>\n              <button @click="--currentPage" :disabled="!hasPrev"><i class="bi bi-chevron-left"></i></button>\n              <button @click="++currentPage" :disabled="!hasNext"><i class="bi bi-chevron-right"></i></button>\n            </div>\n            <input type="file" ref="imageUpload" style="display: none;"  @change="uploadImage($event)" multiple/>\n            <tiendu-button v-if="hasItems" @click="select()" style="margin-top: 12px;">Seleccionar</secondary-button>\n          </div>\n        </div>\n      </div>\n    </div>\n  ',
  components: {
    tienduButton: _tienduButtonVue2.default,
    secondaryButton: _tienduSecondaryButtonVue2.default
  }
};