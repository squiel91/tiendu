<template>
  <div class="container">
    <Breadcrumb :stack="[{ label: 'Blog', to: { name: 'store-blog' } }]" :active="post?.title" />
  </div>
  <Loading :status="status" />
  <div v-if="status === 'ready'" id="post-page" class="container">
    <div v-if="post.cover" class="post-cover" :style="{ backgroundImage: `url('${devHost}${post.cover.src}')` }" />

    <h1>{{ post.title }}</h1>
    <div class="post-details">Por {{ post.author }} el {{ post.created }}</div> 
    <div v-html="post.content" class="post-content span-2-col-desktop" />
  </div>
</template>

<script>
  import DevMixin from '../../common/utils/dev.mixin'
  import Loading from '../snippets/fetching.snippet.vue'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'

  export default {
    mixins: [DevMixin],
    props: ['postHandle'],
    emits: ['resourceIdChanged'],
    components: {
      Loading,
      Breadcrumb
    },
    data() {
      return {
        status: 'loading',
        post: undefined,
      }
    },
    created () {
      this.fetchPost()
    },
    methods: {
      async fetchPost () {
        try {
          const response = await this.axios(`posts/${this.postHandle}`, { params: { handle: true } })
          this.post = response.data.post
          this.$emit('resourceIdChanged', this.post.id)
          this.status = 'ready'
        } catch (error) {
          console.log(error)
          this.status = 'error'
        }
      }
    },
    watch: {
      postHandle () {
        this.fetchPost()
      }
    }
  }
</script>
