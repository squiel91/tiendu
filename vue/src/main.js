import { createApp } from 'vue'
import Tiendu from './Tiendu.vue'
import router from './router.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'

import isDev from './common/utils/isDev'
import titleMixin from './common/utils/titleMixin'

const app = createApp(Tiendu)
  .use(store)
  .use(router)
  .use(VueAxios, axios)
  .mixin(titleMixin)

app.axios.defaults.baseURL = isDev? `http://localhost:5001/api` : '/api'

// If the user is authenticated, it adds the authToken to every the request
axios.interceptors.request.use(config => {
  const authToken = store.state.user?.authToken
  if (authToken) {
    config.headers.Authorization = authToken
  }
  return config
})

// If the authentication token is invalid, it removes the user and reloads the page
axios.interceptors.response.use(
  null,
  error => {
    if (error.response?.data?.error?.code === 'INVALID_AUTH_TOKEN') {
      store.commit('user')
      location.reload()
    }
    return Promise.reject(error)
  }
)

app.mount('#app')
