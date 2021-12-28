<template>
  <div id="checkout-page" class="container">
    <Breadcrumb :stack="[{ label: 'Canasta', to: { name: 'store-cart' }}]" active="Checkout" />
    <h1>Checkout</h1>
    <section>
      <h2 class="checkout-step">
        <span class="indicator">1/4</span>  
        Información de contacto
      </h2>
      <div class="grid center mobile-1-tablet-2-desktop-4">
        <Input id="email" label="Email" v-model="email" :error="errors.contact.email" :tab="1" class="span-2-col-tablet-and-up" mobileHelp="Te mandaremos los los datos de la orden.  Además te notificaremos cada vez que la orden cambie de estado." />
        <div class="hide-tablet-and-down span-2-col">
          Te mandaremos los los datos de la orden. Además te notificaremos cada vez que la orden cambie de estado.
        </div>
        <div v-if="accountStatus === 'login'" class="login span-col-2">
          Ya existe una cuenta con ese mismo email.<br><router-link :to="{ name: 'store-login', query: { from: currentLocation, email } }" style="color: #5f9061;">Inicia sesión</router-link> o continúa como invitado.
        </div>
        <Input id="firstName" label="Nombre" v-model="firstName" class="first-col" :error="errors.contact.firstName" :tab="2" />
        <Input id="lastName" label="Apellido" v-model="lastName" :error="errors.contact.lastName" :tab="3" />
        <div v-if="accountStatus === 'register'" class="register first-col span-2-col-tablet-and-up">
          Solo resta definir una contraseña para crear tu cuenta. <br><router-link :to="{ name: 'store-register', query: { from: currentLocation, email, nombre: firstName, apellido: lastName } }" style="color: #5f9061;">Crea una cuenta</router-link> o continúa como invitado.
        </div>
        <Input id="phone" label="Teléfono" v-model="phone" :error="errors.contact.phone" class="first-col span-2-col-tablet-and-up" :tab="4" mobileHelp="Preferentemente número de celular. Nos comunicarémos contigo para coordinar el envío o avisarte que la orden esta lista para retirarla." />
        <div class="hide-tablet-and-down span-2-col">
          Preferentemente número de celular. Nos comunicarémos contigo para coordinar el envío o avisarte que la orden esta lista para retirarla.
        </div>
      </div>
    </section>

    <section>
      <h2 class="checkout-step">
        <span class="indicator">2/4</span> 
        Envío sin costo
      </h2>

      <div class="grid center mobile-1-tablet-and-up-2">
        <div class="span-2-col-tablet">Recíbelo el {{ freeShippingDate }} o antes dentro de Uruguay ({{ SHIPPING_WORKING_DAYS }} días hábiles)</div>
        <Input id="state" label="Departamento" v-model="shipping.state" :options="stateOptions" :error="errors.shipping.state" class="first-col" :tab="5" />
        <Input id="neighborhood" label="Barrio" v-model="shipping.neighborhood" :error="errors.shipping.neighborhood" class="first-col-desktop" :tab="6" />
        <Input id="address" label="Dirección" v-model="shipping.address" :error="errors.shipping.address" class="first-col span-2-col-tablet" :tab="7" mobileHelp="La dirección donde te mandaremos tu orden. Incluye la calle, número de puerta y número de apartamento (si aplica)" />
        <div class="hide-tablet-and-down">
          La dirección donde te mandaremos tu orden. Incluye la calle, número de puerta y número de apartamento (si aplica)
        </div>
      </div>
    </section>
    
    <section>
      <h2 class="checkout-step"><span class="indicator">3/4</span> Revisa tu orden</h2>
      <div class="grid mobile-1-tablet-and-up-2" style="line-height: 1.5;">
        <div class="contact-review-container first-col">
          <h3>Información de contacto</h3>
          <div class="compact-grid">
            <div>Nombre</div><div v-if="firstName && lastName">{{ firstName }} {{ lastName }}</div><div v-else class="required">Requerido</div>
            <div>Email</div><div v-if="email">{{ email }}</div><div v-else class="required">Requerido</div>
            <div>Teléfono</div><div v-if="phone">{{ phone }}</div><div v-else class="required">Requerido</div>
          </div>
        </div>
        <div id="ship-review-container" style="display: none">
          <h3>Retiro</h3>
          <div class="compact-grid">
            <div class="review-info-label">Dirección</div> <div id="address-review">{{ shipping.address }}, {{ shipping.neighborhood }}, {{ shipping.state }}</div>
            <div class="review-info-label">Recibelo</div> <div id="arrive-review"><span class="required">Elije la forma de entrega</span></div>
          </div>
        </div>
        <div class="items-review-container">
          <h3>
            Items
            <div v-if="cart.coupon" class="coupon-label">Cupón "{{ cart.coupon.code }}"</div>
          </h3>

          <div v-for="item in cart.items" :key="item">{{ item.quantity }} X {{ item.title }}<span v-if="item.variantName">: {{ item.variantName }}</span>
            (<span v-if="item.discountedFrom" class="discounted">&nbsp;$ {{ cart.discountedFrom }}&nbsp;</span> $ {{ item.price }} c/u)
          </div>
          <div id='items-review-express' class="items-review-ship">1 X Envío gratis ($<span class="expressShipment">0</span>)</div>
        
          <div style="margin-top: 12px;" class="compact-grid">
            <div>Total</div>
            <div>
              <span v-if="cart.discountedFrom" class="discounted">&nbsp;$ {{ cart.discountedFrom }}&nbsp;</span>
              <span id="totalPrice" style="font-weight: bold;">$ {{ cart.totalPrice }}</span>
            </div>
          </div>
        </div>  
        <div>
          <h3>Detalles de envío</h3>
          <div class="compact-grid">
            <div>Departamento</div><div v-if="shipping.state">{{ shipping.state }}</div><div v-else class="required">Requerido</div>
            <div>Barrio</div><div v-if="shipping.neighborhood">{{ shipping.neighborhood }}</div><div v-else class="required">Requerido</div>
            <div>Dirección</div><div v-if="shipping.address">{{ shipping.address }}</div><div v-else class="required">Requerido</div>
            <div>Recibelo</div><div>{{ freeShippingDate }} o antes</div>
          </div>
        </div>
      </div>
    </section>

    <section class="last">
      <h2 class="checkout-step">
        <span class="indicator">4/4</span> 
        Pago
      </h2>
      <div class="grid center mobile-1-tablet-2-desktop-4">
        <i v-if="freeOrder" class="first-col span-2-col-tablet-and-up">Tu orden no requiere pago.</i>
        <template v-else>
          <h3 class="span-all-cols" style="margin: 0;">Documento</h3>
          <Input id="docType" label="Tipo" v-model="payment.document.type" :options="payment.document.typeOptions" :error="errors.payment.document.type" :tab="8" />
          <Input id="docNumber" label="Número" v-model="payment.document.number" :error="errors.payment.document.number" :tab="9" mobileHelp="Documento de la persona que realizará el pago, sin puntos ni guión" />
          <div class="span-2-col hide-tablet-and-down">Documento de la persona que realizará el pago, sin puntos ni guión.</div>        
          <h3 class="span-all-cols" style="margin: 0;">Forma de pago</h3>
          
          <div class="accordion span-2-col-tablet-and-up">
            <div class="drawer">
              <label class="drawer-header first" :class="{selected: payment.method === 'card' }">
                <input type="radio" v-model="payment.method" value="card"> Tarjeta de crédito / débito
              </label>
              <Collapsable :collapsed="payment.method !== 'card'">
                <div class="drawer-body">
                  <form id="form-checkout">
                    <div class="grid mobile-1-tablet-and-up-2">
                      <div class="span-2-col-tablet-and-up">Ni MercadoPago ni nosotros almacenaremos los datos de tu tarjeta. Ver <router-link :to="{ name: 'store-page', params: { pageHandle: 'politica-de-privacidad' } }" target="_blank">política de privacidad</router-link>.</div> 
                      <img class="span-2-col-tablet-and-up" style="max-width: 450px;" src="../assets/payment_methods-cards.svg" alt="tarjetas soportadas">
                      <Input label="Titular" v-model="payment.card.holder" :error="errors.payment.card.holder" class="span-2-col-tablet-and-up" :tab="11" help="Nombre y apellido tal cual aparece en el frente de la tarjeta." /> 
                      <Input label="Número" v-model="cardNumber" type="card" :error="errors.payment.card.number" class="span-2-col-tablet-and-up" :tab="12" />
                      <Input label="Vence (MM/YY)" v-model="payment.card.expiration" type="cardExp" :error="errors.payment.card.expiration" :tab="13" />
                      <Input label="CVV/CVC" v-model="payment.card.securityCode" :error="errors.payment.card.securityCode" type="cvc" :tab="14" help="Un código de 3 digitos, usualmente aparece en el reverso de la tarjeta" />
                      <Input label="Emisor" v-if="payment.card.issuerOptions.length > 1" v-model="payment.card.issuer" :options="payment.card.issuerOptions" :error="errors.payment.card.issuer" :tab="15" />
                      <Input label="Cuotas" v-if="payment.card.installmentsOptions.length > 1" v-model="payment.card.installments" :options="payment.card.installmentsOptions" :error="errors.payment.card.installments" :tab="16" />
                    </div>
                  </form>
                </div>
              </Collapsable>
            </div>
            <div class="drawer">
              <label class="drawer-header" :class="{selected: payment.method === 'abitab' }" >
                <input type="radio" v-model="payment.method" value="abitab"> Abitab
              </label>
              <Collapsable :collapsed="payment.method !== 'abitab'">
                <div class="drawer-body">
                  <img class="payment-network-logo" src="../assets/abitab.svg">
                  Paga en el local de Abitab más cercano dentro de las próximas 72 horas (<a href="https://www.abitab.com.uy/innovaportal/v/11702/11/abitab/locales.html" target="_blank">encuentra el más cercano</a>).
                  Te mandaremos el ticket de pago a tu email.
                </div>
              </Collapsable>
            </div>
            <div class="drawer">
              <label class="drawer-header" :class="{selected: payment.method === 'redpagos' }" >
                <input type="radio" v-model="payment.method" value="redpagos"> Redpagos
              </label>
              <Collapsable :collapsed="payment.method !== 'redpagos'">
                <div class="drawer-body">
                  <img class="payment-network-logo" src="../assets/redpagos.svg">
                  Paga en el local de Redpagos más cercano dentro de las próximas 72 horas
                  (<a href="https://www.redpagos.com.uy/buscador-de-locales-18#/" target="_blank">encuentra el más cercano</a>).
                  Te mandaremos el ticket de pago a tu email.
                </div>
              </Collapsable>
            </div>
          </div>
        </template>
        <div v-if="errors.general" class="error-message first-column span-2-col-tablet-and-up">{{ errors.general }}</div>
        <div class="first-col">
          <Button :text="cart.totalPrice? `Pagar $${cart.totalPrice}` : 'Finalizar compra'" :loading="loading" @click="pay" />
        </div>
        <img class="logo-mercadopago" src="../assets/horizontal_logo.png" alt="MercadoPago">
      </div>
    </section>
  </div>
