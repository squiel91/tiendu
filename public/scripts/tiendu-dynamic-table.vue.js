export default {
  props: {
    resourceName: String,
    cols: Object,
    params: Object,
    link: {
      type: Boolean,
      default: true
    }
  },
  data () {
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
    } 
  },
  watch: {
    async currentPage(newPage) {
      await this.fetchItems(newPage)
    }
  },
  methods: {
    async fetchItems (page) {
      if (!this.params) this.params = {}
      this.params.page = this.currentPage
      try {
        const response = await axios.get(this.resourceName, { params: this.params })

        if (response.status === 200 && response.data.success) {
          this.items = response.data[this.resourceName]
          if (this.items && this.items.length === 0) {
            this.status = 'empty'
          } else {
            this.status = 'ready'
            this.totalPages = response.data.pagination.pages
            this.totalItems = response.data.pagination.items
            this.from = response.data.pagination.from
            this.to = response.data.pagination.to
            this.hasNext = response.data.pagination.hasNext
            this.hasPrev = response.data.pagination.hasPrev
          }
        } else {
          this.status = 'general-error'
        }
      } catch (error) {
        this.status = 'server-error'
        console.error(error)
      }
    },
    extractVal (item, pathStr) {
      const path = pathStr ? pathStr.split('.') : []
      let current = item
      for (const property of path) {
        current = current[property]
      }
      return current
    }
  },
  async created () {
    await this.fetchItems(1)
  },
  template: /* html */`
    <div class="table" :class="{'add-spacing': totalPages <= 1}">
      <div class="row header">
        <div v-for="col in cols" class="col" :style="{ 'grid-column': 'span ' + (col.span || 1) }" :class="{'hide-mobile': col.hideMobile}">{{ col.label }}</div>
      </div>
      <div class="feedback" v-if="status === 'loading'">
      <i class="bi bi-watch"></i> Cargando...
      </div>
      <div class="feedback" v-if="status === 'empty'">
        <i class="bi bi-inbox-fill"></i> Nada aún por mostrar
      </div>
      <div class="feedback" v-if="status === 'general-error'">
        <i class="bi bi-bug-fill"></i> Ocurrió un error en el servidor
      </div>
      <div class="feedback" v-if="status === 'server-error'">
        <i class="bi bi-plug-fill"></i> Falló la conexión con  el servidor
      </div>
      <template v-if="status === 'ready'">
        <a v-if="link" v-for="item in items" :key="item.id"  :href="'/admin/' + resourceName + '/' + item.id">
          <div class="row">
            <template v-for="col in cols">
              <div v-if="!col.html" class="col" :style="{ 'grid-column': 'span ' + (col.span || 1) }" :class="{'hide-mobile': col.hideMobile}">{{ (col.format || (i => i))(extractVal(item, col.val), item) }}</div>
              <div v-else :style="{ 'grid-column': 'span ' + (col.span || 1) }" v-html="(col.format || (i => i))(extractVal(item, col.val), item)" class="col" :class="{'hide-mobile': col.hideMobile}"></div>
            </template>
          </div>        
        </a>
        <div v-else class="row">
          <template v-for="col in cols">
            <div v-if="!col.html" class="col" :style="{ 'grid-column': 'span ' + (col.span || 1) }" :class="{'hide-mobile': col.hideMobile}">{{ (col.format || (i => i))(extractVal(item, col.val), item) }}</div>
            <div v-else :style="{ 'grid-column': 'span ' + (col.span || 1) }" v-html="(col.format || (i => i))(extractVal(item, col.val), item)" class="col" :class="{'hide-mobile': col.hideMobile}"></div>
          </template>
        </div>
      </template>
      <div v-if="totalPages > 1" class="pagination">
        <span class="details">
          {{ from }}-{{ to }} de {{ totalItems }}
        </span>
        <button @click="--currentPage" :disabled="!hasPrev"><i class="bi bi-chevron-left"></i></button>
        <button @click="++currentPage" :disabled="!hasNext"><i class="bi bi-chevron-right"></i></button>
      </div>
    </div>    
    `
}
