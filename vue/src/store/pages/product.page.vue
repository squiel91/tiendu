<template>
  <div class="container">
    <Breadcrumb :stack="fromCategory" :active="product?.title" />
  </div>
  <Loading :status="status" />
  <div v-if="status === 'ready'" id="product-page" class="container">
    <div class="grid mobile-1-tablet-and-up-2 mobile-small-tablet-and-up-big-gap">
      <div class="images-col" style="overflow: hidden;">
        <Swiper
          :modules="swiperModules"
          :slides-per-view="1"
          :space-between="16"
          @swiper="swiperController = $event"
          :scrollbar="{ draggable: true }"
        >
          <SwiperSlide v-for="image in allImages" :key="image">
            <div
              class="image cover"
              :style="{'background-image': `url('${devHost}${image.coverSrc}')`}"
            />
          </SwiperSlide>
        </Swiper>
        <!-- <div 
          class="image cover"
          :style="backgroundCoverImage"
          @mousemove="panImage"
          @mouseout="unpanImage"
        /> -->
        <div v-if="allImages && allImages.length > 1" class="thumb-grid">
          <div
            v-for="(image, index) in allImages" 
            class="image thumb"
            :key="image"
            :style="{'background-image': `url('${devHost}${image.thumbSrc}')`}"
            @mouseover="this.swiperController.slideTo(index)"
            @click="this.swiperController.slideTo(index)"
          />
        </div>
      </div>
      <div class="details">
        <h1 class="productTitle">{{ product.title }}</h1>
        <div class="review-details">
          <Stars :value="averageReview" style="margin-right: 8px;" />
          <template v-if="product.reviews?.length > 0">
            {{ averageReview?.toFixed(1) }} de {{ product.reviews?.length }} reseña<template v-if="product.reviews?.length">s</template>
          </template>
          <template v-else>
            Aún sin reseñas
          </template>
        </div>
        <div class="price-container">
          <span class="price">{{ typeof varyingDetails.price === 'number'? `$ ${varyingDetails.price}` : `Desde $ ${varyingDetails.price.min}` }}</span>
          <span v-if="varyingDetails.compareAt" class="compare-at">&nbsp;$ {{ varyingDetails.compareAt }}&nbsp;</span>
        </div>
        <div class="details-grid">
          <img style="width: 100%;" src="../assets/handing-icon.svg">
          <div>Llega gratis a todo Uruguay</div>
          <img style="width: 100%;" src="../assets/stock-icon.svg">
          <div class="stock">{{ stockMessage }}</div>
        </div>
        <form class="grid small-gap mobile-and-up-1" autocomplete="off">
          <template v-if="product.hasVariants">
            <Input 
              v-for="(option, optionIndex) in (product.options || [])"
              v-model="selectedOptions[optionIndex]"
              :key="optionIndex"
              :options="[...new Set(product.variants.map(variant => variant.values[optionIndex]))]"
              :label="option"
              :id="option"
              :clearable="product.options.length > 1"
            />
          </template>
          <div v-if="addProductError" class="error-message">
            {{ addProductError }}
          </div>
          <div class="add-to-cart-container" style="display: flex;">
            <Input type="quantity" v-model="orderQty" :min="1" />
            <Button :loading="loadingCartSubmit" :text="varyingDetails.stock === 0? 'Agotado' : 'Agregar a tu canasta'" style="margin-left: 8px;" :disabled="varyingDetails.stock === 0" @click="addToCart" />
          </div>
        </form>
        <div class="tab-header">
          <a class="tab-button" :class="{ active: activeTab === 'description'}" @click="activeTab = 'description'">Descripción</a>
          <a class="tab-button" :class="{ active: activeTab === 'reviews'}" @click="activeTab = 'reviews'">Reseñas <span v-if="product.reviews.length" class="review-count">{{ product.reviews.length }}</span></a>
        </div>
        <div v-if="activeTab === 'description'" class="tab-content" v-html="product.description" />
        <ReviewsTab
          v-if="activeTab === 'reviews'"
          :reviews="product.reviews"
          :product-id="product.id"
          :is-logged="isAuthenticated"
          @remove-user-reviews="product.reviews = product.reviews.filter(review => !review.isAuthor)"
          @review-added="product.reviews.push($event)"
          class="tab-content"
        />
        <div class="share-container">
          <button class="share" @click="showShare = !showShare">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share-fill" viewBox="0 0 16 16">
              <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
            </svg>
          </button>
          <transition name="fade-right">
            <ul v-if="showShare" class="shareList">
              <li>
                <a 
                  href="https://api.whatsapp.com/send?text=Mirá lo que encontré en el Vivero! <%= url %>"
                  data-action="share/whatsapp/share"
                  title="Share on WhatsApp"
                  target="_blank"
                  class="share-link"
                >
                  <i class="bi bi-whatsapp"></i>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/sharer/sharer.php?u=<%= url %>&quote=Mirá lo que encontré en el Vivero!"
                  title="Share on Facebook"
                  target="_blank"
                  class="share-link"
                >
                  <i class="bi bi-facebook"></i>
                </a>
              </li>
              <li>
                <a
                  href="mailto:?subject=Del Vivero!&amp;body=Mirá lo que encontré en el Vivero! <%= url %>"
                  title="Share by Email"
                  class="share-link"
                >
                  <i class="bi bi-envelope-fill"></i>
                </a>
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </div>
    <Recommendations :productId="product.id" />
  </div>
