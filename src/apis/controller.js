
import fetch from '../fetch';
const isStr = str => Object.prototype.toString.call(str.__proto__) == '[object String]';

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

    const path = `/app/v1/${controller}/${method}`;
    return fetch[m](path, param).then(({data: res}) => res);
  }
  
/**
 * var userController = controller('user');
 * userController('', {})
 * userController('', 'post')
 * 
*/


  export default controller;