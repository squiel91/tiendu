import store from '../../store'

export default (to, from, next) => {
  if (store.getters.isAdmin) {
    next()
  } else {
    next({ name: 'store-login', query: { from: location.pathname } })
  }
}