</template>

<script>
  import Loading from '../snippets/fetching.snippet.vue'
  import Stars from '../snippets/stars.snippet.vue'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'
  import ReviewsTab from '../snippets/reviews-tab.snippet.vue'
  import Input from '../snippets/input.snippet.vue'
  import Button from '../snippets/button.snippet.vue'
  import Recommendations from '../snippets/recommendations.snippet.vue'

  import isDev from '../../common/utils/isDev.js'

  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Pagination, Scrollbar, A11y } from 'swiper';

  // Import Swiper styles
  import 'swiper/css';

  export default {
    emits: ['resourceIdChanged'],
    data () {
      return {
        status: 'loading',
        product: null,
        coverImage: null,
        selectedOptions: [],
        orderQty: 1,
        addProductError: null,
        activeTab: 'description',
        showShare: false,
        loadingCartSubmit: false,

        swiperModules: [Scrollbar, A11y],
        swiperController: null
      }
    },
    props: [
      'productHandle' // router URL
    ],
    components: {
      Loading,
      Stars,
      Breadcrumb,
      ReviewsTab,
      Input,
      Button,
      Recommendations,

      Swiper,
      SwiperSlide
    },
    watch: {
      selectedOptions: {
        deep: true,
        handler () {
          // Using the next tick because when option cleared, the corrresponding select DOM element is still not cleared (I am using a ported javascript function for this)
          this.$nextTick(() => {
            this.adjustOptions()
          })

        },
      },
      productHandle () {
        this.fetchProduct()
      },
      // For changing to the variant image
      selectedVariant () {
        if (this.selectedVariant && this.selectedVariant.images && this.selectedVariant.images.length > 0) {
          this.coverImage = this.selectedVariant.images[0].coverSrc
        }
      }
    },
    created () {
      this.fetchProduct()
    },
    computed: {
      averageReview () {
        if (!this.product?.reviews || this.product.reviews.length === 0) return
        return this.product.reviews.reduce((acumm, review) => review.value + acumm, 0) / this.product.reviews.length
      },
      backgroundCoverImage() {
        if (this.coverImage) return { backgroundImage: `url('${this.devHost}${this.coverImage}')` }
        else {}
      },
      fromCategory () {
        const title = this.$route.query.title
        const handle = this.$route.query.handle
        if (title && handle)
          return [{
            label: title,
            to: {
              name: 'store-category',
              params: {
                categoryHandle: handle
              }
            }
          }]
      },
      devHost () {
        return isDev ? `http://${location.hostname}:5001` : ''
      },
      allImages() {
        if (!this.product) return []
        const allImages = this.product.images || []
        if (this.product.hasVariants) {
          this.product.variants.forEach(variant => {
            (variant.images || []).forEach(image => {
              if (!allImages.find(iterImage => iterImage.id === image.id)) {
                allImages.push(image)
              }
            })
          })
        }
        return allImages
      },
      selectedVariant() {
        if (!this.product?.hasVariants) return undefined
        return this.product?.variants[this.selectedVariantId - 1]
      },
      stockMessage () {
        if (this.varyingDetails.stock === undefined) return 'Elije una variante para ver el stock'
        if (this.varyingDetails.stock === null) return 'Stock disponible'
        if (this.varyingDetails.stock === 0) return 'Actualmente sin stock'
        if (this.varyingDetails.stock === 1) return 'Solo queda una unidad en stock'
        return `Solo quedan ${this.varyingDetails.stock} unidad en stock`
      },
      varyingDetails () {
        const product = this.product
        if (!product) return {}

        if (product.hasVariants) {
          if (this.selectedVariantId) {
            return {
              price: this.selectedVariant.price,
              compareAt: this.selectedVariant.compareAt,
              stock: this.selectedVariant.stock
            }
          } else {
            return {
              price: product.price,
              compareAt: typeof product.compareAt === 'object' && product.compareAt !== null ? product.compareAt.aggregated : product.compareAt,
              stock: typeof product.stock === 'object' && product.stock !== null ? product.stock.aggregated : product.stock
            }
          }
        } else {
          return {
            price: product.price,
            compareAt: product.compareAt,
            stock: product.stock
          }
        }
      },
      selectedVariantId () {
        if (!this.product?.hasVariants) return undefined
        if (Object.keys(this.selectedOptions).length === this.product.options.length) {
          for (let i = 0; i < this.product.variants.length; i++) {
            if (JSON.stringify(this.selectedOptions) === JSON.stringify(this.product.variants[i].values)) {
              return i + 1
            }
          }
        } else {
          return undefined
        }
      },
      isAuthenticated () {
        return this.$store.getters.isAuthenticated
      }
    },
    methods: {
      async fetchProduct () {
        try {
          this.status = 'loading'
          this.product = null
          const productResponse = await this.axios(`/products/${this.productHandle}`, { params: { handle: true } })
          const product = productResponse.data.product
          this.$emit('resourceIdChanged', product.id)

          this.product = product
          if (this.allImages && this.allImages.length > 0) {
            this.coverImage =  this.allImages[0].coverSrc
          }
          this.status = 'ready'
        } catch (error) {
          alert('Hubo un error al conectar con el servidor')
          console.error(error)
          this.status = 'error'
        }
      },
      // this is a ported function from previous versions that needs to be refactored to only use Vue. You are encouraged to do it and submit a pull request.
      adjustOptions () {
        let selectors = document.querySelectorAll('select');

        let optionsSelected = [] // array with all current selections
        let validOptions = [] // array of dictionaries with the valid options to display
        selectors.forEach(selector => {
          validOptions.push({}); // initialization
          if (selector.value) {
            optionsSelected.push(selector.value); // initialization
          } else {
            optionsSelected.push(undefined); // initialization
          }
        })

        // I fist iterate over the options, then over the variants and then ones again over the options
        for (let optionIndex = 0; optionIndex < optionsSelected.length; optionIndex++) {
          for (let variantIndex = 0; variantIndex < this.product.variants.length; variantIndex++) {
            let variant = this.product.variants[variantIndex];
            let candidateOption = variant.values[optionIndex];
            // if already included no need to test again
            if (!validOptions[optionIndex][candidateOption]) {
              let isCandidate = true;
              for (let innerOptionIndex = 0; innerOptionIndex < optionsSelected.length; innerOptionIndex++) {
                if (innerOptionIndex != optionIndex && optionsSelected[innerOptionIndex] && optionsSelected[innerOptionIndex] !== variant.values[innerOptionIndex]) {
                  isCandidate = false;
                  break;
                }
              }
              if (isCandidate) {
                validOptions[optionIndex][candidateOption] = true;
              }
            }
          }
        }

        for (let selectorIndex = 0; selectorIndex < selectors.length; selectorIndex++) {
          let selector = selectors[selectorIndex]
          let validOptionsForSelector = validOptions[selectorIndex]
          // skipping the first one that is the placeholder
          for (let optionIndex = 1; optionIndex < selector.options.length; optionIndex++) {
            let option = selector.options[optionIndex]
            option.disabled = !validOptionsForSelector[option.value];
          }
        }
      },
      showError (error, devError) {
        alert(error)
        if (devError) console.error(error)
      },
     async addToCart() {
        if (this.product.hasVariants && !this.selectedVariantId) {
          return this.showError('Debes seleccionar una variante antes de agregarla al canasta.')
        }
        if (typeof this.varyingDetails.stock === 'number' && this.varyingDetails.stock < this.orderQty) {
          return this.showError('No hay suficiente stock para la cantidad que deseas agregar.')
        }
        if (!this.isAuthenticated) {
          // is not logged in
          this.$store.commit('cartAddItem', {
            productId: this.product.id,
            variantId: this.selectedVariantId,
            title: this.product.title,
            quantity: this.orderQty
          })
          this.$router.push({ name: 'store-cart' })
        } else {
          this.loadingCartSubmit = true
          try {
            const response = await this.axios.post('cart', {
              productId: this.product.id,
              variantId: this.selectedVariantId,
              quantity: this.orderQty,
              fastReturn: true
            })
            this.$store.commit('cartQuantity', response.data.cartQty)
            this.$router.push({ name: 'store-cart' })
          } catch (error) {
            this.addProductError = error.request.data.error || 'Hubo un error al conectarse con el servidor. Intenta nuevamente'
            console.error(error)
            this.$router.push({ name: 'store-cart' })
          } finally {
            this.loadingCartSubmit = false
          }
        }
      },
      panImage(event) {
        const el = event.target
        const viewerHeight = el.offsetHeight
        el.style.backgroundPosition = (event.offsetX/viewerHeight) * 100 + "% " + ((event.offsetY/viewerHeight) * 100 + "%");
        el.style.backgroundSize = 'auto'
      },
      unpanImage(event) {
        const el = event.target
        el.style.backgroundPosition = 'center';
        el.style.backgroundSize = 'cover';
      }
    }
  }
</script>
