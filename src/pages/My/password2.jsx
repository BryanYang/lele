import React from "react";
import { NavBar, Icon, InputItem, Button, Modal, Toast } from "antd-mobile";
import "./index.scss";

const userController = require("@apis/controller")("user");
export default class Password2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      issafePwd: false
    };
    this.userVo = {};
    this.submit = this.submit.bind(this)
  }

  componentDidMount() {
    userController("myprofile").then(({ code, data, msg }) => {
      if (code === 0 && data.userVo) {
        this.userVo = data.userVo;
        this.setState({
          issafePwd: this.userVo.issafePwd
        });
      } else {
        Toast.info(msg);
      }
    });
  }

  submit() {
    if(this.safePwd !== this.safePwd2) {
      Toast.info('两次输入的密码不一致');
      return;
    }
    if(!/\d{6}/.test(this.safePwd)) {
      Toast.info('二级密码必须为6位数字');
      return;
    }
    userController(
      "setSafePwd",
      {
        oldSafePwd: this.oldSafePwd,
        safePwd: this.safePwd,
        opt: this.state.issafePwd ? "update" : "add",
        phoneModel: "web"
      },
      "post"
    ).then(({code, msg}) => {
      if(code !== 0) {
        Toast.info(msg);
      } else {
        Toast.info('更改成功')
      }
    });
  }

  render() {
    return (
      <div className="password" id="password">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.goBack();
          }}
        >
          {this.state.issafePwd ? "更改二级密码" : "设置二级密码"}
        </NavBar>
        <div>
          {this.state.issafePwd ? (
            <InputItem
              type="password"
              placeholder=""
              onChange={v => (this.oldSafePwd = v)}
            >
              原密码
            </InputItem>
          ) : (
            ""
          )}
          <br />
          <InputItem
            type="password"
            placeholder="请输入6位数字"
            onChange={v => (this.safePwd = v)}
          >
            新密码
          </InputItem>
          <InputItem
            type="password"
            placeholder=""
            onChange={v => (this.safePwd2 = v)}
          >
            再次输入
          </InputItem>
          <Button onClick={this.submit} className="submit">确认修改</Button>
        </div>
      </div>
    );
  }
}
