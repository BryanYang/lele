import React from 'react';
import { InputItem, NavBar, Icon, Button, Toast} from 'antd-mobile';
import { createForm } from 'rc-form';
import './index.scss';
import fetch from '@/fetch';
import qs from 'qs';

class Register extends React.PureComponent {

  constructor(props){
    super(props);
    console.log(props)
    this.submit = this.submit.bind(this);
    this.state = {
      hasError: {},
    }
    this.interval = '';
  }

  submit(){
    this.props.form.validateFields((error, value) => {
      if(error){
        console.log(error);
        this.setState({hasError: error});
        Toast.info('请正确填写');
        this.interval =  setInterval(() => {
          this.props.form.validateFields((error, value) => {
            this.setState({hasError: error || {} });
          }) 
        }, 1000)
      } else {
        this.interval && clearInterval(this.interval);
        value.phoneModel='web';
        fetch.post('/app/v1/user/register', qs.stringify(value)).then(({data: res}) => {
          if(res.code !== 0){
            Toast.info(res.msg)
          } else {
            Toast.info('注册成功, 请登录');
            setTimeout(() => {
              this.props.history.replace('/login');
            }, 3000) 
          }
        })
      }
    });
  }

  onErrorClick(msg) {
    return () => {
      Toast.info(msg);
    }
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
      >注册</NavBar>
      <form id="register">
        <InputItem
          {...getFieldProps('username', {
            rules: [{required: true, pattern: /^[a-zA-Z0-9]+$/}]
          })}
          clear
          error={this.state.hasError.username}
          onErrorClick={this.onErrorClick('用户名由字母和数字组合，区分大小写')}
          placeholder="字母和数字组合，区分大小写"
        >用户名</InputItem>
        <InputItem
          {...getFieldProps('nickname', {
            rules: [{required: true, pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,12}$/}]
          })}
          clear
          error={this.state.hasError.nickname}
          onErrorClick={this.onErrorClick('昵称由中文字母和数字组合，不超过12个字符')}
          placeholder="中文字母和数字组合，不超过12个字符"
        >昵称</InputItem>
        <InputItem
          {...getFieldProps('password', {
            rules: [{required: true, pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,32}$/}]
          })}
          clear
          error={this.state.hasError.password}
          onErrorClick={this.onErrorClick('密码由6-32位字母和数字组合而成')}
          type="password"
          placeholder="6-32位字母和数字组合"
        >密码</InputItem>
        <InputItem
          {...getFieldProps('inviteCode', {
            rules: [{required: true}]
          })}
          clear
          error={this.state.hasError.inviteCode}
          onErrorClick={this.onErrorClick('请输入邀请码')}
          placeholder="请输入邀请码"
        >邀请码</InputItem>
        <Button type="warning" className="submit" onClick={this.submit}>完成注册</Button>
        <p className="agreement">注册代表你已同意 <a href="/">注册协议</a> 和 <a href="/">隐私条款</a></p>
      </form>
    </div>
  }
}

export default createForm()(Register);