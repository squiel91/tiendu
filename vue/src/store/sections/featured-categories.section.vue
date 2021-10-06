<template>
  <section id="featured-categories-section" class="container">
    <div class="swiper-container">
      <div @click="swiperController.slidePrev()" class="change-slide hide-mobile"><i class="bi bi-chevron-left"></i></div>
      <div style="overflow: hidden; position: relative;">
        <Swiper
          :modules="swiperModules"
          :slides-per-view="1"
          :space-between="16"
          @swiper="swiperController = $event"
          autoplay
          :scrollbar="{ draggable: true }"
          :pagination="{ clickable: true }"
          :breakpoints="{
            // when window width is >= 768px
            768: {
              slidesPerView: 3
            }
          }"
        >
          <SwiperSlide v-for="category in categories" :key="category.id">
            <router-link :to="{ name: 'store-category', params: { categoryHandle: category.handle } }" class="featured-category">
              <div class="cover-image-container">
                <div class="cover-image" :style="coverImage(category)" />
              </div>
              <div class="category-title">{{ category.title }}</div>
            </router-link>
          </SwiperSlide>
        </Swiper>
      </div>
      <div @click="swiperController.slideNext()" class="change-slide hide-mobile"><i class="bi bi-chevron-right"></i></div>
    </div>
  </section>
</template>

<script>
  import isDev from '../../common/utils/isDev.js'

  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Pagination, Scrollbar, A11y, Autoplay } from 'swiper';

  // Import Swiper styles
  import 'swiper/css';
  import 'swiper/scss/pagination';
  import 'swiper/scss/autoplay';
  
  export default {
    props: {
      categories: Array
    },
    components: { Swiper, SwiperSlide },
    data () {
      return {
          swiperModules: [Scrollbar, Pagination, A11y, Autoplay],
          swiperController: null
      }
    },
    methods: {
      coverImage (category) {
        if (category.image) {
          return { backgroundImage: `url('${this.devHost}${category.image.thumbSrc}` }
        } else {
          return {}
        }
      }
    },
    computed: {
      devHost () {
        return isDev ? 'http://localhost:5001' : ''
      }
    }
  }
</script>
