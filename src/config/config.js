let serverContext = '';

var millisecond = new Date().getTime();
var expiresTime = new Date(millisecond + 60 * 1000 * 30);

let config = {
   /**
   * @description 配置显示在浏览器标签的title
   */
  title: 'Smart Kettle 调度监控平台',
  /**
   * @description 前端项目上下文
   */
  serverContext: serverContext,

  baseUrl: {
    dev: 'http://localhost:8080/kettle-admin/',
    pro: 'http://localhost:8009/'
  },

  TOKEN_KEY: "token",

  /**
   * @description token在Cookie中存储的天数，默认30分钟
   */
  cookieExpires: expiresTime,

  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: true,

  /**
   * @description 登陆页
   */
  loginPage: 'login',
  /**
   * @description 首页
   */
  homeName: 'home',
  /**
   * @description auth-server
   */
  xtlServerContext: "/xtl-server",

  /**
   * @description 请求错误文案
   */
  errorMessage: "数据请求出错，请稍后尝试",
  /**
   * @description 应用编码
   */
  appIds: ["1323163066727596032", "1328143318591418368", "1329619177507508224", "1331421234272694272"]

};

export default config;
