export default {
  methods: {
    logout() {
      this.$store.commit('user', null)
      this.$router.push({ name: 'store-home' })
    }
  }
}