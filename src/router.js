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
const page404 = resolve => {
  require.ensure(['@/components/page404'], () => {
    resolve(
      require('@/components/page404')
    )
  })
}
const list = resolve => {
  require.ensure(['@/components/list'], () => {
    resolve(
      require('@/components/list')
    )
  })
}
const card = resolve => {
  require.ensure(['@/components/card'], () => {
    resolve(
      require('@/components/card')
    )
  })
}
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/list/:id/:name',
      name: 'list',
      component: list,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/card/:kpp/:doknr/:propusk',
      name: 'card',
      component: card,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'auth',
      component: auth,
      meta: {
        guest: true
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
    if (localStorage.getItem('jwt') == null || localStorage.getItem('globalUserData') == null) {
      if (localStorage.getItem('globalUserData') !== 'undefined') {
        Vue.prototype.$globalUserData = JSON.parse(localStorage.getItem('globalUserData'))
      }
      localStorage.clear()
      next({ name: 'auth' })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('jwt') == null || localStorage.getItem('globalUserData') == null) {
      if (localStorage.getItem('globalUserData') !== 'undefined') {
        Vue.prototype.$globalUserData = JSON.parse(localStorage.getItem('globalUserData'))
      } else {
        localStorage.clear()
        next({ name: 'auth' })
      }
      next()
    } else {
      localStorage.clear()
      next({ name: 'auth' })
    }
  } else {
    next()
  }
})

export default router
