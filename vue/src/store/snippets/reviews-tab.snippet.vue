<template>
  <div class="reviews-snippet">
    <div v-for="review in reversedReviews" :key="review.id" class="review">
      {{ review.author }} {{ review.created }}
      <div class="reviews__value">
        <Stars :value="review.value" />
      </div>
      {{ review.comment }}
    </div>

    <p v-if="reviewQty == 0" class="review-top-message" style="margin-top: 0px;">Este producto aún no tiene reseñas. ¡Se el primero en valorarlo!</p>
    <div class="tip primary" v-if="!isLogged">
      Para dejar tu reseña <router-link :to="{ name: 'store-login', query: { from: currentLocation } }">inicia sesión</router-link> o <router-link :to="{ name: 'store-register', query: { from: currentLocation } }">crea una nueva  cuenta</router-link>.
    </div>
    <template v-else>
      <p v-if="prevUserComment" class="tip primary">Ya escribiste una reseña. <a style="cursor: pointer;" class="primary-color"  @click="editingReview = true">Edita la anterior</a>.</p>
      <p v-else class="tip">Valora el producto y escribe tu reseña.</p>
    </template>
    <div v-if="isLogged && (!prevUserComment || editingReview)" class="write-review">
      <div class="value-review">
        <div v-for="value in 5" :key="value" @click="valueReview = value" @mouseenter="valueHover = value" @mouseleave="valueHover = 0">
          <img v-if="valueHover >= value || (!valueHover && valueReview >= value)" class="star" src="../assets/star-fill.svg">
          <img v-else class="star" src="../assets/star-empty.svg">
        </div>
        <span style="margin-left: 16px;">
        {{ valueMessage }}
        </span>
        <span id="value-descriptor"></span>
      </div>
      <label for="review-comment" class="review-comment-container">
        <textarea v-model="comment" id="review-comment" placeholder="Comentario opcional" />
      </label>
      <div v-if="error" style="margin-top: 16px;" class="first-column error-message">{{ error }}</div>
      <Button style="margin-top: 16px;" @click="submitReview" text="Enviar" :loading="loading"></button>
    </div>
  </div> 
</template>

<script>

import Stars from './stars.snippet.vue'
import Button from './button.snippet.vue'
export default {
  components: {
    Stars,
    Button
  },
  props: ['productId', 'reviews', 'isLogged'],
  data() {
    return {
      valueHover: 0,
      valueReview: null,
      comment: '',
      loading: false,
      error: null,
      editingReview: false
    }
  },
  emits: ['review-added', 'remove-user-reviews'],
  watch: {
    editingReview (newValue) {
      if (newValue) {
        this.valueReview = this.prevUserComment.value
        this.comment = this.prevUserComment.comment
      }
    }
  },
  computed: {
    currentLocation () {
      return window.location.pathname
    },
    prevUserComment() {
      return this.reviews.find(review => review.isAuthor) 
    },
    reversedReviews () {
      return this.reviews.reverse()
    },
    reviewQty() {
      return this.reviews.length
    },
    valueMessage() {
      const message = {
        1: 'Decepcionante',
        2: 'Malo',
        3: 'Pasable',
        4: 'Muy bueno',
        5: 'Excelente'
      }
      if (this.valueHover) {
        return `${this.valueHover}/5 • ${message[this.valueHover]}`
      } else {
        if (this.valueReview) {
          return `${this.valueReview}/5 • ${message[this.valueReview]}`
        } else {
          return `Elije una valuación`
        }
      }
    }
  },
  methods: {
    async submitReview() {
      if (!this.reviewValue) {
        this.error = 'Elije una valoración antes de enviar la reseña.'
      }
      this.error = null
      this.loading = true
      try {
        const response = await this.axios.post(`/products/${this.productId}/reviews`, {
          value: this.valueReview,
          comment: this.comment
        })
        if (this.prevUserComment) {
          this.$emit('remove-user-reviews')
          this.editingReview = false
        }
        this.$emit('review-added', response.data.review)
        this.reviewValue = 0
        this.comment = ''
      } catch (error) {
        this.error = error.response?.error || 'Ocurrió un error. Intenta nuevamente'
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
