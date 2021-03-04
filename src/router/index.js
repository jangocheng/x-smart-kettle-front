import Vue from 'vue'
import Router from 'vue-router'
import generatorDynamicRouter from './generator-routers'
import {TOKEN_KEY,THIRD_TOKEN_KEY,setToken,getToken, setTitle} from '@/libs/platformUtil'
import store from '@/store'
import baseRouter from "@/router/baseRouter";
import ViewUI from 'view-design';
import config from "@/config/config";
import col from "element-ui/packages/col/src/col";

//这段代码是解决路由在重定向时控制台内有报错的问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', meta: {
    hideInMenu: true
  }
}

const router = new Router({
  base: 'kettle-admin',
  routes: baseRouter,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'
let dynamicRouters=[] ;
router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start()
  const token = getToken()
   if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  }else if (to.name === LOGIN_PAGE_NAME) {
    // 要跳转的页面是登录页
    next()
  } else {
    if (!store.state.user.userName) {
       ViewUI.Spin.show()
        store.dispatch('getUserInfo').then(user => {
           store.dispatch('getPermissionData').then(permissionData => {
            let permission=permissionData.filter(item => {
              return config.appIds.includes(item.appId)
            });
             dynamicRouters = generatorDynamicRouter(permission)
            dynamicRouters.push(notFoundRouter)
            router.addRoutes(dynamicRouters)
            for (const item of dynamicRouters) {
              router.options.routes.push(item)
            }
            ViewUI.Spin.hide()
             next({...to, replace: true})
          }).catch((err) => {
             console.error(err)
             setToken('');
            next({
              name: LOGIN_PAGE_NAME
            })
          })
        }).catch((err) => {
           console.error(err)
          setToken('')
          next({
            name: LOGIN_PAGE_NAME
          })
        })
    } else {
      next()
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  ViewUI.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