</template>

<script>
  import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
  import axios from 'axios'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'
  import Input from '../snippets/input.snippet.vue'
  import Button from '../snippets/button.snippet.vue'
  import useValidation from '../../common/hooks/useValidation'
  import Collapsable from '../snippets/collapsable.snippet.vue'

  export default {
    components: {
      Breadcrumb,
      Input,
      Button,
      Collapsable
    },
    setup () {
      let mercadopago
      let mpScriptLoader
      onMounted (() => {
        mpScriptLoader = document.createElement('script')
        mpScriptLoader.setAttribute('src', 'https://sdk.mercadopago.com/js/v2')
        document.head.appendChild(mpScriptLoader)
        mpScriptLoader.onload = () => {
          // TODO: implement some sort of forntend ENV
          mercadopago = new MercadoPago('TEST-63d6274b-f524-4daf-803d-05b77fb4e4c2');
          getIdentificationTypes()
        }
      })

      onUnmounted(() => {
        if (mpScriptLoader) mpScriptLoader.remove()
      })

      const store = useStore()
      const router = useRouter()
      const isAuthenticated = store.getters.isAuthenticated 
      const loading = ref(false)

      // errors
      const errorsInit = () => {
        return {
          contact: {
            email: null,
            firstName: null,
            lastName: null,
            phone: null
          },
          shipping: {
            state: null,
            neighborhood: null,
            address: null
          },
          payment: {
            document: {
              type: null,
              number: null
            },
            method: null,
            card: {
              holder: null,
              number: null,
              securityCode: null,
              expiration: null,
              issuer: null,
              installments: null
            }
          },
          general: null
        }
      } 
      const errors = ref(errorsInit())

      function resetErrors () {
        errors.value = errorsInit()
      }

      // cart

      const cart = reactive({
        items: [],
        totalPrice: null,
        discountedFrom: null,
        coupon: null,
        loading: true
      })

      const cartItemsSlim = store.getters.cartItemsSlim

      const freeOrder = computed(() => {
        return cart.totalPrice === 0
      })
      
      axios.post('cart', {
        items: !isAuthenticated ? cartItemsSlim : undefined,
        coupon: store.state.cart.couponCode
      })
      .then(response => {
        if (response.data.items)
        cart.items = response.data.items
        cart.totalPrice = response.data.totalPrice
        cart.discountedFrom = response.data.discountedFrom
        cart.coupon = response.data.coupon
        
        if (response.data.outOfStockItems.length > 0) {
          errors.value.general = 'Algunos productos ya no están en stock. Vuelva al canasta para modificar la orden.'
        }
      })
      .catch(error => {
        console.error(error)
      })
      .finally(() => {
        cart.loading = false
      })

      // contact info
      const email = ref('')
      const firstName = ref('')
      const lastName = ref('')
      const phone = ref('')

      email.value = store.state.user?.email
      firstName.value = store.state.user?.firstName
      lastName.value = store.state.user?.lastName

      const emailExists = ref(false)

      watch(email, async () => {
        try {
          const response = await axios('users/exist', { params: { email: email.value } })
          emailExists.value = response.data.exist
        } catch (error) {
          console.error('Failed to check if email exists.', error)
        }
      })

      const accountStatus = computed(() => {
        if (!isAuthenticated) {
          if (!emailExists.value) {
            if (lastName.value && firstName.value) {
              return 'register'
            }
          } else {
            return 'login'
          }
        }
      })

      // shipping info
      const SHIPPING_WORKING_DAYS = 5

      const shipping = reactive({
        state: 'Montevideo',
        neighborhood: '',
        address: ''
      })

      const stateOptions = [
        'Artigas', 'Canelones', 'Cerro Largo', 'Colonia', 'Durazno', 'Flores',
        'Florida', 'Lavalleja', 'Maldonado', 'Montevideo', 'Paysandú', 'Río Negro',
        'Rivera', 'Rocha', 'Salto', 'San José', 'Soriano', 'Tacuarembó', 'Treinta y Tres'
      ]

      const freeShippingDate = computed(() => {
        const daysNames = {
          1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves',
          5: 'Viernes', 6: 'Sabado', 0: 'Domingo'
        }
        const monthNames = {
          0: 'Enero', 1: 'Febrero', 2: 'Marzo', 3: 'Abril', 4: 'Mayo',
          5: 'Junio', 6: 'Julio', 7: 'Agosto', 8: 'Septiembre', 9: 'Octubre',
          10: 'Noviembre', 11: 'Diciembre'
        }
        let currentDate = new Date()
        let workingDays = 0

        let shippingDate
        while (!shippingDate) {
          currentDate.setDate(currentDate.getDate() + 1)
          workingDays += 1
          if (workingDays === SHIPPING_WORKING_DAYS - 1) {
            shippingDate = `${daysNames[currentDate.getDay()]}, ${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]}`
          }
        }
        return shippingDate
      })

      // payment
      let paymentMethodId
      const cardNumber = ref('')

      const payment = reactive({
        document: {
          type: '',
          typeOptions: [],
          number: ''
        },
        method: null,
        card: {
          holder: '',
          securityCode: '',
          expiration: '',
          issuer: null,
          issuerOptions: [],
          installments: null,
          installmentsOptions: []
        }
      })

      if (store.state.user) payment.card.holder = store.state.user.firstName + ' ' + store.state.user.lastName

      async function getIdentificationTypes () {
        try {
          const identificationTypes = await mercadopago.getIdentificationTypes();
          payment.document.typeOptions = identificationTypes.map(idType => {
            return {
              text: idType.name,
              value: idType.id
            }
          })
          payment.document.type = payment.document.typeOptions[0].value
          // TODO: implement the automated validation that comes with identificationTypes

        } catch(e) {
            return console.error('Error getting identificationTypes: ', e);
        }
      }

      watch(cardNumber, async (newCardNumber) => {
        if (newCardNumber.length >= 6) {
          const bin = newCardNumber.substring(0,6)
          const paymentMethods = await mercadopago.getPaymentMethods({ bin })
          let additionalInfoNeeded, issuer
          ({
            id: paymentMethodId,
            additional_info_needed: additionalInfoNeeded,
            issuer
          } = paymentMethods.results[0])

          if (additionalInfoNeeded.includes('issuer_id')) {
            getIssuers()
          } else {
            payment.card.issuerOptions = [
              { text: issuer.name, value: issuer.id }
            ]
            payment.card.issuer = issuer.id
            getInstallments()
          }
        }
      })

      const getIssuers = async () => {
        try {
          const issuers = await mercadopago
            .getIssuers({ paymentMethodId, bin: cardNumber.value.slice(0,6) })

          payment.card.issuerOptions = issuers.map(issuerOption => {
            return {
              text: issuerOption.name,
              value: issuerOption.id
            }
          })

          getInstallments()
        } catch (error) {
          console.error('error getting issuers: ', error)
        }
      };

      const getInstallments = async () => {
        try {
          // Carefull hear! If the total price includes shippment, the amount should be updated
          const installments = await mercadopago.getInstallments({
            amount: String(cart.totalPrice),
            bin: cardNumber.value.slice(0,6),
            paymentTypeId: 'credit_card'
          })
          payment.card.installmentsOptions = installments[0].payer_costs.map(installmentsOption => {
            return {
              text: installmentsOption.recommended_message,
              value: installmentsOption.installments
            }
          })
          payment.card.installments = installments[0].payer_costs[0].installments
        } catch(error) {
          console.error('error getting installments: ', error)
        }
      }

      function isValid () {
        resetErrors()
        let errorCount = 0

        // contact info
        if (!useValidation.validEmail(email.value)) {
          errors.value.contact.email = 'El email no es válido'
          errorCount++
        }
        if (!firstName.value) {
          errors.value.contact.firstName = 'Ingresa tu nombre'
          errorCount++
        }
        if (!lastName.value) {
          errors.value.contact.lastName = 'Ingresa tu apellido'
          errorCount++
        }
        if (!useValidation.validPhone(phone.value)) {
          errors.value.contact.phone = 'El número de teléfono no es válido'
          errorCount++
        }

        // shipping info
        if (!shipping.state) {
          errors.value.shipping.state = 'Selecciona el departamento de envío'
          errorCount++
        }

        if (!shipping.neighborhood) {
          errors.value.shipping.neighborhood = 'Ingresa el barrio de envío'
          errorCount++
        }

        if (!shipping.address) {
          errors.value.shipping.address = 'Ingresa la dirección de envío'
          errorCount++
        }

        // payment
        if (!freeOrder.value) {
          if (!payment.document.type) {
            errors.value.payment.document.type = 'Selecciona tu tipo de documento'
            errorCount++
          }
  
          if (!payment.document.number) {
            errors.value.payment.document.number = 'Ingresa tu número de documento'
            errorCount++
          }

          if (payment.method === 'card') {
            if (!payment.card.holder) {
              errors.value.payment.card.holder = 'Ingresa el nombre del titular de la tarjeta'
              errorCount++
            }
            if (!cardNumber.value) {
              errors.value.payment.card.number = 'Ingresa el número de la tarjeta'
              errorCount++
            }
            if (!payment.card.securityCode) {
              errors.value.payment.card.securityCode = 'Ingresa el código de seguridad de la tarjeta'
              errorCount++
            }
            if (!payment.card.expiration) {
              errors.value.payment.card.expiration = 'Ingresa la fecha de vencimiento de la tarjeta'
              errorCount++
            }
          }
        }

        if (errorCount === 1) {
          errors.value.general = `Encontramos 1 error que encontrarás marcado arriba. Corrigelo antes de continuar.`
          return false
        }

        if (errorCount > 1) {
          errors.value.general = `Encontramos ${errorCount} errores que encontrarás marcados arriba. Corrigelos antes de continuar.`
          return false
        }

        if (!freeOrder.value && !payment.method) {
          errors.value.general = 'Debes seleccionar un método de pago primero.'
          return false
        }

        return true
      }

      async function pay () {
        if (isValid()) {
          try {
            loading.value = true
            const token = await mercadopago.createCardToken({
              cardNumber: cardNumber.value,
              cardholderName: payment.card.holder,
              identificationType: payment.document.type,
              identificationNumber: payment.document.number,
              securityCode: payment.card.securityCode,
              cardExpirationMonth: payment.card.expiration.split('/')[0],
              cardExpirationYear: payment.card.expiration.split('/')[1]
            })

            let paymentData, documentData
            if (!freeOrder.value) {
              documentData = {
                type: payment.document.type,
                number: payment.document.number
              }
              if (payment.method === 'card') {
                paymentData = {
                  method: payment.method,
                  paymentMethodId,
                  token: token.id,
                  installments: payment.card.installments,
                  issuer: payment.card.issuer
                }
              } else {
                paymentData = {
                  method: payment.method,
                  paymentMethodId,
                }
              }
            }
            const response = await axios.post('cart/checkout', {
              items: isAuthenticated ? undefined : cartItemsSlim,
              coupon: store.state.cart.couponCode,
              contact: {
                email: email.value,
                firstName: firstName.value,
                lastName: lastName.value,
                phone: phone.value
              },
              shipping,
              document: documentData,
              payment: paymentData
            })
            store.commit('cartReset')
            router.push({ name: 'store-order', params: { orderId: response.data.order.id } })
          } catch (error) {
            errors.value.general = 'Ocurrió un error al procesar el pago: ' + (error.response?.data.message || error.message)
            console.log(error)
          } finally {
            loading.value = false
          }
        }
      }

      return {
        loading,
        accountStatus,
        cart,
        freeOrder,
        email,
        firstName,
        lastName,
        phone,
        shipping,
        stateOptions,
        freeShippingDate,
        SHIPPING_WORKING_DAYS,
        cardNumber,
        payment,
        currentLocation: window.location.pathname,
        errors,
        pay
      }
    }
  }
</script>
