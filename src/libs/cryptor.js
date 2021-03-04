import sm3 from "./sm3";
import md5 from "./md5";
let cryptor = {};
cryptor.genSalt = function(s){
    return s + "{1#2$3%4(5)6@7!poeeww$3%4(5)djjkkldss}";
};
cryptor.sm3 = function (s,add) {
    if(add){
        return sm3(cryptor.genSalt(s));
    }
    return sm3(s);
};
cryptor.md5 = function (s,add) {
    if(add){
        return md5.MD5(cryptor.genSalt(s));
    }
    return md5.MD5(s);
};
cryptor.encrypt = function (s,method,add) {
    let result = '';
    if(!method){
        method = 'md5';
    }
    if(method == 'md5'){
        result = cryptor.md5(s,add);
    }else{
        result = cryptor.sm3(s,add);
    }
    return result;
};

export default cryptor;