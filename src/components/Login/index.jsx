import React from 'react';
import { InputItem, NavBar, Icon, Button, Toast} from 'antd-mobile';
import { createForm } from 'rc-form';
import axios from 'axios';
import qs from 'qs';
import Cookies from 'js-cookie';

import db from '@db/index';
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
            // 拉取好友
            Promise.all([
              userController('friendList').then(res => db.set('friendList', res.data.userVo).write()),
              userController('myprofile').then(res => db.set('user', res.data.userVo).write())
            ]).then(() => {
              window.location.reload();
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

export default createForm()(Login);