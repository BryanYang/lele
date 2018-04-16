import React from "react";
import {
  NavBar,
  Icon,
  InputItem,
  Button,
  Modal,
  Toast
} from "antd-mobile";
import "./giveScore.scss";

const prompt = Modal.prompt;
const alert = Modal.alert;

const userController = require("@apis/controller")("user");
const icon = require("@assets/png/dating_safebox@3x.png");

export default class GiveScore extends React.Component {
  constructor(props) {
    super(props);
    this.userUnique = "";
    this.score = "";
    this.safePwd = "";
    this.userVo = {};
    this.confirm = this.confirm.bind(this);
  }

  componentDidMount() {
    userController("myprofile").then(({ code, data, msg }) => {
      if (code === 0 && data.userVo) {
        this.userVo = data.userVo;
        if(!this.userVo.issafePwd){
          alert('提示', '你还未设置二级密码，无法转出', [
            { text: '取消', onPress: () => this.props.history.goBack()},
            { text: '去设置', onPress: () => this.props.history.push('/my/set') },
          ])
        }
      } else {
        Toast.info(msg);
      }
    });
  }

  send(pw) {
    userController(
      "giveScore",
      {
        score: this.score,
        safePwd: pw,
        userUnique: this.userUnique,
        phoneModel: "web"
      },
      "post"
    ).then(({ code, msg }) => {
      if (code !== 0) {
        Toast.info(msg.replace('二级', ''));
      } else{
        Toast.info('操作成功');
      }
    });
  }

  confirm() {
    prompt(
      "请输入二级密码",
      <div>
        <div>转入至ID: {this.userUnique}</div>
        <div style={{ marginTop: 10 }}>
          <img style={{ width: 30, marginRight: 10 }} src={icon} alt="数额" />
          <span>{this.score}</span>
        </div>
      </div>,
      password => this.send(password),
      "secure-text"
    );
  }

  render() {
    return (
      <div className="giveScore">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.goBack();
          }}
        >
          转分给他人
        </NavBar>
        <InputItem
          placeholder="请输入对方ID"
          type="number"
          onChange={v => (this.userUnique = v)}
          clear
        >
          对方ID
        </InputItem>
        <InputItem
          className="score"
          placeholder="请输入数额"
          type="number"
          onChange={v => (this.score = v)}
          clear
        >
          <img src={icon} alt="数额" />
        </InputItem>
        <br />
        <Button className="submit-btn" type="warning" onClick={this.confirm}>
          确认转分
        </Button>
      </div>
    );
  }
}
