import React from 'react';
import { NavBar, Icon, List, Button, SwipeAction, Toast } from 'antd-mobile';
import { withRouter, Route } from 'react-router-dom';
import MessageActions from "@/redux/MessageRedux";
import { connect } from "react-redux";
import './index.scss';

import ContactsScreenRedux from "@/redux/ContactsScreenRedux";
const userController = require("@apis/controller")("user");
const Item = List.Item;
class GroupList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupList: [],
    };
    this.toChat = this.toChat.bind(this);
  }

  componentDidMount(){
    this.load();
  }

  load(){
    userController("getGroups").then(res => {
      if(res.code === 0 ){
        this.setState({
          groupList: res.data.groupVos,
        })
      } else {
        Toast.info(res.msg);
      }
    })
  }

  toChat(item) {
    const { history, location, group } = this.props;
    // 清除未读
    this.props.clearUnread("groupchat", item.groupid);
    history.push(`/chat/${item.groupid}?name=${item.groupname}`);
  }

  delete(id) {
    userController("exitGroup", { groupid: id }, "post").then(res => {
      if(res.code === 0 ){
        this.load();
      } else {
        Toast.info(res.msg);
      }
    });
  }
  render(){
    const {groupList} = this.state;
    return  <div id="grouplist">
      <NavBar
        mode="dark"
        icon={<Icon type="left" />}
        onLeftClick={() => {
          this.props.history.goBack();
        }}
      >群聊列表</NavBar>
      <List>
        {groupList.map(item => (
          <SwipeAction
          style={{ backgroundColor: "gray" }}
          autoClose
          key={item.groupid}
          right={[
            {
              text: "退出",
              onPress: () => this.delete(item.groupid),
              style: { backgroundColor: "#F4333C", color: "white" }
            }
            ]}
          >
            <Item
              multipleLine
              onClick={() => {
                this.toChat(item);
              }}
              thumb={
                item.icon ||
                "http://happyeveryone.oss-cn-shanghai.aliyuncs.com/35_3e4f3b77e4b3458eb1efd5b53b74695b.png"
              }
            >
              {item.groupname}
            </Item>
          </SwipeAction>
        ))}
      </List>
    </div>
  }
}


export default withRouter(
  connect(
    ({ contacts }, props) => ({
      contacts
    }),
    dispatch => ({
      applyPass:(id) => {
        dispatch(ContactsScreenRedux.applyPass(id))
      },
      clearUnread: (chatType, id) => dispatch(MessageActions.clearUnread(chatType, id))
    })
  )(GroupList)
)