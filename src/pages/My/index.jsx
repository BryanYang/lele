import React from "react";
import { List, NavBar, Toast } from "antd-mobile";
import { connect } from "react-redux";
import { Switch, Route, Link } from "react-router-dom";

import MySet from "./set";
import Log from "./log";
import GiveScore from './giveScore';
import AccessScore from './accessScore';
import Password2 from './password2';
import Password from './password';
import MyProfile from './profile';


const userController = require("@apis/controller")("user");

const Item = List.Item;
const Brief = Item.Brief;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userVo: {}
    };
  }

  componentDidMount() {
    userController("myprofile").then(({ code, data, msg }) => {
      if (code === 0 && data.userVo) {
        this.setState({
          userVo: data.userVo
        });
      } else {
        Toast.info(msg);
      }
    });
  }

  render() {
    const userVo = this.state.userVo;
    return (
      <div className="set-home">
        <NavBar mode="dark">我</NavBar>
        <List className="profile" id="profile">
          <Item
            arrow="horizontal"
            thumb={userVo.icon || 'http://happyeveryone.oss-cn-shanghai.aliyuncs.com/35_3e4f3b77e4b3458eb1efd5b53b74695b.png'}
            multipleLine
            onClick={() => {this.props.history.push('./my/profile')}}
          >
            <div>{userVo.nickname || ""}</div>
            <div className="uid">ID {userVo.uniqueId || ""}</div>
            <Brief>
              <span className="score">身上 {userVo.gameScore}</span>
            </Brief>
          </Item>
        </List>
        <List className="my-list">
          <Item
            arrow="horizontal"
            thumb={require("@assets/png/safebox@3x.png")}
          >
            <Link to="/my/accessScore">
              <div>保险箱存取</div>
            </Link>
          </Item>
          <Item
            arrow="horizontal"
            thumb={require("@assets/png/exchange_point@3x.png")}
          >
            <Link to="/my/giveScore">
              <div>转分给他人</div>
            </Link>
          </Item>
          <Item arrow="horizontal" thumb={require("@assets/png/record@3x.png")}>
            <Link to="/my/log">
              <div>操作记录</div>
            </Link>
          </Item>
        </List>

        <List className="my-list2">
          <Item
            arrow="horizontal"
            thumb={require("@assets/png/setting@3x.png")}
            className=""
          >
            <Link to="/my/set">
              <div>设置</div>
            </Link>
          </Item>
        </List>
      </div>
    );
  }
}

const My = props => (
  <Switch>
    <Route path="/my/profile" exact component={MyProfile} {...props} />
    <Route path="/my/set" exact component={MySet} {...props} />
    <Route path="/my/set/password2"  component={Password2} {...props} />
    <Route path="/my/set/password"  component={Password} {...props} />
    <Route path="/my/log" exact component={Log} {...props} />
    <Route path="/my/giveScore" exact component={GiveScore} {...props} />
    <Route path="/my/accessScore" exact component={AccessScore} {...props} />
    <Route exact component={Home} />
  </Switch>
);

export default connect(({}) => ({}), dispatch => ({}))(My);
