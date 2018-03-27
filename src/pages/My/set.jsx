
import React from 'react';
import { List, NavBar, Icon } from 'antd-mobile';
import { connect } from "react-redux"
import Cookies from 'js-cookie'
import LoginActions from "@redux/LoginRedux"
import CommonActions from "@redux/CommonRedux"
import LayoutActions from '@/redux/LayoutRedux';
import WebIM from "@/easemob/WebIM"
import "./index.scss";


const Item = List.Item;

class Com extends React.Component {

  constructor(props){
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    Cookies.remove('token');
    this.props.doLogout();
    // this.props.history.push('/');
  }

  render() {
    return (<div className="set-container">
      <NavBar
        mode="dark"
        icon={<Icon type="left" />}
        onLeftClick={() => {
          this.props.history.push('/my')
        }}
      >设置</NavBar>
      <div className="">
        <List className="set-list">
            <Item arrow="horizontal" >修改登录密码</Item> 
            <Item arrow="horizontal" >隐私设置</Item> 
            <Item arrow="horizontal" >关于我们</Item> 
            <Item arrow="horizontal" >分享</Item>
        </List>
        <br />
        <br />
        <div className="logout border-tp border-bt" onClick={this.logout} >退出账号</div>
      </div>
    </div>)
  }
  
}

export default connect(
  ({layout}) => ({
    layout,
  }),
  dispatch => ({
    doLogout: () => {
      dispatch(CommonActions.fetching())
      dispatch(LoginActions.logout())
      if (WebIM.conn.isOpened()) {
          console.log('logout');
          WebIM.conn.close("logout")
      }
    },
    hiddenTab: () => {
      dispatch(LayoutActions.hiddenTab())
    }
  })
)(Com)
