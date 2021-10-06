<template>
  <section id="attributes-section" class="container" style="margin: 0;">
    <swiper
      :modules="swiperModules"
      :slides-per-view="1"
      :space-between="40"
      autoplay
      :scrollbar="{ draggable: true }"
      :pagination="{ clickable: true }"
      :breakpoints="{
        // when window width is >= 768px

        // when window width is >= 1200px
        768: {
          slidesPerView: 3,
          spaceBetween: 40
        }
      }"
    >
      <swiper-slide>
        <div class="featured">
          <img src="../assets/uruguay.svg" style="width: 40px;" alt="">
          <div class="title">Trabajo 100% uruguayo</div>
          <p>Crecidas en viveros nacionales</p>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="featured">
          <img src="../assets/free-shipping-02.svg" style="width: 70px;" alt="">
          <div class="title">Envio grátis en Uruguay</div>
          <p>Llegamos a todos los rincónes</p>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="featured">
          <img src="../assets/guarranty-03.svg" style="width: 40px;" alt="">
          <div class="title">Calidad asegurada</div>
          <p>Sino te devolvemos tu dinero</p>
        </div>
      </swiper-slide>
    </swiper>
  </section>
</template>

<script>
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Pagination, Scrollbar, A11y, Autoplay } from 'swiper';

  // Import Swiper styles
  import 'swiper/css';
  import 'swiper/scss/navigation';
  import 'swiper/scss/pagination';
  import 'swiper/scss/autoplay';

export default {
  data () {
    return {
        swiperModules: [Scrollbar, Pagination, A11y, Autoplay]
    }
  },
  components: {
    Swiper,
    SwiperSlide,
  }
}
</script>

<style lang="scss">
  #attributes-section {
    margin-bottom: 0px;
    padding-bottom: 0 !important;
    padding-top: 0 !important;
    text-align: center;

    .featured {
      padding-top: 40px;
      padding-bottom: 40px;

      .title {
        margin-top: 16px;
        font-weight: bold;
      }

      p {
        margin: 0;
        margin-top: 4px;
      }
    }

    .swiper-pagination-bullet-active {
      background: #524944;
    }
  }
</style>