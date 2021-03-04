import store from '@/store'
import cacherules from "../config/cacheconf";
import router from '@/router';
import util from "@/libs/util";

var qs = require('qs');
var timer1, timer2;

function requestInterceptors(config) {
  let token = sessionStorage.getItem("token");
  if (token) {
    config.headers['Authorization']='Bearer'+token;
    config.headers.token = token;
  }
  if (config.method === 'post') {
    let payload = config.data.payload;
    config.data = config.data.data;
    if(!payload){
      config.headers['Content-Type'] = "application/json"
      config.data = JSON.stringify(config.data);
    }
  } else if (config.method === 'get') {
    for (let rule of cacherules) {
      if (rule.test(config.url)) {
        return config;
      }
    }
    if (config.url.indexOf('?') === -1) {
      config.url = config.url + "?t=" + new Date().getTime();
    } else {
      config.url = config.url + "&t=" + new Date().getTime();
    }
  }
  //启动调用链跟踪
  if (window.tracing || sessionStorage.getItem("tracing")) {
    if (config.url.indexOf('?') === -1) {
      config.url = config.url + "?debug=true";
    } else {
      config.url = config.url + "&debug=true";
    }
    if(sessionStorage.getItem("tracingId")){
      config.url = config.url+"&tracingId="+sessionStorage.tracingId;
    }
    sessionStorage.setItem("tracing","true");
    setTimeout(function () {
      window.tracing = false;
      sessionStorage.removeItem("tracing");
      console.log("调用链跟踪已关闭")
    }, 20000)
  }
  return config;
}

function requestError(error) {
  console.error("服务器内部异常,请稍候再试");
  return Promise.reject(error);
}

function responseInterceptors(response) {
  var data = response.data;
  if (data instanceof Object) {
    var code = data["code"];
    if (code == "10106") {
      clearTimeout(timer1);
      timer1 = setTimeout(function () {
        if (confirm("会话已失效，是否重新登录")) {
          util.clearCache()
          store.dispatch("clearStore")
          router.push({name: "登录页"});
        }
      }, 500)
    }
  }
  return response;
}

function responseError(error) {
  clearTimeout(timer2);
  timer2 = setTimeout(function () {
    console.error("服务器内部异常,请稍候再试");
  }, 500)
  return Promise.reject(error);
}

function browserDetection() {
  let ua = navigator.userAgent;
  if (ua.match(/Chrome/i)) {
    return true
  } else if (ua.match(/Firefox/i)) {
    return {ok:true}
  } else if (ua.match(/Edge/i)) {
    return {ok:true}
  }else if(ua.match(/Safari/i)){
    return {ok:true}
  }
  else if(ua.match(/MSIE/i)){
    let errorInfo = "<div>您的浏览器暂不支持，建议下载 <a target='view_window' href='https://www.google.cn/chrome'>Chrome</a> 查看该网站</div>"
    return  {ok:false,errorInfo:errorInfo}
  }else if(ua.match(/Trident/i)){
    let errorInfo = "<div>您的浏览器暂不支持，建议下载 <a target='view_window' href='https://www.google.cn/chrome'>Chrome</a> 查看该网站</div>"
    return  {ok:false,errorInfo:errorInfo}
  }
  else {
    let errorInfo = "<div>您的浏览器体验效果不佳，建议下载 <a target='view_window' href='https://www.google.cn/chrome/'>Chrome</a> 查看该网站</div>"
    return  {ok:false,errorInfo:errorInfo}
  }
}

export default {
  requestInterceptors: requestInterceptors,
  responseInterceptors: responseInterceptors,
  requestError: requestError,
  responseError: responseError,
  browserDetection
}
