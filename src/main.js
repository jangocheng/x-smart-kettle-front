// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import ViewUI from "view-design";
import i18n from '@/locale'
import config from "@/config/config";
import importDirective from "@/directive";
import { directive as clickOutside } from "v-click-outside-x";
import "./index.less";
import "@/./assets/icons/iconfont.css";
import { Tree, Table, TableColumn } from "element-ui";
// 实际打包时应该不引入mock
/* eslint-disable */
// if(process.env.NODE_ENV !== 'production')
require('@/mock')
import valid from './libs/validate.js'

//自定义校验规则
Vue.prototype.$Valid = valid;

 Vue.component(Tree.name, Tree);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
 import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
import XtlDesign from "@/components";

Vue.use(ViewUI,{
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(XtlDesign);
 /**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false;
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;
/**
 * 注册指令
 */
importDirective(Vue);
Vue.directive("clickOutside", clickOutside);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  i18n,
  store,
  render: h => h(App)
});
