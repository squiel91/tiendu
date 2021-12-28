<template>
  <div id="coupon-page" class="container">
    <Breadcrumb :stack="[{ label: 'Marketing', routerLink: { name: 'admin-marketing' } }]" active="Cupón" />
    <div style="display: flex;">
      <h1 style="margin-bottom: 40px; flex-grow: 1;">Cupón</h1>
      <div>
        <SecondaryButton :disabled="createCoupon" @click="remove()">
          <div>
            <span class="hide-mobile">
              Borrar
            </span>
            <i class="hide-tablet-and-up bi bi-trash-fill"></i>
          </div>
        </SecondaryButton>
      </div>
    </div>
    <div class="coupon-editor-grid">
      <Input label="Descripción" id="description" v-model="description" help="Corta descripción del descuento. Si no es vacía se le mostrará al cliente al aplicarlo. Este campo es opcional"></Input> 
      <div>
        <Input label="Código" v-model="code" @blur="onBlurCode()" :error="codeError" help="El código del cupón que el cliente deberá ingresar para obtener el descuento"></Input>
        <div class="extra-detail">Link de descuento: <router-link :to="{ name: 'store-cart', query: { cupon: code } }" :href="'/cupon/' + code">{{ applyCodeUrl }}</router-link></div>
      </div>
      <Input :label="discountLabel" type="number" step="1" :error="discountError" :post-label="discountPostLabel" id="percentage" v-model="discount" help="El descuento del cupón, que puede ser un porcentaje sobre el monto total de la órden (incluido el envío) o un monto fijo"></Input>
      <div style="align-self: center; align-items: center; display: flex;">
        <div>
          <input type="radio" v-model="discountType" value="percentage" id="percentage-type"><label for="percentage-type">Porcentaje</label>
        </div>
        <div>
          <input style="margin-left: 16px;" type="radio" v-model="discountType" value="amount" id="amount-type"><label for="amount-type">Monto fijo</label>
        </div>
      </div>
    </div>
    <h2>Restricciones</h2>
    <div class="coupon-editor-grid">
      <div>
        <Input label="# Usos máximo" type="number" step="1" :error="maxUsesError" id="maxUses" v-model="maxUses" help="La cantidad máxima que se puede usar este cupón. Este campo es opcional"></Input> 
        <div class="extra-detail">Cantidad de veces ya usado: {{ timesUsed }}</div>
      </div>
      <Input label="Order mínima $" type="number" step="1" :error="minSpendError" id="minSpend" v-model="minSpend" help="La orden deberá se mayor a este monto para que se puede aplicar. Este campo es opcional"></Input> 
      <div class="first-col span-2-col" style="display: flex;">
        <input type="checkbox" id="active" v-model="active" style="margin-right: 8px"><label for="active">Activo</label>
      </div>
      <div v-if="errorMessage" class="error-message first-col span-2-col">
        <i class="bi bi-exclamation-circle"></i> {{ errorMessage }}
      </div>
      <div class="first-col span-2-col">
        <Button normal-text="Guardar cupón" @click="save()"></Button>
      </div>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'
  import Button from '../snippets/button.snippet.vue'
  import SecondaryButton from '../snippets/secondary-button.snippet.vue'
  import Input from '../snippets/input.snippet.vue'

  import isAdmin from '../../common/utils/isAdmin'

  export default {
    beforeRouteEnter: isAdmin,
    props: ['couponId'],
    data() {
      return {
        createCoupon: undefined,
        errorMessage: '',
        code: '',
        codeError: '',
        description: undefined,
        timesUsed: 0,
        active: true,

        // discount
        discountType: 'percentage',
        discount: undefined,
        discountError: '',

        // conditions
        maxUses: undefined,
        maxUsesError: '',
        minSpend: undefined,
        minSpendError: '',

        applyCodeUrl: ''
      }
    },
    computed: {
      discountLabel() {
        return 'Descuento' + (this.discountType === 'percentage' ? '' : ' $') 
      },
      discountPostLabel () {
        return this.discountType === 'percentage' ? '%' : ''
      },
      applyCodeUrl () {
        return window.location.host + '/cart?cupon=' + this.code
      }
    },
    components: {
      Breadcrumb,
      Button,
      SecondaryButton,
      Input
    },
    async created () {
      try {
        this.createCoupon = this.couponId === 'create'
        if (!this.createPage) {
          const response = await this.axios.get(`coupons/${this.couponId}`)
          
          const coupon = response.data.coupon
          this.code = coupon.code
          this.description = coupon.description
          this.discountType = coupon.percentage ? 'percentage' : 'amount'
          this.discount = coupon.percentage || coupon.amount
          this.minSpend = coupon.minSpend
          this.maxUses = coupon.maxUses
          this.timesUsed = coupon.timesUsed
          this.active = coupon.active || false
        } else {
          this.code = this.generateRandomCode(6)
        }
      } catch (error) {
        this.error = true
        console.error(error)
      }
    },
    methods: {
      onBlurCode() {
        this.code = this.code.replace(' ', '-').toUpperCase().replace(/[^-0-9A-Z]/g, '');
      },
      generateRandomCode(length) {
        const result = []
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const charactersLength = characters.length
        for (let i = 0; i < length; i++) {
          result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
        }
        return result.join('')
      },
      async save () {
        try {
          this.errorMessage = ''
          this.codeError = ''
          this.discountError = ''
          this.maxUsesError = ''
          this.minSpendError= ''

          const response = await (this.createCoupon? this.axios.post : this.axios.patch)(this.createCoupon? 'coupons' : `coupons/${this.couponId}`, {
            description: this.description || undefined,
            code: this.code,
            active: this.active,
            percentage: this.discountType === 'percentage' && this.discount ?  parseFloat(this.discount) : undefined,
            amount: this.discountType === 'amount' && this.discount ? parseFloat(this.discount) : undefined,
            minSpend: this.minSpend?  parseFloat(this.minSpend) : undefined,
            maxUses: this.maxUses?  parseInt(this.maxUses) : undefined
          })
          
          this.$router.push({ name: 'admin-marketing' })
        } catch (error) {
          console.error(error)
          if (error.response?.data?.fields) {
            this.errorMessage = 'Se detectó algun error. Quedaron marcados arriba en rojo.' 
            const errorFields = error.response.data.fields
            for (const errorField of errorFields) {
              if ((errorField.name + 'Error') in this)
              this[errorField.name + 'Error'] = errorField.message
            }
          } else {
            this.errorMessage = error.response?.data?.message || 'Ocurrió un error en el servidor' 
          }
        }
      },
      async remove () {
        try {
          const response = await this.axios.delete(`coupons/${this.couponId}`)
          this.$router.push({ name: 'admin-marketing' })
        } catch (error) {
          alert('Ocurrió un error al borrar el cupón')  
          console.error(error)
        }
      }
    }
  }
</script>
