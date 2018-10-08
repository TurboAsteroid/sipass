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
// const approval = resolve => {
//   require.ensure(['@/components/approval'], () => {
//     resolve(
//       require('@/components/approval')
//     )
//   })
// }
// const approved = resolve => {
//   require.ensure(['@/components/approved'], () => {
//     resolve(
//       require('@/components/approved')
//     )
//   })
// }
// const inside = resolve => {
//   require.ensure(['@/components/inside'], () => {
//     resolve(
//       require('@/components/inside')
//     )
//   })
// }
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
      path: '/login',
      name: 'auth',
      component: auth,
      meta: {
        guest: true
      }
    },
    // {
    //   path: '/approved',
    //   name: 'approved',
    //   component: approved,
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/inside',
    //   name: 'inside',
    //   component: inside,
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/approval',
    //   name: 'approval',
    //   component: approval,
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
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
  console.log(to)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      let user = JSON.parse(localStorage.getItem('user'))
      if (to.matched.some(record => record.meta.isAdmin)) {
        if (user.isAdmin === 1) {
          next()
        } else {
          next({ name: 'auth' })
        }
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
