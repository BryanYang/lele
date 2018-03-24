import React from 'react';
import { InputItem, NavBar, Icon, Button} from 'antd-mobile';
import { createForm } from 'rc-form';
import './index.scss';

class Register extends React.PureComponent {

  constructor(props){
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit(){
    this.props.form.validateFields((error, value) => {
      console.log(error, value);
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
      >注册</NavBar>
      <form id="register">
        <InputItem
          {...getFieldProps('username', {
            rules: [{required: true, pattern: /^[a-zA-Z0-9]+$/}]
          })}
          clear
          placeholder="字母和数字组合，区分大小写"
        >用户名</InputItem>
        <InputItem
          {...getFieldProps('nickname', {
            rules: [{required: true, pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,12}$/}]
          })}
          clear
          placeholder="中文字母和数字组合，不超过12个字符"
        >昵称</InputItem>
        <InputItem
          {...getFieldProps('password', {
            rules: [{required: true, pattern: /^[a-zA-Z0-9]{6,32}$/}]
          })}
          clear
          placeholder="6-32位字母和数字组合"
        >密码</InputItem>
        <InputItem
          {...getFieldProps('inviteCode', {
            rules: [{required: true}]
          })}
          clear
          placeholder="请输入邀请码"
        >邀请码</InputItem>
        <Button type="warning" className="submit" onClick={this.submit}>完成注册</Button>
        <p className="agreement">注册代表你已同意 <a href="/">注册协议</a> 和 <a href="/">隐私条款</a></p>
      </form>
    </div>
  }
}

export default createForm()(Register);