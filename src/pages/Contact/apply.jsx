import React from 'react';
import { NavBar, Icon, List, Button } from 'antd-mobile';
import { withRouter, Route } from 'react-router-dom';
import { connect } from "react-redux";
import LayoutActions from "@/redux/LayoutRedux";
import './index.scss';

import ContactsScreenRedux from "@/redux/ContactsScreenRedux";
const Item = List.Item;
class Apply extends React.Component {
  componentDidMount(){
    this.props.hiddenTab();
  }

  componentWillUnmount(){
    this.props.showTab();
  }

  render(){
    const {applyList = []} = this.props.contacts;
    return  <div id="apply">
      <NavBar
        mode="dark"
        icon={<Icon type="left" />}
        onLeftClick={() => {
          this.props.history.goBack();
        }}
      >新的朋友</NavBar>
      {
        applyList.length > 0 ? <List>
        {applyList.map(item => (
          <Item
            key={item.id}
            extra={item.staus === 0 ? 
            <Button type="primary" size="small" inline onClick={() => this.props.applyPass(item.id)}>同意</Button> 
            : item.staus === 1 ? <span>已同意</span> : <span>已拒绝</span>
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
      </List> : <div style={{textAlign: 'center', color: 'gray', fontSize: 16, marginTop: 20 }}>暂无好友请求</div>
      }
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
      hiddenTab: () => {
        dispatch(LayoutActions.hiddenTab());
      },
      showTab: () => {
        dispatch(LayoutActions.showTab());
      }
    })
  )(Apply)
)