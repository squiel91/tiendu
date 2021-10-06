<template>
  <div class="input-snippet" :class="{ white }">
    <div class="inner-input">
      <i v-if="error" :id="`${inputId}-error`" class="error-icon bi bi-exclamation-circle-fill"></i>
      <label v-if="label" :for="inputId">{{ label }}</label>
      <select
        v-if="options"
        :value="modelValue"
        @change="update"
        :id="inputId"
        @focus="focused"
        @blur="blured"
        :class="{ 'can-be-cleared': clearable && modelValue }"
        :tabindex="tabIndex"
      >
        <option hidden disabled value="" :selected="!value">-- selecciona uno --</option>
        <option
          v-for="option in options"
          :value="getValue(option)"
          :selected="value === getValue(option)"
          :key="option"
        >
          {{ option.text || option.value || option }}
        </option>
      </select>
      <template v-else-if="type === 'quantity'">
        <button type="button" class="change-quantity" @click="update(Math.max(modelValue - 1, this.min || 0))" :disabled="modelValue <= this.min || 0">-</button>
        <span style="padding: 16px 0;">{{ modelValue }}</span>
        <button type="button" class="change-quantity" @click="update(Math.min(modelValue + 1, 99))" :disabled="modelValue >= 99">+</button>
      </template>
      <input 
        v-else
        :type="computedType"
        ref="input"
        :value="modelValue"
        @input="update"
        :placeholder="placeholder || ' '"
        @focus="focused"
        @blur="blured"
        :id="inputId"
        :tabindex="tabIndex"
        @keyup.enter="$emit('enter')"
      >
      <button v-if="help || mobileHelp" :id="`${inputId}-help`" :class="{ 'hide-desktop': !!mobileHelp}">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#a7a7a7" class="bi bi-question-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
        </svg>
      </button>
      <img v-if="type === 'card'" id="card-type" style="align-self: center; margin-right: 8px;" src="../assets/cc.svg" width="43" alt="card type">
      <button v-if="type === 'password' && !showPassword" class="password-button" @click="showPassword = !showPassword">
        <i class="bi bi-eye-fill" />
      </button>
      <button v-if="type === 'password' && showPassword" class="password-button" @click="showPassword = !showPassword">
        <i class="bi bi-eye-slash-fill" />
      </button>
      <slot name="button"></slot>
      <button v-if="clearable && modelValue" type="button" class="clear" @click="clear">
        <i class="bi bi-x"></i>
      </button>
    </div>
  </div>
</template>

<script>
  import tippy from 'tippy.js'
  import 'tippy.js/dist/tippy.css';
  import Cleave from 'cleave.js'

  let uid = 0

  export default {
    data() {
      return {
        showPassword: false,
        isFocused: false,
      }
    },
    props: {
      label: String,
      placeholder: String,
      modelValue: String,
      type: {
        type: String,
        default: 'text'
      },
      min: Number,
      options: Array,
      help: String,
      mobileHelp: String,
      tabIndex: Number,
      clearable: {
        type: Boolean,
        default: false
      },
      error: String,
      white: { 
        type: Boolean,
        default: false
      }
    },
    emits: ['update:modelValue', 'clear-error', 'keydown', 'enter', 'focus', 'blur'],
    computed: {
      inputId() {
        return `input-${this.uid}`
      },
      computedType () {
        if (this.type === 'password') {
          return this.showPassword ? 'text' : 'password' 
        }
        return 'text'
      }
    },
    watch: {
      error () {
        if (this.error) {
          this.$nextTick(() => {
            tippy(`#${this.inputId}-error`, {
              content: this.error,
              showOnCreate: true
            })
          })
        }
      }
    },
    methods: {
      focused (event) {
        console.log('Focused')
        this.isFocused = true
        this.$emit('focus', event)
      },
      blured (event) {
        this.isFocused = false
        this.$emit('blur', event)
      },
      getValue(option) {
        if (option.value !== undefined) 
          return option.value
        else 
          return option.text || option
      },
      clear () {
        this.$nextTick(() => {
          this.$emit('update:modelValue', undefined)
        })
      },
      update(event) {
        this.$emit('update:modelValue', this.type !== 'quantity'? event.target.value : event)
        this.$emit('clear-error')
      }
    },
    created() {
      uid += 1
      this.uid = uid
    },
    mounted() {
      const helpMessage = this.help || this.mobileHelp
      if (!!helpMessage) {
        this.$nextTick(() => {
          tippy(`#${this.inputId}-help`, {
            content: helpMessage,
            showOnCreate: false
          })
        })
      }
      
      if (this.type === 'cardExp') {
        new Cleave(this.$refs.input, {
          date: true,
          datePattern: ['m', 'y']
        })
      }
    }
  }
</script>
