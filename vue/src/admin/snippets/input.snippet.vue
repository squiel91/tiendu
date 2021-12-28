<template>
  <label :id="id" :for="id + '-input'" class="input-snippet tiendu-input">
    <i v-if="error" :id="id +'-error'" class="error-icon bi bi-exclamation-circle-fill"></i>
    <span v-if="label" class="label">{{ label }}</span>
    <input v-if="!options" @blur="$emit('blur', $event)" @keyup.enter="$emit('enter')" :placeholder="placeholder" :type="type" :step="step" :id="id + '-input'" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :class="{ noLable: !label }">
    <span v-if="postLabel" class="post-label">{{ postLabel }}</span>
    <select v-if="options" @blur="$emit('blur', $event)" :id="id + '-input'" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :class="{ noLable: !label }">
      <option v-for="option in options" :key="option" :value="option.value || option.text || option">{{ option.text || option }}</option>
    </select>
    <button v-if="remove" class="close-button" @click="$emit('remove')"><i class="bi bi-x-lg"></i></button>
    <i v-if="help" :id="id +'-help'" class="help-icon bi bi-question-circle-fill"></i>
  </label>
</template>

<script>
  import tippy from 'tippy.js'
  import 'tippy.js/dist/tippy.css';

  export default {
    props: {
      modelValue: String,
      type: {
        type: String,
        default: 'text'
      },
      step: {
        type: Number,
        default: 0.1
      },
      placeholder: String,
      label: String,
      postLabel: String,
      options: Array,
      help: String,
      error: String,
      remove: Boolean,
      id: {
        type: String,
        required: true
      }
    },
    emits: ['update:modelValue', 'blur', 'enter'],
    mounted () {
      if (this.help) {
        tippy(`#${this.id}-help`, {
          content: this.help,
        })
      }
    },
    watch: {
      error (newErrorMessage) {
        if (newErrorMessage) {
          this.$nextTick(() => {
            tippy(`#${this.id}-error`, {
              content: newErrorMessage,
            })
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  label.tiendu-input {
    line-height: 1;
      background-color: whitesmoke;
      border-radius: 2px;
      display: flex;
      align-items: baseline;
    }

    label.tiendu-input span.label, label.tiendu-input span.post-label {
      padding: 16px 4px 16px 16px;
      color: darkgray;
      flex-shrink: 0;
    }

    label.tiendu-input input, label.tiendu-input select {
      padding: 16px 16px 16px 4px;
      border: none;
      background-color: transparent;
      font-family: inherit;
      outline: none;
      font-size: inherit;
      width: 0;
      flex-grow: 1;

      &.noLable {
        padding: 16px;
      }
    }

    label.tiendu-input input::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: lightgray;
      opacity: 1; /* Firefox */
    }

    label.tiendu-input input:-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: lightgray;
    }

    label.tiendu-input input::-ms-input-placeholder { /* Microsoft Edge */
      color: lightgray;
    }

    i.help-icon {
      padding: 16px 16px 16px 8px;
      color: darkgray;
      cursor: help;
      margin-left: 8px;
    }

    i.error-icon {
      padding: 16px 16px 16px;
      margin-right: -16px;
      cursor: help;
      color: red;
      z-index: 1;
    }

    .close-button {
      padding: 16px 16px 16px 16px;
      color: blue;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
</style>