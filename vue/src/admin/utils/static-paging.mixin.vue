<script>
  export default {
    props: {
      itemsPerPage: {
        type: Number,
        default: 6
      }
    },
    data () {
      return {
        currentPage: 1
      }
    },
    computed: {
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
      },
      totalPages () {
        return Math.ceil(this.totalItems / this.itemsPerPage)
      },
      totalItems () {
        return this.items ? this.items.length : 0
      }
    }
  }
</script>
