<template>
  <div class="container">
    <Breadcrumb active="Blog" />
  </div>
  <Loading :status='status' />
  <template v-if="status === 'ready'">
    <div v-if="posts.length > 0" id="blog-page" class="container">
      <h1 style="margin-bottom: 48px">Artículos del Vivero</h1>
      <div class="grid big-gap mobile-1-tablet-2-desktop-3">
        <router-link class="blogpost" v-for="post in posts" :key="post.id" :to="{ name: 'store-blog-post', params: { postHandle: post.handle } }">
          <article>
            <div
              v-if="post.cover"
              class="post-cover"
              :style="coverImage(post.cover)"
            />
            <h2>{{ post.title }}</h2>
            <div class="post-details">Por {{ post.author }} el {{ post.created }}</div> 
            <div class="post-content fade" v-html="post.content" />
            <div class="continue-reading">Continúa leyendo <i class="bi bi-arrow-right"></i></div>
          </article>
        </router-link>
      </div>
    </div>
    <div v-else class="empty-container">
      <img class="empty" src="../assets/no-found.svg">
      <p>Nuestro blog aún está <strong>vacío</strong>.<br>Vuelve en unos días.</p>
    </div>
  </template>
</template>

<script>
  import Loading from '../snippets/fetching.snippet.vue'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'
  import DevMixin from '../../common/utils/dev.mixin'

  export default {
    mixins: [DevMixin],
    components: {
      Loading,
      Breadcrumb
    },
    data () {
      return {
        status: 'loading',
        posts: null 
      }
    },
    async created () {
      try {
        const response = await this.axios(`/posts`)
        this.posts = response.data.posts
        this.status = 'ready'
      } catch (error) {
        console.error(error)
        this.status = 'error'
      }
    },
    methods: {
      coverImage (cover) {
        if (!cover) return {}
        return { backgroundImage: `url('${this.devHost}${cover.src}')` }
      }
    }
  }
</script>
