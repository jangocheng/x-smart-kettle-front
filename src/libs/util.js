import axios from 'axios';
import ai from './interceptors';
import config from '@/config/config';
import wrapper from 'axios-cache-plugin';
import cacherules from '../config/cacheconf';

var qs = require('qs');

var util = {};
util.title = function (title) {
    title = title || 'Xtl';
    window.document.title = title;
};
let instance = axios.create();

instance.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'
 instance.interceptors.request.use(ai.requestInterceptors, ai.requestError);
instance.interceptors.response.use(ai.responseInterceptors, ai.responseError);

// axios-cache-plugin 以下请求结果将被缓存，刷新浏览器清空缓存
util.ajax = wrapper(instance, {
    maxCacheSize: 15
});

// 替换掉原有的util.ajax.post
const oldPost = axios.Axios.prototype.post;
// payload:  使用 request payload 不使用form data
util.ajax.post = (url, data, payload=false, config={}) => {
  data = {
    payload, data
  }
  return oldPost.call(instance, url, data, config);
};

for (let rule of cacherules) {
    util.ajax.__addFilter(rule);
}

util.clearCache = function () {
    util.ajax.__cacher.cacheMap.clear()
    sessionStorage.clear()
}

util.params = function (obj) {
    return qs.stringify(obj);
};
util.isJson = function (arg) {
    return typeof(arg) == "object" && Object.prototype.toString.call(arg).toLowerCase() == "[object object]" && !arg.length
};
/**
 * 保留小数位数
 * @type {AxiosInstance}
 */
util.toFixed = function (n, s) {
    if (s > 6) {
        s = 6;
    }
    var changenum;
    if (n > 0) {
        changenum = (parseInt(n * Math.pow(10, s) + 0.5) / Math.pow(10, s)).toString();
    } else {
        changenum = (parseInt(n * Math.pow(10, s) - 0.5) / Math.pow(10, s)).toString();
    }

    var index = changenum.indexOf(".");
    if (index < 0 && s > 0) {
        changenum = changenum + ".";
        for (var i = 0; i < s; i++) {
            changenum = changenum + "0";
        }
    } else {
        index = changenum.length - index;
        for (var i = 0; i < (s - index) + 1; i++) {
            changenum = changenum + "0";
        }
    }
    return changenum;
};
/**
 * 判断对象类型
 * @param object
 */
util.typeOf = function (obj) {
    var toString = Object.prototype.toString;
    var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    return map[toString.call(obj)];
};
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
/**
 * 校验电话号码是否正确
 *
 */
util.checkTel = function (val) {

    var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
    var isMob = /^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|14[57][0-9]{8}|17[678][0-9]{8})$/;

    if (isMob.test(val) || isPhone.test(val)) {
        return true;
    } else {
        return false;
    }
};
/**
 * @return {string}
 */
util.numToDX = function DX(n) {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
        return "数据非法";
    let unit = "千百拾亿千百拾万千百拾元角分", str = "";
    n += "00";
    let p = n.indexOf('.');
    if (p >= 0)
        n = n.substring(0, p) + n.substr(p + 1, 2);
    unit = unit.substr(unit.length - n.length);
    for (let i = 0; i < n.length; i++)
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
    return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
};

util.routeEqual = function (route1, route2) {
    /*const params1 = route1.params || {}
    const params2 = route2.params || {}
    const query1 = route1.query || {}
    const query2 = route2.query || {}*/
    return (route1.name === route2.name)
}

function objEqual(obj1, obj2) {
    const keysArr1 = Object.keys(obj1)
    const keysArr2 = Object.keys(obj2)
    if (keysArr1.length !== keysArr2.length) return false
    else if (keysArr1.length === 0 && keysArr2.length === 0) return true
    /* eslint-disable-next-line */
    else return !keysArr1.some(key => obj1[key] != obj2[key])
}

util.getNextRoute = (list, route) => {
    let next = {};
    if (list.length === 2) {
        next = util.homeRoute;
    } else {
        const index = list.findIndex(item => util.routeEqual(item, route));
        if (index === list.length - 1) {
            next = list[list.length - 2];
        }
        else next = list[index + 1];
    }
    return next;
};
util.getChangeTableDatas = (oldData, newData) => {
    let list = []
    var i = 0;
    for (i = 0; i < newData.length; i++) {
        if (oldData[i].checked != newData[i].checked) {
            var tmpData = {
              "id": newData[i].id,
              "checked": newData[i].checked
            }
            if(newData[i].dpType){
               tmpData.dpType = newData[i].dpType
            }
            list.push(tmpData);
        }
        if (newData[i].children) {
            list = list.concat(util.getChangeTableDatas(oldData[i].children, newData[i].children))
        }
    }
    return list
}

