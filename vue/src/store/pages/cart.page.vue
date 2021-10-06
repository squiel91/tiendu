<template>
  <div class="container">
    <Breadcrumb active="Canasta" />
  </div>
  <Loading :status="status" />
  <div v-if="status === 'ready'" class="container">
    <h1>En tu canasta</h1>
    <div v-if="cartQty > 0" class="cart__item-grid">
      <div class="unit-price-label">Precio unitario</div>
      <div class="quantity-label">Cantidad</div>
      <div class="line"></div>
      <template v-for="cartItem of cart.items" :key="`${ cartItem.productId }-${ cartItem.variantId || 0 }`">
        <div class="cart__thumbnail" :style="cartItem.image && { backgroundImage: `url('${devHost}${cartItem.image.thumbSrc}')`}"></div>
        <div class="title">
          <div>
            <router-link :to="{ name: 'store-product', params: { productHandle: cartItem.handle }}">{{ cartItem.title }}</router-link>
          </div>
          <div v-if="cartItem.variantName"> {{ cartItem.variantName }}</div>
          <div v-if="cartItem.stock !== null && cartItem.stock < cartItem.quantity" class="cart__error">
            <i class="bi bi-exclamation-circle"></i>
            <template v-if="cartItem.stock === 0">
              Se agotó el stock.
            </template>
            <template v-else-if="cartItem.stock === 1">
              Solo queda una unidad en stock.
            </template>
            <template v-else>
              Solo quedan {{ cartItem.stock }} unidades en stock.
            </template>
          </div>
        </div>
        <div class="price">
          <span v-if="cartItem.discountedFrom" class="discounted">&nbsp;$ {{ cartItem.discountedFrom }}&nbsp;</span> $ {{ cartItem.price }}
        </div>
        <Input type="quantity" :modelValue="cartItem.quantity" @update:modelValue="modifyQuantity(cartItem, $event)" style="justify-self: flex-start;" />
        <div class="line" />
      </template>
    </div>
    <div style="margin-top: 24px" class="grid mobile-and-up-1">
      <div v-if="cartQty === 0">
        <div class="error-message">
          ¡Tu canasta está vacía! Vuelve después de agregar algun producto. 
        </div>
      </div>
      <div v-if="stockError">
        <div class="error-message">
          Hay algunos productos sin el stock necesario. Modifica su cantidad antes de continuar con la compra
        </div>
      </div>
      <div v-if="cart.missingProductWarning && cart.missingProductWarning.length > 0">
        <div class="warning-message">
          <template v-if="cart.missingProductWarning.length === 1">
            El producto "<b>{{ cart.missingProductWarning[0].title }}</b>" ya no existe. Ya fue removido de tu canasta.  
          </template>
          <template v-else>
            Los siguientes producto <b>{{ cart.missingProductWarning.map(item => `"${item.title}"`).join(', ') }}</b> no existen más. Ya fueron eliminados de tu canasta.  
          </template>
        </div>
      </div>
      <div v-if="cart.missingVariantWarning && cart.missingVariantWarning.length > 0">
        <div class="warning-message">
          <template v-if="cart.missingVariantWarning.length === 1">
            El producto
            <router-link :to="{ name: 'store-product', params: { productHandle: cart.missingVariantWarning[0].handle } }">"{{ cart.missingVariantWarning[0].title }}"</router-link>
            cambió desde que lo agregaste al canasta. Ya fué removido pero puedes volverlo a agregarlo siguiendo el link.  
          </template>
          <template v-else>
            Las variantes de los siguientes productos cambiaron:
            <template v-for="(item, index) in cart.missingVariantWarning" :key="item">
              <router-link :to="{ name: 'store-product', params: { productHandle: item.handle } }">"{{ item.title }}"</router-link><span v-if="index + 1 !== cart.missingVariantWarning.length">, </span>
            </template>.
            Todos fueron eliminados de tu canasta pero puedes volver a agregarlos siguiendo los links.  
          </template>
        </div>
      </div>
      <div v-if="coupon.appliedError">
        <div class="error-message">
          {{ coupon.appliedError }}
        </div>
      </div>
      <div v-if="cartQty > 0" class="cart__total">
        Sub-total: <span v-if="cart.discountedFrom" class="discounted">&nbsp;$ {{ cart.discountedFrom }}&nbsp;</span> <span id="total">$ {{ cart.totalPrice }}</span>

      </div>
      <div v-if="coupon.applied">
        <i class="bi bi-check2" style="margin-right: 4px;" />
        <b>{{ coupon.applied.code }}</b>
        <template v-if="coupon.applied.description">
          / {{ coupon.applied.description }}
      </template>
      <button @click="removeCoupon" id="remove-coupon">(Remover)</button>
      </div>
      <div v-if="cartQty > 0" class="checkout-button">
        <Button text="Continuar la compra" @click="$router.push({ name: 'store-checkout' })" :loading="loading" :disabled="hasErrors" />
      </div>
      <div v-if="!coupon.applied && !coupon.showInput" class="coupon-button" @click="coupon.showInput = true">+ Tengo un cupón</div>
      <div v-if="!coupon.applied && coupon.showInput" class="apply-coupon grid center mobile-1-tablet-and-up-2">
        <Input label="Cupón" :error="coupon.errorCode"  v-model="coupon.code">
          <template v-slot:button>
            <button class="subscribe-input-button" @click="coupon.showInput = false">
              Cancelar 
            </button>
        </template>
        </Input>
        <div>
          <Button text="Aplicar cupón" :secondary="true" :loading="coupon.loading" @click="applyCoupon" />
        </div>
        <div v-if="coupon.error" class="error-message">{{ coupon.error }}</div>
      </div>
    </div>
    <Recommendations :productIds="cartProductIds" />
  </div>
