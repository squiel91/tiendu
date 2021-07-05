// TODO: in case no link
export default {
  props: {
    items: Array,
    cols: Object,
    mainId: {
      type: String,
      default: 'id'
    },
    itemsPerPage: {
      type: Number,
      default: 6
    }
  },
  data () {
    return {
      // pagination
      currentPage: 1
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.totalItems() / this.itemsPerPage)
    },
    totalItems () {
      return this.items ? this.items.length : 0
    },
    pageItems () {
      return this.items && this.items.slice(this.itemsPerPage * (this.currentPage - 1), this.itemsPerPage * this.currentPage)
    },
    from () {
      return this.itemsPerPage * (this.currentPage - 1) + 1
    },
    to () {
      return Math.min(this.totalItems, this.itemsPerPage * this.currentPage)
    },
    hasNext () {
      return this.itemsPerPage * this.currentPage < this.totalItems
    },
    hasPrev () {
      return this.currentPage > 1
    }
  },
  methods: {
    extractVal (item, pathStr) {
      const path = pathStr ? pathStr.split('.') : []
      let current = item
      for (const property of path) {
        current = current[property]
      }
      return current
    }
  },
  template: /* html */ `
    <div class="table" :class="{'add-spacing': totalPages <= 1 }">
      <div class="row header">
        <div class="col">Incluido</div>
        <div v-for="col in cols" class="col" :style="{ 'grid-column': 'span ' + (col.span || 1) }" :class="{'hide-mobile': col.hideMobile}">{{ col.label }}</div>
      </div>
      
      <div class="feedback" v-if="!pageItems || pageItems.length === 0 ">
        <i class="bi bi-inbox-fill"></i> Nada aún por mostrar
      </div>
      <template v-else>
        <label v-for="item in pageItems" :key="item[mainId]" :for="'select-' + item.id">
          <div class="row">
            <div class="col"><input :id="'select-' + item.id" v-model="item.included" type="checkbox"></div>
            <template v-for="col in cols">
              <div v-if="!col.html" class="col" :style="{ 'grid-column': 'span ' + (col.span || 1) }" :class="{'hide-mobile': col.hideMobile}">{{ (col.format || (i => i))(extractVal(item, col.val), item) }}</div>
              <div v-else :style="{ 'grid-column': 'span ' + (col.span || 1) }" v-html="(col.format || (i => i))(extractVal(item, col.val), item)" class="col" :class="{'hide-mobile': col.hideMobile}"></div>
            </template>
          </div>        
        </label>
        <div v-if="totalPages > 1" class="pagination">
          <span class="details">
            {{ from }}-{{ to }} de {{ totalItems }}
          </span>
          <button @click="--currentPage" :disabled="!hasPrev"><i class="bi bi-chevron-left"></i></button>
          <button @click="++currentPage" :disabled="!hasNext"><i class="bi bi-chevron-right"></i></button>
        </div>
      </template>
    </div>    
    `
}
