import React from "react";
import {
  Icon,
  NavBar,
  InputItem,
  Grid,
  List,
  Badge,
  SwipeAction,
  Popover,
  Checkbox,
  SearchBar
} from "antd-mobile";
import ContactsScreenRedux from "@/redux/ContactsScreenRedux";
import { connect } from "react-redux";
import _ from 'lodash';

const Item = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;
const userController = require('@apis/controller')('user');

class CreateGroup extends React.Component {

  constructor(props){
    super(props);
    this.tempSelected = {};
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getContacts();
  }

  query() {}

  onChange(id, checked) {
    this.tempSelected[id] = checked;
  }

  onSubmit(){
    const selected = [];
    for(const k in this.tempSelected) {
      this.tempSelected[k] && selected.push(k);
    }
    userController('crateGroup', {users: JSON.stringify(selected)}, 'post').then(res => {
      if(res.code === 0 ) {
        const groupId = _.get(res, 'data.groupVo.groupid');
        const groupName = _.get(res, 'data.groupVo.groupname');
        this.props.history.push(`/chat/${groupId}?name=${groupName}&type=groupchat`);
      }
    })
  }

  render() {
    const { applyList = [], myContacts = [] } = this.props.contacts;
    return (
      <div id="createGroup">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.goBack();
          }}
          rightContent={[<span key="submit" onClick={this.onSubmit}>确定</span>]}
          className="navbar"
        >
          发起群聊
        </NavBar>
        <SearchBar placeholder="ID" onSubmit={this.query} />
        <List>
          {myContacts.map(item => (
            <CheckboxItem
              key={item.uid}
              onChange={(e) => this.onChange(item.uid, e.target.checked)}
            >
              <img
                alt=""
                className="user-icon"
                src={
                  item.icon ||
                  "http://happyeveryone.oss-cn-shanghai.aliyuncs.com/35_3e4f3b77e4b3458eb1efd5b53b74695b.png"
                }
              />
              {item.nickname}
            </CheckboxItem>
          ))}
        </List>
      </div>
    );
  }
}

export default connect(
  ({ contacts }, props) => ({
    contacts
  }),
  dispatch => ({
    getContacts: () => {
      dispatch(ContactsScreenRedux.queryContacts());
    }
  })
)(CreateGroup);
