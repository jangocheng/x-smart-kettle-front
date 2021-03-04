import Main from '@/components/main'
 const baseRouter = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    name: '_home',
    path: '/',
    redirect:'/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true,
      tag:'home'
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '调度大盘',
          notCache: true,
          icon: 'md-home',
          tag:'home'
        },
        component: () => import('@/view/homepage/homepage')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/view/exception/404'),
    meta: {
      hideInMenu: true
    }
  }
]

export default baseRouter
