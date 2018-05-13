import React from 'react';
import { NavBar, Icon, List, Button } from 'antd-mobile';
import { withRouter, Route } from 'react-router-dom';
import { connect } from "react-redux";
import './index.scss';

import ContactsScreenRedux from "@/redux/ContactsScreenRedux";
const Item = List.Item;
class Apply extends React.Component {

  render(){
    const {applyList} = this.props.contacts;
    return  <div id="apply">
      <NavBar
        mode="dark"
        icon={<Icon type="left" />}
        onLeftClick={() => {
          this.props.history.goBack();
        }}
      >新的朋友</NavBar>
      <List>
        {applyList.map(item => (
          <Item
            key={item.id}
            extra={item.staus === 0 ? 
            <Button type="primary" size="small" inline onClick={() => this.props.applyPass(item.id)}>同意</Button> 
            : item.status === 1 ? <span>已同意</span> : <span>已拒绝</span>
          }
            multipleLine
            thumb={
              item.icon ||
              "http://happyeveryone.oss-cn-shanghai.aliyuncs.com/35_3e4f3b77e4b3458eb1efd5b53b74695b.png"
            }
          >
            {item.userVo.nickname}
            <List.Item.Brief>
              {item.content}
            </List.Item.Brief>
          </Item>
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
    })
  )(Apply)
)