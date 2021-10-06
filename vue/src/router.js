import { createWebHistory, createRouter } from 'vue-router'

// Themes
import AdminTheme from './admin/themes/admin.theme.vue'
import StoreTheme from './store/themes/store.theme.vue'

// Admin
import AdminDashboard from './admin/pages/dashboard.page.vue'
import AdminOrders from './admin/pages/orders.page.vue'
import AdminOrder from './admin/pages/order.page.vue'
import AdminProducts from './admin/pages/products.page.vue'
import AdminProduct from './admin/pages/product.page.vue'
import AdminCategories from './admin/pages/categories.page.vue'
import AdminCategory from './admin/pages/category.page.vue'
import AdminUsers from './admin/pages/users.page.vue'
import AdminContent from './admin/pages/content.page.vue'
import AdminPage from './admin/pages/page.page.vue'
import AdminPost from './admin/pages/post.page.vue'
import AdminMarketing from './admin/pages/marketing.page.vue'
import AdminCoupon from './admin/pages/coupon.page.vue'
import AdminCustomize from './admin/pages/customize.page.vue'
import Admin404 from './admin/pages/404.page.vue'

// Store
import StoreHome from './store/pages/home.page.vue'
import StoreSearch from './store/pages/search.page.vue'
import StoreProduct from './store/pages/product.page.vue'
import StoreCategory from './store/pages/category.page.vue'
import StoreCart from './store/pages/cart.page.vue'
import StoreCheckout from './store/pages/checkout.page.vue'
import StoreOrder from './store/pages/order.page.vue'
import StoreLogin from './store/pages/login.page.vue'
import StoreRegister from './store/pages/register.page.vue'
import StoreAccount from './store/pages/account.page.vue'
import StoreRequestNewPassword from './store/pages/request-new-password.page.vue'
import StoreResetPassword from './store/pages/reset-password.page.vue'
import StorePage from './store/pages/page.page.vue'
import StoreBlog from './store/pages/blog.page.vue'
import StoreBlogpost from './store/pages/blog-post.page.vue'
import Store404 from './store/pages/404.page.vue'

const routes = [
  { path: '/admin/', redirect: { name: 'admin-dashboard' } },
  {
    path: '/admin',
    component: AdminTheme,
    children: [
      { path: 'resumen', name: 'admin-dashboard', component: AdminDashboard },
      { path: 'orders', name: 'admin-orders', component: AdminOrders },
      { path: 'orders/:orderId', name: 'admin-orders-edit', component: AdminOrder, props: true },
      { path: 'products', name: 'admin-products', component: AdminProducts },
      { path: 'products/:productId', name: 'admin-products-edit', component: AdminProduct, props: true },
      { path: 'categories', name: 'admin-categories', component: AdminCategories },
      { path: 'categories/:categoryId', name: 'admin-categories-edit', component: AdminCategory, props: true },
      { path: 'users', name: 'admin-users', component: AdminUsers },
      { path: 'content', name: 'admin-content', component: AdminContent },
      { path: 'pages/:pageId', name: 'admin-content-pages-edit', component: AdminPage, props: true },
      { path: 'posts/:postId', name: 'admin-content-posts-edit', component: AdminPost, props: true },
      { path: 'marketing', name: 'admin-marketing', component: AdminMarketing },
      { path: 'coupons/:couponId', name: 'admin-marketing-coupons-edit', component: AdminCoupon, props: true },
      { path: 'customize', name: 'admin-customize', component: AdminCustomize },
      { path: ':catchAll(.*)*', name: 'admin-not-found', component: Admin404 }
    ]
  },
  {
    path: '/',
    component: StoreTheme,
    children: [
      { path: '', name: 'store-home', component: StoreHome },
      { path: 'buscar', name: 'store-search', component: StoreSearch },
      { path: 'productos/:productHandle', name: 'store-product', component: StoreProduct, props: true },
      { path: 'categorias/:categoryHandle', name: 'store-category', component: StoreCategory, props: true },
      { path: 'canasta', name: 'store-cart', component: StoreCart },
      { path: 'canasta/checkout', name: 'store-checkout', component: StoreCheckout },
      { path: 'cuenta', name: 'store-account', component: StoreAccount },
      { path: 'ordenes/:orderId', name: 'store-order', component: StoreOrder, props: true },
      { path: 'cuenta/ingresar', name: 'store-login', component: StoreLogin },
      { path: 'cuenta/registrarse', name: 'store-register', component: StoreRegister },
      { path: 'cuenta/restablecer', name: 'store-request-new-password', component: StoreRequestNewPassword },
      { path: 'cuenta/restablecer/:resetToken', name: 'store-reset-password', component: StoreResetPassword, props: true },
      { path: 'paginas/:pageHandle', name: 'store-page', component: StorePage, props: true },
      { path: 'blog', name: 'store-blog', component: StoreBlog },
      { path: 'blog/:postHandle', name: 'store-blog-post', component: StoreBlogpost, props: true },
      { path: ':catchAll(.*)*', name: 'store-not-found', component: Store404 }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)
  next()
})

export default router
