<template>
  <section class="reviews" id="reviews-section">
    <div class="container">
      <Fetching :status:="status" />

      <div v-if="status === 'ready'" class="grid mobile-1-tablet-3-desktop-4">
        <div>
          <h2>Lo que dicen de nuestras plantas</h2>
          <div style="color: #524944; text-transform: uppercase; font-weight: bold;">{{ reviews.length }} de {{ totalReviews }} reseñas</div> 
        </div>
        <div class="swiper-container">
          <div @click="swiperController.slidePrev()" class="change-slide"><i class="bi bi-chevron-left"></i></div>
          <div style="overflow: hidden; position: relative;">
            <Swiper
              :modules="swiperModules"
              @swiper="swiperController = $event"
              :slides-per-view="1"
              :space-between="40"
              autoplay
              :scrollbar="{ draggable: true }"
              :pagination="{ clickable: true }"
              :breakpoints="{
                // when window width is >= 768px
                768: {
                  slidesPerView: 2,
                  spaceBetween: 40
                },
                // when window width is >= 1200px
                1200: {
                  slidesPerView: 3,
                  spaceBetween: 40
                }
              }"
              mousewheel
            >
              <Swiper-slide v-for="(review) in reviews" :key="review.id" class="review-item" style="padding-bottom: 40px;">
                <Stars :value="review.value" :small="true"/>
                <div class="review-item__product" style="margin-top: 8px;"><router-link :to="{ name: 'store-product', params: { productHandle: review.prodHandle }}">{{ review.prodTitle }}</router-link></div>
                <div class="review-item__comment" style="margin-top: 4px; margin-bottom: 24px;">{{ review.comment }}</div>
                <div class="review-item__author" style="font-size: small">{{ review.author }}</div>
                <div class="review-item__created" style="font-size: small">{{ review.created }}</div>
              </Swiper-slide>
            </Swiper>
          </div>
          <div @click="swiperController.slideNext()" class="change-slide"><i class="bi bi-chevron-right"></i></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Fetching from '../snippets/fetching.snippet.vue'
  import Stars from '../snippets/stars.snippet.vue'

  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Pagination, Scrollbar, A11y, Autoplay } from 'swiper';

  // Import Swiper styles
  import 'swiper/css';
  import 'swiper/scss/pagination';
  import 'swiper/scss/autoplay';

  export default {
    components: {
      Fetching,
      Stars,

      Swiper, SwiperSlide
    },
    data() {
      return {
        swiperModules: [Scrollbar, Pagination, A11y, Autoplay],
        swiperController: null,
        status: 'fetching',
        reviews: [],
        totalReviews: null,
        SHOW_MOBILE: 4,
        SHOW_DESKTOP: 6
      }
    },
    async created() {
      try {
        const response = await this.axios('/reviews')
        this.totalReviews = response.data.total 
        this.reviews = response.data.reviews
        this.status = 'ready'
      } catch (error) {
        this.status = 'error'
        console.error(error)
      }
    }
  }
</script>
