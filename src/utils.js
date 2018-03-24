import Cookies from 'js-cookie';

export const isLogin = () => {
  return !!Cookies.get('token');
}