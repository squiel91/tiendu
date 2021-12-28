// https://medium.com/@Taha_Shashtari/the-easy-way-to-change-page-title-in-vue-6caf05006863

function getTitle (vm) {
  const { title } = vm.$options
  if (title) {
    return typeof title === 'function'
      ? title.call(vm)
      : title
  }
}
export default {
  methods: {
    setTitle(title) {
      if (title) {
        document.title = title
      }
    }
  },
  created () {
    this.setTitle(getTitle(this))
  }
}