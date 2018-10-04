Необходимо в main.js импортировать index.js и выполнить initAuth

import auth from '@/auth'
auth.initAuth()
...


Для роутера с ленивой загрузкой:

const auth = resolve => {
  require.ensure(['@/auth/auth'], () => {
    resolve(
      require('@/auth/auth')
    )
  })
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
       name: 'auth',
       component: auth
     },
     ...
   ]
 })
