import constantRouterComponents from './constantRouterComponents'
import Main from "_c/main";
import exampleMenuData from "./exampleMenuData";

/**
 * 动态生成菜单
 * @param permissionList
 * @returns Router
 */
export const generatorDynamicRouter = (permissionList) => {
  let menuData = [], pageNode = {
    path: '/page',
    name: 'page',
    meta: {
      hideInMenu: true,
      notCache: true
    },
    component: 'Main',
    children: []
  }

  listToMenuTree(permissionList, menuData, pageNode, '0', [], true)
  if (pageNode.children.length > 0) {
    menuData.push(pageNode)
  }

     const dynamicRouter = generator(menuData)
  console.log(dynamicRouter,9899)
   return dynamicRouter
}

/*
生成 vue-router 层级路由表
 */
const generator = (menuData) => {

   for (let item of menuData) {
    if (item.component) {
      const target = constantRouterComponents[item.component]
      if (target) {
        if (typeof target.component == 'string') {
          // 解决路由name与组件name不一致导致的keeplive不生效的问题
          item.component = (resolve) => require([`@/view/${target.component}`], data => {
            data.default.name = item.name;
            resolve(data);
          })
        } else {
          item.component = target.component
        }

        if (target.url) {
          item.path = target.url
        } else if (item.uri && item.uri.startsWith("/")) {
          item.path = item.uri
        }
        if (target.alias) {
          item.alias = target.alias
        }
        if (target.frameUrl) {
          item.meta.frameUrl = target.frameUrl
        }
        if (target.notCache) {
          item.meta.notCache = target.notCache
        }
        if (target.hideInMenu) {
          item.meta.hideInMenu = target.hideInMenu
        }
        if (target.hideInBread) {
          item.meta.hideInBread = target.hideInBread
        }

      } else {
        console.error(`找不到组件定义:${item.component}`)
        item.component = (resolve) => require([`@/view/exception/dev.vue`], data => {
          data.default.name = '开发中';
          resolve(data);
        })
      }
      if (item.path == null) {
        item.path = ''
      }
      if (item.children && item.children.length > 0) {
        generator(item.children)
      }
    }
  }
  return menuData
}

/**
 * 数组转树形结构
 */
const listToMenuTree = (list, menuTree, pageNode, parentId, crumbs, root) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.pid === parentId) {
      if (item.type === 1 || item.type === 2) {
        let node = {
          meta: {
            title: item.label,
            icon: item.icon,
            crumbs: [...crumbs],
            activeName: item.name,
            tag:item.tag
          },
          type: item.type,
          pid: item.pid,
          component: item.name,
          name: item.name,
          uri: item.uri,
          children: []
        }
        node.meta.crumbs.push({
          icon: item.icon,
          name: item.name,
          title: item.label,
          type: item.type,
          tag:item.tag
        })

        if(item.type ===1){
          if (root) {
               node.component = "Main"
          } else {
            node.component = "parentView"
          }
        }


        // 迭代 list， 找到当前菜单相符合的所有子菜单
        listToMenuTree(list, node.children, pageNode, item.permissionId, node.meta.crumbs, false)
        // 删掉不存在 children 值的属性
        if (node.children.length <= 0) {
          delete node.children
        }
        // 加入到树中
        menuTree.push(node)
      }
      if (item.type === 4) {
        let child = {
          meta: {
            title: item.label,
            hideInMenu: true,
            crumbs: [...crumbs],
            type: item.type,
            tag:item.tag
          },
          type: item.type,
          pid: item.pid,
          component: item.name,
          name: item.name,
          uri: item.uri
        }
        child.meta.crumbs.push({
          icon: item.icon,
          name: item.name,
          title: item.label,
          type: item.type,
          tag:item.tag
        })
        pageNode.children.push(child)
      }
    }

  })
}

const addExtendMenu = (menuData) => {
  let menu = [];
  if (process.env.NODE_ENV === 'development') {
    menu = menu.concat(exampleMenuData)
  }
  menu = menu.concat(menuData)
  return menu
}

export default generatorDynamicRouter
