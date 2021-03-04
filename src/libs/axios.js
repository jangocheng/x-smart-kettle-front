import axios from 'axios'
import { getToken } from '@/libs/platformUtil'
var qs = require('qs');
let timer1;

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
  }

  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }

  interceptors(instance) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      let token = getToken();//;sessionStorage.getItem("token");
      if (token) {
        config.headers.token = token;
      }
      if (config.method === 'post') {
        config.data = qs.stringify(config.data);
      } else if (config.method === 'get') {
        if (config.url.indexOf('?') === -1) {
          config.url = config.url + "?token="+token+"&t=" + new Date().getTime();
        } else {
          config.url = config.url + "&token="+token+"&t=" + new Date().getTime();
        }
      }
      return config;
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(response => {
      var data = response.data;
      if (data instanceof Object) {
        var code = data["code"];
        let token = getToken();
        if (token == null || token ==='' || token == 'undefined') {
          clearTimeout(timer1);
          timer1 = setTimeout(function () {
            if (confirm("会话已失效，是否重新登录")) {
              router.push({name: "登录页"});
            }
          }, 500)
        }
      }
      return response;
    }, error => {
      return Promise.reject(error)
    })
  }

  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance)
    return instance(options)
  }
}

export default HttpRequest
