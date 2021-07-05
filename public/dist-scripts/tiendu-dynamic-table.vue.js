'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
  props: {
    resourceName: String,
    cols: Object,
    params: Object,
    link: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      items: [],
      currentPage: 1,
      // pagination
      totalPages: undefined,
      totalItems: undefined,
      from: undefined,
      to: undefined,
      hasNext: undefined,
      hasPrev: undefined,
      status: 'loading'
    };
  },

  watch: {
    currentPage: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(newPage) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.fetchItems(newPage);

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function currentPage(_x) {
        return _ref.apply(this, arguments);
      }

      return currentPage;
    }()
  },
  methods: {
    fetchItems: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(page) {
        var response;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.params) this.params = {};
                this.params.page = this.currentPage;
                _context2.prev = 2;
                _context2.next = 5;
                return axios.get(this.resourceName, { params: this.params });

              case 5:
                response = _context2.sent;


                if (response.status === 200 && response.data.success) {
                  this.items = response.data[this.resourceName];
                  if (this.items && this.items.length === 0) {
                    this.status = 'empty';
                  } else {
                    this.status = 'ready';
                    this.totalPages = response.data.pagination.pages;
                    this.totalItems = response.data.pagination.items;
                    this.from = response.data.pagination.from;
                    this.to = response.data.pagination.to;
                    this.hasNext = response.data.pagination.hasNext;
                    this.hasPrev = response.data.pagination.hasPrev;
                  }
                } else {
                  this.status = 'general-error';
                }
                _context2.next = 13;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2['catch'](2);

                this.status = 'server-error';
                console.error(_context2.t0);

              case 13:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 9]]);
      }));

      function fetchItems(_x2) {
        return _ref2.apply(this, arguments);
      }

      return fetchItems;
    }(),
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
  created: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.fetchItems(1);

            case 2:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function created() {
      return _ref3.apply(this, arguments);
    }

    return created;
  }(),

  template: /* html */'\n    <div class="table" :class="{\'add-spacing\': totalPages <= 1}">\n      <div class="row header">\n        <div v-for="col in cols" class="col" :style="{ \'grid-column\': \'span \' + (col.span || 1) }" :class="{\'hide-mobile\': col.hideMobile}">{{ col.label }}</div>\n      </div>\n      <div class="feedback" v-if="status === \'loading\'">\n      <i class="bi bi-watch"></i> Cargando...\n      </div>\n      <div class="feedback" v-if="status === \'empty\'">\n        <i class="bi bi-inbox-fill"></i> Nada a\xFAn por mostrar\n      </div>\n      <div class="feedback" v-if="status === \'general-error\'">\n        <i class="bi bi-bug-fill"></i> Ocurri\xF3 un error en el servidor\n      </div>\n      <div class="feedback" v-if="status === \'server-error\'">\n        <i class="bi bi-plug-fill"></i> Fall\xF3 la conexi\xF3n con  el servidor\n      </div>\n      <template v-if="status === \'ready\'">\n        <a v-if="link" v-for="item in items" :key="item.id"  :href="\'/admin/\' + resourceName + \'/\' + item.id">\n          <div class="row">\n            <template v-for="col in cols">\n              <div v-if="!col.html" class="col" :style="{ \'grid-column\': \'span \' + (col.span || 1) }" :class="{\'hide-mobile\': col.hideMobile}">{{ (col.format || (i => i))(extractVal(item, col.val), item) }}</div>\n              <div v-else :style="{ \'grid-column\': \'span \' + (col.span || 1) }" v-html="(col.format || (i => i))(extractVal(item, col.val), item)" class="col" :class="{\'hide-mobile\': col.hideMobile}"></div>\n            </template>\n          </div>        \n        </a>\n        <div v-else class="row">\n          <template v-for="col in cols">\n            <div v-if="!col.html" class="col" :style="{ \'grid-column\': \'span \' + (col.span || 1) }" :class="{\'hide-mobile\': col.hideMobile}">{{ (col.format || (i => i))(extractVal(item, col.val), item) }}</div>\n            <div v-else :style="{ \'grid-column\': \'span \' + (col.span || 1) }" v-html="(col.format || (i => i))(extractVal(item, col.val), item)" class="col" :class="{\'hide-mobile\': col.hideMobile}"></div>\n          </template>\n        </div>\n      </template>\n      <div v-if="totalPages > 1" class="pagination">\n        <span class="details">\n          {{ from }}-{{ to }} de {{ totalItems }}\n        </span>\n        <button @click="--currentPage" :disabled="!hasPrev"><i class="bi bi-chevron-left"></i></button>\n        <button @click="++currentPage" :disabled="!hasNext"><i class="bi bi-chevron-right"></i></button>\n      </div>\n    </div>    \n    '
};