import React from "react";
import { NavBar, Icon, InputItem, Button, Modal, Toast } from "antd-mobile";
import "./index.scss";

const userController = require("@apis/controller")("user");

export default class Password extends React.Component {
  constructor(props) {
    super(props);
    this.userVo = {};
    this.submit = this.submit.bind(this);
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
    if (this.newpwd !== this.newpwd2) {
      Toast.info("两次输入的密码不一致");
      return;
    }
    userController(
      "updatepwd",
      {
        oldpwd: this.oldpwd,
        newpwd: this.newpwd,
        phoneModel: "web"
      },
      "post"
    ).then(({ code, msg }) => {
      if (code !== 0) {
        Toast.info(msg);
      } else {
        Toast.info("更改成功");
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
          更改密码
        </NavBar>
        <div>
          <InputItem
            type="password"
            placeholder=""
            onChange={v => (this.oldpwd = v)}
          >
            原密码
          </InputItem>

          <br />
          <InputItem
            type="password"
            placeholder=""
            onChange={v => (this.newpwd = v)}
          >
            新密码
          </InputItem>
          <InputItem
            type="password"
            placeholder="请输入6位数字"
            onChange={v => (this.newpwd2 = v)}
          >
            再次输入
          </InputItem>
          <Button onClick={this.submit} className="submit">
            确认修改
          </Button>
        </div>
      </div>
    );
  }
}
