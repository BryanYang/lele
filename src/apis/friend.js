import fetch from '../fetch';

const friendList = () => fetch('/app/v1/user/friendList').then( ({data: res}) => {
  if(res.code === 0 && res.data){
    return res.data.userVos;
  }
})


export default {
  friendList, 
}