util.toChies = (values) => {
    //形参
    let len = values.length //统计出长度
    let arr = []

    let chin_list = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'] //所有的数值对应的汉字

    let chin_lisp = [
        '仟',
        '佰',
        '拾',
        '亿',
        '仟',
        '佰',
        '拾',
        '万',
        '仟',
        '佰',
        '拾'
    ] //进制

    for (let i = 0; i < len; i++) {
        arr.push(parseInt(values[i])) //输入的数据按下标存进去   存进去的只是数字
        arr[i] = chin_list[arr[i]] //是根据我们输入的输入的数字，对应着我们的chin_list这个数组
    } //123['壹','佰','贰','拾','叁']

    for (let i = len - 1, j = 1; i > 0; i--) {
        //i =2	1		//倒序		为了添加进制，方便我们去观看
        arr.splice(i, 0, chin_lisp[chin_lisp.length - j++]) //j=2
    }
    arr = arr.join('')
    if (len >= 1) {
        arr += '元整'
    }
    return arr
};
//用于处理 dict 转 map
util.dictToMap = function (dict) {
    let map = {};
    for (let item of dict) {
        map[item.K] = item.V;
    }
    return map;
};
// 数字每三位加逗号
util.toThousands = function (num) {
    var num = (num || 0).toString(), result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return result;
}
// 取年
util.getFullYear = function (str) {
    if (str == null) {
        return new Date().getFullYear();
    }
    return str.replace(/(\d{4})(\d{2})(\d{2})/g, '$1');
}
// 取月
util.getMonth = function (str) {
    if (str == null) {
        return new Date().getMonth();
    }
    return str.replace(/(\d{4})(\d{2})(\d{2})/g, '$2');
}

//昨天的时间
util.getYesteraday=function(){
  let day1 = new Date();
  day1.setTime(day1.getTime()-24*60*60*1000);
  /*let s1 = day1.getFullYear()+ (day1.getMonth()+1) + day1.getDate();
  console.log("s1:" + s1)*/
  return day1
}


//时间工具
util.formatDate=function(date) {
  let d = date;
  let curr_date = d.getDate();
  let curr_month = d.getMonth() + 1;
  let curr_year = d.getFullYear();
  String(curr_month).length < 2 ? (curr_month = "0" + curr_month) : curr_month;
  String(curr_date).length < 2 ? (curr_date = "0" + curr_date) : curr_date;
  return curr_year + "-" + curr_month + "-" + curr_date;
},

util.getBeforeOrNxtDay=function(day) {
  let date = new Date();
  return new Date(date.getTime() + day * 1000 * 60 * 60 * 24);
},

// 取日
util.getDate = function (str) {
    if (str == null) {
        return new Date().getDate();
    }
    return str.replace(/(\d{4})(\d{2})(\d{2})/g, '$3');
}

util.getToday = function () {
    return util.getFullYear() + "" + util.getMonth() + "" + util.getDate()
}

// 取时
util.getHours = function (str) {
    if (str == null) {
        return new Date().getHours();
    }
    return str.replace(/(\d{2})\:(\d{2})\:(\d{2})/g, '$1');
}

// 取分
util.getMinutes = function (str) {
    if (str == null) {
        return new Date().getMinutes();
    }
    return str.replace(/(\d{2})\:(\d{2})\:(\d{2})/g, '$2');
}
util.getRoutesNode = function (routes, nodeName) {

    for (var item of routes) {
        if (item.name == nodeName) {
            return item
        }
        if (item.hasOwnProperty('children')) {
            let result = util.getRoutesNode(item.children, nodeName)
            if (result) {
                return result
            }
        }
    }
};

util.formatterSizeUnit = function (size) {
    if (size) {
        var result = parseInt(size);
        if (result < 1024) {
            return result + " B";
        } else if (result < 1024 * 1024) {
            return parseInt(result / 1024) + " KB";
        } else if (result < 1024 * 1024 * 1024) {
            return parseInt(result / (1024 * 1024)) + " MB";
        } else {
            return parseInt(result / (1024 * 1024 * 1024)) + " GB";
        }
    }
};

export default util;