</template>

<script>
  import { computed, ref, reactive, watch } from 'vue'
  import { useStore } from 'vuex'
  import { useRoute } from 'vue-router'

  import axios from 'axios'
  const CancelToken = axios.CancelToken;
  let cancelPrevRequest

  import Loading from '../snippets/fetching.snippet.vue'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'
  import Button from '../snippets/button.snippet.vue'
  import Input from '../snippets/input.snippet.vue'
  import Recommendations from '../snippets/recommendations.snippet.vue'

  import isDev from '../../common/utils/isDev.js'

  export default {
    components: {
      Loading,
      Breadcrumb,
      Button,
      Input,
      Recommendations
    },
    setup () {
      const status = ref('loading')

      const cart = reactive({
        items: [],
        totalCost: null,
        discountedFrom: null,
        missingProductWarning: null,
        missingVariantWarning: null,
      })

      const loading = ref(false)
      const store = useStore()
      const isAuthenticated = store.getters.isAuthenticated 


      const cartItemsSlim = computed(() => {
        return store.getters.cartItemsSlim
      })
      
      const cartQty = computed(() => {
        return store.getters.cartQuantity
      })

      
      function refreshCart(request) {
        if (!request && cancelPrevRequest) cancelPrevRequest()

        loading.value = true;
        (
          request || axios.post('cart', {
            items: cartItemsSlim.value,
            coupon: store.state.cart.couponCode
          },
          { cancelToken: new CancelToken(c => cancelPrevRequest = c) })
        )
          .then(response => {
            cart.items = response.data.items
            cart.totalPrice = response.data.totalPrice
            cart.discountedFrom = response.data.discountedFrom 
            cart.missingProductWarning = response.data.missingProducts || []
            cart.missingVariantWarning = response.data.missingVariants || []

            if (isAuthenticated) {
              store.commit('cartQuantity', response.data.cartQty)
            } else {
              cart.missingProductWarning.concat(cart.missingVariantWarning).forEach(item => {
                // remove it from the cart
                store.commit('cartModifyItem', { 
                  productId: item.productId,
                  variantId: item.variantId,
                  quantity: 0
                })
              })
            }

            coupon.applied = response.data.coupon
            coupon.appliedError = response.data.couponError

            // so it does not fetch the recommendations more than once
            if (!cartProductIds.value) {
              cartProductIds.value = cart.items?.map(item => item.productId)
            }

            status.value = 'ready'
            loading.value = false  
          })
          .catch(error => {
            if (!axios.isCancel(error)) {
              // handle error
              alert(error.response?.error || 'Ocurrió un error al conectar con el servidor')
              console.error(error)
              loading.value = false
            }
          })
      }

      // Coupon
      const route = useRoute()
      if (route.query.cupon) {
        store.commit('couponCode', route.query.cupon)
      }

      const coupon = reactive({
        applied: null,
        appliedError: null,
        showInput: false,
        code: '',
        errorCode: null,
        error: null,
        loading: false
      })

      async function applyCoupon() {
        coupon.errorCode = null
        coupon.error = null

        if (!coupon.code) {
          coupon.errorCode = 'Ingresa el código de tu cupón'
        } else {
          coupon.loading = true
          try {
            const response = await axios.get(`coupons/${coupon.code}`, { params: { by: 'code' }})
            const couponInfo = response.data.coupon

            if (couponInfo.timesUsed >= couponInfo.maxUses) {
              coupon.errorCode = 'Este coupón ya no se encuentra activo.'
            } else {
              // Even when the cart amount is not enough to satisfy the minSpend, it is applied and the appropiate warning is shown
              store.commit('couponCode', couponInfo.code)
              coupon.showInput = false
              refreshCart()
            }
          } catch (error) {
            coupon.error = error.response?.data.error || 'No fue posible conectarse con el servidor. Intenta nuevamente.'
            console.error(error)
          } finally {
            coupon.loading = false
          }
        }
      }

      function removeCoupon () {
        store.commit('couponCode', undefined)
        refreshCart()
      }

      // Errors
      const stockError = computed(() => {
        for (const item of cart.items) {
          if (item.stock !== null && item.stock < item.quantity) return true
        }
        return false
      })
      
      const hasErrors = computed(() => {
        return stockError.value || coupon.appliedError
      })

      refreshCart()

      async function modifyQuantity (cartItem, newQuantity) {
        cartItem.quantity = newQuantity
        if (isAuthenticated) {
          loading.value = true
          if (cancelPrevRequest) cancelPrevRequest()
          refreshCart(
            axios.post('cart', { ...cartItem, coupon: store.state.couponCode, absolute: true },
            { cancelToken: new CancelToken(c => cancelPrevRequest = c) }))
        } else {
          store.commit('cartModifyItem', cartItem)
          if (cartItem.quantity <= 0) {
            cart.items.splice(cart.items.findIndex(cartItemIter => cartItemIter === cartItem), 1)
          }
          refreshCart()
        }
      }

      // recommendations
      const cartProductIds = ref(null)

      return {
        // data
        status,
        cart,
        loading,
        coupon,
        
        // computed
        cartQty,
        hasErrors,
        stockError,
        devHost: computed(() => {
          return isDev ? 'http://localhost:5001' : ''
        }),
        cartProductIds,

        // methods
        modifyQuantity,
        applyCoupon,
        removeCoupon
      }
    }
  }
</script>
