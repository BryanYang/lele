import React from 'react';
import { InputItem, NavBar, Icon, Button, Toast} from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from "react-redux"
import axios from 'axios';
import qs from 'qs';
import Cookies from 'js-cookie';
import LoginActions from "@/redux/LoginRedux"

import './index.scss';

const userController = require('@apis/controller')('user');

class Login extends React.PureComponent {

  constructor(props){
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit(){
    this.props.form.validateFields((error, value) => {
      if(error){
      } else {
        value.phoneModel='web';
        axios.post('/app/v1/user/login', qs.stringify(value)).then(({data: res}) => {
          if(res.code === 0 && res.data && res.data.userVo){
            Cookies.set('token', res.data.userVo.token, { expires: 7 });
            // 登录成功后，登录环信
            userController('myprofile').then(({ data }) => {
              // this.props.doLogin(data.userVo.imusername, data.userVo.impassword)
              // Cookies.set('imusername', data.userVo.imusername, { expires: 7 }); 
              Cookies.set('imusername', 'mengyuanyuan', { expires: 7 });  
              this.props.doLogin('mengyuanyuan', '123456') 
            })
          } else {
            Toast.info(res.msg);
          } 
        }) 
      }
      
    });
  }

  render(){
    const { getFieldProps, getFieldError } = this.props.form;
    return <div className="register">
      <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.goBack()
          }}
      >登录</NavBar>
      <form id="register">
        <InputItem
          {...getFieldProps('username', {
            rules: [{required: true}]
          })}
          clear
          placeholder="请输入用户名"
        >用户名</InputItem>
        <InputItem
          {...getFieldProps('password', {
            rules: [{required: true}]
          })}
          clear
          type="password"
          placeholder="请输入密码"
        >密码</InputItem>
        <Button type="warning" className="submit" onClick={this.submit}>登录</Button>
      </form>
    </div>
  }
}

export default connect(
  ({ login, i18n }) => ({
      I18N: (i18n.locale && i18n.translations && i18n.translations[i18n.locale]) || {},
      login: {
          loginLoading: false
      }
  }),
  dispatch => ({
      doLogin: (username, password) => dispatch(LoginActions.login(username, password)),
      doLoginByToken: (username, token) => dispatch(LoginActions.loginByToken(username, token)),
      jumpRegister: () => dispatch(LoginActions.jumpRegister())
  })
)(createForm()(Login));