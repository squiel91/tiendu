import { createStore } from 'vuex'

const itemKey = (productId, variantId) => variantId ? `${productId}-${variantId}` : productId

const storage = {
  set (key, value) {
    if (value === undefined && value === null)
      localStorage.removeItem(key)
    else
      localStorage.setItem(key, JSON.stringify(value))
  },
  get (key) {
    if (localStorage.hasOwnProperty(key))
      return JSON.parse(localStorage.getItem(key))
  }
}

const emptyCart = () => {
  return {
    itemsIndex: {},
    itemsQuantity: 0,
    couponCode: null
  }
}

// the function 'initializeStore' should be called as soon as created
export default createStore({
  state () {
    // refer to 'initializeStore'  and 'user' functions for more on cart and user structure
    return {
      user: null,
      cart: null
    }
  },
  mutations: {
    initializeStore(state) {
      state.user = storage.get('user')
      state.cart = storage.get('cart') || emptyCart()
    },
    // used to set and remove the user
    user(state, options) {
      if (options)
        state.user = {
          email: options.email,
          firstName: options.firstName,
          lastName: options.lastName,
          authToken: options.authToken,
          // TODO: If a normal user is signed is and the role changed to admin,
          // the user has to sign out and in again to be able to
          // access the admin panel. It should not be this way.
          admin: options.admin
        }
      else  
        state.user = null
      storage.set('user', state.user)
    },
    cartAddItem (state, options) {
      this.commit('cartModifyItem', {
        productId: options.productId,
        variantId: options.variantId,
        title: options.title,
        quantity: (state.cart[itemKey(options.productId, options.variantId)]?.quantity || 0) + options.quantity
      })
    },
    cartModifyItem (state, options) {
      const quantity = options.quantity
      state.cart.itemsIndex[itemKey(options.productId, options.variantId)] = { 
        title: options.title,
        quantity
      }

      if (quantity <= 0) {
        delete state.cart.itemsIndex[itemKey(options.productId, options.variantId)]
      } 

      storage.set('cart', state.cart)
    },
    cartQuantity (state, newItemsQuantiy) {
      state.cart.itemsQuantity = newItemsQuantiy
      storage.set('cart', state.cart)
    },  
    cartReset (state) {
      state.cart = emptyCart()
      storage.set('cart', state.cart)
    },
    couponCode (state, couponCode) {
      state.cart.couponCode = couponCode
      storage.set('cart', state.cart)
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    isAdmin (state) { return !!state.user?.admin },
    cartQuantity (state, getters) {
      if (getters.isAuthenticated)
        return state.cart.itemsQuantity
      else
        return Object.values(state.cart.itemsIndex).reduce((total, item) => total + item.quantity, 0)
    },
    cartItemsSlim(state) {
      return Object.entries(state.cart.itemsIndex).map(([itemKey, productDetails]) => {
        const [ productId, variantId ] = itemKey.split('-') // variantId might not exist (when the item has no variants)
        return {
          productId,
          variantId: variantId && parseInt(variantId),
          quantity: productDetails.quantity,
          title: productDetails.title
        }
      })
    }
  },
})