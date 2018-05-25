import React from "react";
import {
  NavBar,
  Icon,
  InputItem,
  Button,
  Modal,
  Toast,
  Tabs
} from "antd-mobile";
import "./accessScore.scss";
import { connect } from "react-redux";
import LayoutActions from "@/redux/LayoutRedux";

const prompt = Modal.prompt;
const alert = Modal.alert;
const tabs = [{ title: "保险箱转到身上分" }, { title: "身上分转到保险箱" }];

const userController = require("@apis/controller")("user");
const icon = require("@assets/png/dating_safebox@3x.png");

class AccessScore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userVo: {},
      s1: "",
      s2: ""
    };

    this.safePwd = "";
    this.current = 0;
    this.confirm = this.confirm.bind(this);
  }

  componentDidMount() {
    this.props.hiddenTab();
    userController("myprofile").then(({ code, data, msg }) => {
      if (code === 0 && data.userVo) {
        this.userVo = data.userVo;
        this.setState({
          userVo: data.userVo
        });
        if (!this.userVo.issafePwd) {
          alert("提示", "你还未设置二级密码，无法转出", [
            { text: "取消", onPress: () => this.props.history.goBack() },
            {
              text: "去设置",
              onPress: () => this.props.history.push("/my/set")
            }
          ]);
        }
      } else {
        Toast.info(msg);
      }
    });
  }
  componentWillUnmount(){
    this.props.showTab();
  }

  send(pw) {
    userController(
      "accessScore",
      {
        score: this.current === 0 ? this.state.s1 : this.state.s2,
        safePwd: pw,
        opt: this.current === 1 ? 'save' : 'get',
        phoneModel: "web"
      },
      "post"
    ).then(({ code, msg }) => {
      if (code !== 0) {
        Toast.info(msg);
      } else {
        Toast.info("操作成功");
        userController("myprofile").then(({ code, data, msg }) => {
          if (code === 0 && data.userVo) {
            this.userVo = data.userVo;
            this.setState({
              userVo: data.userVo
            });
          }
        })
      }
    });
  }

  confirm() {
    prompt(
      "请输入二级密码",
      <div>
        <div>转出到 {this.current === 1 ? "保险箱" : "身上分"}</div>
        <div style={{ marginTop: 10 }}>
          <img style={{ width: 30, marginRight: 10, verticalAlign: 'middle' }} src={icon} alt="数额" />
          <span style={{fontSize: 30, color: '#333', verticalAlign: 'middle'}}>{this.current === 0 ? this.state.s1 : this.state.s2}</span>
        </div>
      </div>,
      password => this.send(password),
      "secure-text"
    );
  }

  render() {
    const { userVo } = this.state;
    return (
      <div className="accessScore">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.goBack();
          }}
        >
          保险箱存取
        </NavBar>
        <div className="score">
          <div className="area">
            <div>身上分</div>
            <div>{userVo.gameScore || 0}</div>
          </div>
          <div className="spliter" />
          <div className="area">
            <div>保险箱</div>
            <div>{userVo.safeScore || 0}</div>
          </div>
        </div>
        <Tabs
          tabBarActiveTextColor="#e73838"
          tabBarUnderlineStyle={{ borderColor: "#e73838" }}
          tabs={tabs}
          onChange={(tab, index) => {
            this.current = index;
          }}
        >
          <InputItem
            className="score-input"
            placeholder={`可转出到身上分${userVo.safeScore || 0}`}
            type="number"
            labelNumber={3}
            onChange={v => {
              this.setState({ s1: v });
            }}
            value={this.state.s1}
            clear
          >
            <img src={icon} alt="数额" />
            <span
              className="all"
              onClick={() => this.setState({ s1: userVo.gameScore })}
            >
              全部转出
            </span>
          </InputItem>
          <InputItem
            className="score-input"
            placeholder={`可转出到保险箱${userVo.gameScore || 0}`}
            type="number"
            labelNumber={3}
            onChange={v => this.setState({ s2: v })}
            value={this.state.s2}
            clear
          >
            <img src={icon} alt="数额" />
            <span
              className="all"
              onClick={() => this.setState({ s2: userVo.safeScore })}
            >
              全部转出
            </span>
          </InputItem>
        </Tabs>
        <br />
        <Button className="submit-btn" type="warning" onClick={this.confirm}>
          确认转出
        </Button>
      </div>
    );
  }
}

export default connect(({}) => ({}), dispatch => ({
  hiddenTab: () => {
    dispatch(LayoutActions.hiddenTab());
  },
  showTab: () => {
    dispatch(LayoutActions.showTab());
  }

}))(AccessScore);
