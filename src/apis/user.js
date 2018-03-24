import fetch from '../fetch';

const userDetail = (params) => fetch('/app/v1/user/userDetail', { params }).then( ({data: res}) => {
  if(res.code === 0 && res.data){
    return res.data;
  }
})

const myprofile = () => fetch('/app/v1/user/myprofile').then(({data: res}) => {
  if(res.code === 0 && res.data){
    return res.data;
  } 
})



export default {
  userDetail,
}
