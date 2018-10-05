import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'

Vue.use(Router)
const auth = resolve => {
  require.ensure(['@/auth/auth'], () => {
    resolve(
      require('@/auth/auth')
    )
  })
}
const search = resolve => {
  require.ensure(['@/components/search'], () => {
    resolve(
      require('@/components/search')
    )
  })
}
const page404 = resolve => {
  require.ensure(['@/components/page404'], () => {
    resolve(
      require('@/components/page404')
    )
  })
}
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/login',
      name: 'auth',
      component: auth
    },
    {
      path: '/search',
      name: 'search',
      component: search,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '*',
      name: 'page404',
      component: page404,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

// авторизация
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      if (to.matched.some(record => record.meta.isAdmin)) {
        next({ name: 'index' })
      } else {
        next()
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('jwt') == null) {
      next()
    } else {
      next({ name: 'auth' })
    }
  } else {
    next()
  }
})

export default router
