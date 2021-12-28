<template>
  <transition
    @before-enter="$refs.collapsableSnippet.style.height = '0px'"
    @enter="$refs.collapsableSnippet.style.height = `${$refs.collapsableSnippet.scrollHeight}px`"
    @after-enter="$refs.collapsableSnippet.style.height = 'auto'"
    @before-leave="$refs.collapsableSnippet.style.height = `${$refs.collapsableSnippet.scrollHeight}px`"
    @leave="$refs.collapsableSnippet.style.height = '0px'"
  >
    <div v-show="!collapsed" class="collapsable-snippet" ref="collapsableSnippet">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      collapsed: {
        type: Boolean,
        default: true
      }
    } 
  }
</script>
