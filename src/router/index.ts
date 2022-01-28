import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/Views/Home.vue'
import Login from '@/Views/Login.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requireAuth: true } },
  { path: '/login', name: 'Login', component: Login },
]

const router = new VueRouter({
  mode: 'history',

  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta?.requireAuth) {
    const login = Vue.$sessionStorage.get('login', false)

    if (login) {
      next()
    } else {
      next('/login')
    }
  }
  next()
})

export default router
