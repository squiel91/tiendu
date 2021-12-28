export default {
  validEmail (email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  },
  validPassword (password) {
    if ((password || '').length < 6) return false
    else return true
  },
  validPhone (phone) {
    if ((phone || '').length < 7) return false
    else return true
  }
}