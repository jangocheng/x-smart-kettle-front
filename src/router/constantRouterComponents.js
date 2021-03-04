import Main from '@/components/main'
import parentView from '@/components/parent-view'
import modules from './modules/index'
const constantRouterComponents = {
  'Main': {
    component: Main
  },
  'parentView': {
    component: parentView
  },
  'home': {
    component: 'single-page/home/home.vue'
  },
};

export default Object.assign(constantRouterComponents,modules)
