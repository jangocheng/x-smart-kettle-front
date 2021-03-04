import error404 from '@/assets/images/error-page/404.svg'
import error403 from '@/assets/images/error-page/403.svg'
import error500 from '@/assets/images/error-page/500.svg'
import dev from '@/assets/images/error-page/dev.png'
const config = {
  403: {
    img: error403,
    title: '403',
    desc: 'I am Very Sorry，你无权访问该页面'
  },
  404: {
    img: error404,
    title: '404',
    desc: 'I am Very Sorry，页面不存在,程序猿小哥哥正加紧开发中..'
  },
  500: {
    img: error500,
    title: '500',
    desc: 'I am Very Sorry，服务器出错了o(╥﹏╥)o'
  },
  'dev': {
    img: dev,
    title: '开发中',
    desc: 'I am Very Sorry，程序猿小哥哥正加紧开发中。。。'
  },
  'welcome': {
    img: error500,
    title: '欢迎访问',
    desc: 'SmartKettle调度监控平台'
  }
}

export default config
