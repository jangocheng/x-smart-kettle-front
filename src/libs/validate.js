import util from '@/libs/util.js';
import config from '@/config/config';
// 验证是否是[0-1]的小数
const isInteger = (rule, value, callback)=> {
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'));
    } else {
      const re = /^[0-9]*[1-9][0-9]*$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入正整数'));
      } else {
        callback();
      }
    }
  }, 0);
}

const isOneToNinetyNine =(rule, value, callback) =>{

  if(value){
    setTimeout(() => {
      if (!Number(value)) {
        callback(new Error('请输入正整数'));
      } else {
        const re = /^[1-9][0-9]{0,1}$/;
        const rsCheck = re.test(value);
        if (!rsCheck) {
          callback(new Error('请输入正整数，值为【1,99】'));
        } else {
          callback();
        }
      }
    }, 0);
  }else{
    callback();
  }

}

//行政编码校验
const checkMax900000 =  (rule, value, callback)=> {
  if (value == '' || value == undefined || value == null) {
    callback();
  } else if (!Number(value)) {
    callback(new Error('请输入合法的行政编码'));
  } else if (value < 100000 || value > 900000) {
    callback(new Error('请输入合法的行政编码'));
  } else {
    callback();
  }
}

//校验是否合法字符
const isValidCode = (rule, value, callback) =>{
  const reg =/^[a-zA-Z0-9]+$/;
  if(value==''||value==undefined||value==null){
    callback(new Error('不能为空'));
  } else {
    if (!reg.test(value)){
      callback(new Error('仅由英文字母、数字组成'));
    }else{
      callback();
    }
  }
}


//校验应用编码的唯一性
const checkAppCode = (rule, value, callback) =>{
  if(value==''||value==undefined||value==null){
    callback(new Error('不能为空'));
  } else {

    util.ajax.get(config.acServerContext+"/manage/acApp/checkCode", {
      params: {
        appCode:value
      }
    }).then(function(resp){
      var result = resp.data.data;
      if(result && result.appCode != '' && result !='null'){
        callback(new Error('该应用编码已存在，请重新输入'));
      }else{
        callback();
      }
    }).catch(function(err) {
      callback(new Error('应用编码校验异常'));
    });
  }
}

export default {
  isInteger,
  isOneToNinetyNine,
  checkMax900000,
  isValidCode,
   checkAppCode
 }

