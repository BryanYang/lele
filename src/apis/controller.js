
import fetch from '../fetch';
import qs from 'qs';
const isStr = str => Object.prototype.toString.call(str.__proto__) == '[object String]';
const isObj = obj => Object.prototype.toString.call(obj.__proto__) == '[object Object]';


const controller = controller => (method, params, m = 'get') => {
    let param = params;
    if(params && isStr(params)) {
        m = params;
        params = null;
    } else {
        if(m === 'get' && params){
            param = {
                params,
            }
        }
    }
    // Using application/x-www-form-urlencoded format
    if(m === 'post' && isObj(param)){
        param = qs.stringify(param);
    }
    const path = `http://118.24.151.146/app/v1/${controller}/${method}`;
    return fetch[m](path, param).then(({data: res}) => res);
  }
  
/**
 * var userController = controller('user');
 * userController('', {})
 * userController('', 'post')
 * 
*/


  export default controller;