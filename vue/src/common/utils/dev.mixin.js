export default {
  computed: {
    devHost () {
      const isDev = process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test' && typeof console !== 'undefined'
      return isDev ? `http://${location.hostname}:5001` : ''
    }
  }
} 