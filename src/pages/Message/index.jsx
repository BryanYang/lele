import React from 'react';
import { Icon, NavBar, InputItem, Grid, List, Badge } from 'antd-mobile';
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import fetch from '../../fetch';
import WebIM from "@easemob/WebIM";
import utils from "@/utils"
import MessageActions from "@/redux/MessageRedux"
import _ from 'lodash';
// import 'antd-mobile/lib/grid/style/index.css';
import './index.scss';
import getCurrentContacts from "@/selectors/ContactSelector"

const userController = require('@apis/controller')('user');
const Item = List.Item;
const Brief = Item.Brief;


const chatTypes = {
  "contact": "chat",
  "group": "groupchat",
  "chatroom": "chatroom",
  "stranger": "stranger"
}

class Message extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
    }
    this.toChat = this.toChat.bind(this);
  }

  componentDidMount(){
    fetch.get('/app/v1/msg', {
      params: {page: 1, count: 10}
    }).then(({data: res}) => {
      if(res.code === 0 && res.data.msgVos) {
        this.setState({
          data: res.data.msgVos
        })
      }
    });
  }

  toChat(msg, e){
    console.log("changeItem", e)
    const { history, location, group } = this.props
    // 清除未读
    this.props.clearUnread('chat', msg.name)
    
    history.push(`/chat/${msg.name}`);
  }

  render(){
    const { contacts, blacklist, message } = this.props;
    const items = [];
    _.forEach(_.get(contacts, "friends", []), (name, index) => {
      if (_.includes(blacklist.names, name)) return
      const info = utils.getLatestMessage(_.get(message, [ chatTypes['contact'], name ], []))
      const count = message.getIn([ "unread", "chat", name ], 0)
      items[index] = {
          name,
          unread: count,
          ...info
      }
    
    })
    console.log(items)
    return (<div className="message" id="message">
      <NavBar
        mode="dark"
      >消息</NavBar>
      <List className="my-list">
          <Item
            extra={''} 
            align="top" 
            multipleLine>
            新的评论
          </Item>
          <Item 
            extra={''} 
            align="top" 
            multipleLine>
            通知消息
            <Brief>32332</Brief>
          </Item>
        {
          items.map((d, index) => <Item
            key={index}
            onClick={() => {this.toChat(d)}}
            extra={d.latestTime} 
            align="top" 
            thumb={d.icon} multipleLine>
            {d.name}
            <Brief>{d.latestMessage}</Brief>
            <Badge style={{ marginLeft: 10 }} text={d.unread} overflowCount={99} />
          </Item>)
        }
      </List>
    </div>)
  }
}

export default withRouter(
  connect(
      (state, props) => ({
          common: state.common,
          contacts: getCurrentContacts(state, props.match),
          message: state.entities.message,
          blacklist: state.entities.blacklist,
      }),
      dispatch => ({
          clearUnread: (chatType, id) => dispatch(MessageActions.clearUnread(chatType, id)),
          // getGroups: () => dispatch(GroupActions.getGroups()),
          // getChatRooms: () => dispatch(ChatRoomActions.getChatRooms())
      })
  )(Message)
)