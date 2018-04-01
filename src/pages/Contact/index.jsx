import React from "react";
import { SearchBar, List, Badge } from "antd-mobile";
import { connect } from "react-redux";
import { Switch, Route, Link } from 'react-router-dom';
import MessageActions from "@/redux/MessageRedux"
import './index.scss';
import Apply from './apply';

import ContactsScreenRedux from "@/redux/ContactsScreenRedux";

const Item = List.Item;

class ContactIndex extends React.Component {
  componentDidMount() {
    this.props.getContacts();
  }

  toChat(msg, e){
    const { history, location, group } = this.props
    // 清除未读
    this.props.clearUnread('chat', msg.imusername)
    history.push(`/chat/${msg.imusername}?name=${msg.nickname}`);
  }

  render() {
    console.log(this.props);
    const {applyList, myContacts} = this.props.contacts;
    return (
      <div>
        <SearchBar placeholder="Search" />
        <List>
          <Item
              key="new_f"
              thumb={require('@assets/png/newfriend@3x.png')}
              onClick={() => {this.props.history.push('/contacts/apply')}}
            >
              {applyList.length > 0 ? <Badge dot>
                <span>新的朋友</span>         
              </Badge> : <span>新的朋友</span> }
            </Item> 
            <Item
              key="group"
              thumb={require('@assets/png/groupchat@3x.png')}
              onClick={() => {}}
            >
              群聊
            </Item> 
        </List>
        <br />
        <List>
          {myContacts.map(item => (
            <Item
              key={item.uid}
              thumb={
                item.icon ||
                "http://happyeveryone.oss-cn-shanghai.aliyuncs.com/35_3e4f3b77e4b3458eb1efd5b53b74695b.png"
              }
              onClick={() => {this.toChat(item)}}
            >
              {item.nickname}
            </Item>
          ))}
        </List>
      </div>
    );
  }
}

const ContactIndexWrap = connect(
  ({ contacts }, props) => ({
    contacts,
  }),
  dispatch => ({
    getContacts: () => {
      dispatch(ContactsScreenRedux.queryContacts());
      dispatch(ContactsScreenRedux.queryApply()); 
    },
    clearUnread: (chatType, id) => dispatch(MessageActions.clearUnread(chatType, id)),

  })
)(ContactIndex);

const Contact = (props) => {
  return (
    <Switch>
      <Route path="/contacts/apply" component={Apply} />
      <Route path="/contacts/" component={ContactIndexWrap} />
    </Switch>
  )
}

export default Contact;