/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    meta: {
      title: "示例页面",
      icon: "ios-grid"
    },
    component: "Main",
    name: "示例页面",
    path: "/page",
    children: [
      {
        meta: {
          title: "分页示例页面",
          icon: "logo-pinterest"
        },
        component: "分页示例页面",
        name: "分页示例页面",
        path: "index"
      },
      {
        meta: {
          title: "新增示例页面",
          hideInMenu: false,
          icon: "logo-pinterest"
        },
        component: "新增示例页面",
        name: "新增示例页面",
        path: "edit"
      },
      {
        meta: {
          title: "明细示例页面",
          hideInMenu: false,
          icon: "logo-pinterest"
        },
        component: "明细示例页面",
        name: "明细示例页面",
        path: "detail"
      }
    ]
  },
  {
    meta: {
      title: "组件",
      icon: "ios-grid"
    },
    component: "Main",
    name: "组件",
    path: "common",
    children: [
      {
        meta: {
          title: "组件库",
          icon: "logo-pinterest"
        },
        component: "组件库",
        name: "组件库",
        path: "index"
      } /*,
      {
        meta:{
          title:"XtlElTable示例",
          icon:"logo-pinterest"
        },
        component:"XtlElTable示例",
        name:"XtlElTable示例",
        path:"xtl-el-table"
      },
      {
        meta:{
          title:"XtlElTable示例1",
          icon:"logo-pinterest"
        },
        component:"XtlElTable示例1",
        name:"XtlElTable示例1",
        path:"xtl-el-table1"
      },
      {
        meta:{
          title:"XtlElTable示例2",
          icon:"logo-pinterest"
        },
        component:"XtlElTable示例2",
        name:"XtlElTable示例2",
        path:"xtl-el-table2"
      },
      {
        meta:{
          title:"XtlElTable示例3",
          icon:"logo-pinterest"
        },
        component:"XtlElTable示例3",
        name:"XtlElTable示例3",
        path:"xtl-el-table3"
      },
      {
        meta:{
          title:"XtlElTable示例4",
          icon:"logo-pinterest"
        },
        component:"XtlElTable示例4",
        name:"XtlElTable示例4",
        path:"xtl-el-table"
      }*/
    ]
  }
];
