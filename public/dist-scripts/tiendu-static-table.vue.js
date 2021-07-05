'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// TODO: in case no link
exports.default = {
  props: {
    items: Array,
    cols: Object,
    mainId: {
      type: String,
      default: 'id'
    },
    link: Function,
    itemsPerPage: {
      type: Number,
      default: 6
    }
  },
  data: function data() {
    return {
      // pagination
      currentPage: 1
    };
  },

  computed: {
    totalPages: function totalPages() {
      return Math.ceil(this.totalItems() / this.itemsPerPage);
    },
    totalItems: function totalItems() {
      return this.items ? this.items.length : 0;
    },
    pageItems: function pageItems() {
      return this.items && this.items.slice(this.itemsPerPage * (this.currentPage - 1), this.itemsPerPage * this.currentPage);
    },
    from: function from() {
      return this.itemsPerPage * (this.currentPage - 1) + 1;
    },
    to: function to() {
      return Math.min(this.totalItems, this.itemsPerPage * this.currentPage);
    },
    hasNext: function hasNext() {
      return this.itemsPerPage * this.currentPage < this.totalItems;
    },
    hasPrev: function hasPrev() {
      return this.currentPage > 1;
    }
  },
  methods: {
    extractVal: function extractVal(item, pathStr) {
      var path = pathStr ? pathStr.split('.') : [];
      var current = item;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var property = _step.value;

          current = current[property];
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

      return current;
    }
  },
  template: '\n    <div class="table" :class="{\'add-spacing\': totalPages <= 1 }">\n      <div class="row header">\n        <div v-for="col in cols" class="col" :style="{ \'grid-column\': \'span \' + (col.span || 1) }" :class="{\'hide-mobile\': col.hideMobile}">{{ col.label }}</div>\n      </div>\n      <div class="feedback" v-if="!pageItems || pageItems.length === 0 ">\n        <i class="bi bi-inbox-fill"></i> Nada a\xFAn por mostrar\n      </div>\n      <template v-else>\n        <a v-for="item in pageItems" :key="item[mainId]" :href="link(item)">\n          <div class="row">\n            <template v-for="col in cols">\n              <div v-if="!col.html" class="col" :style="{ \'grid-column\': \'span \' + (col.span || 1) }" :class="{\'hide-mobile\': col.hideMobile}">{{ (col.format || (i => i))(extractVal(item, col.val), item) }}</div>\n              <div v-else :style="{ \'grid-column\': \'span \' + (col.span || 1) }" v-html="(col.format || (i => i))(extractVal(item, col.val), item)" class="col" :class="{\'hide-mobile\': col.hideMobile}"></div>\n            </template>\n          </div>        \n        </a>\n        <div v-if="totalPages > 1" class="pagination">\n          <span class="details">\n            {{ from }}-{{ to }} de {{ totalItems }}\n          </span>\n          <button @click="--currentPage" :disabled="!hasPrev"><i class="bi bi-chevron-left"></i></button>\n          <button @click="++currentPage" :disabled="!hasNext"><i class="bi bi-chevron-right"></i></button>\n        </div>\n      </template>\n    </div>    \n    '
};