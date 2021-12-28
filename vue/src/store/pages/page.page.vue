<template>
  <div class="container">
    <Breadcrumb :active="page?.title" />
  </div>
  <Loading :status="status" />
  <div v-if="status === 'ready'" id="page-page" class="container">
    <h1>{{ page.title }}</h1>
    <div class="grid tablet-and-down-1-desktop-3">
      <div v-html="page.content" class="page-content span-2-col-desktop" />
    </div>
  </div>
</template>

<script>
  import Loading from '../snippets/fetching.snippet.vue'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'

  export default {
    props: ['pageHandle'],
    emits: ['resourceIdChanged'],
    components: {
      Loading,
      Breadcrumb
    },
    data() {
      return {
        status: 'loading',
        page: null,
      }
    },
    created () {
      this.fetchPage()
    },
    methods: {
      async fetchPage () {
        try {
          this.page = null
          this.status = 'loading'
          const response = await this.axios(`pages/${this.pageHandle}`, { params: { handle: true } })
          this.page = response.data.page
          this.$emit('resourceIdChanged', this.page.id)
          this.status = 'ready'
        } catch (error) {
          this.status = 'error'
          console.error(error)
        }
      }
    },
    watch: {
      pageHandle () {
        this.fetchPage()
      }
    }
  }
</script>
