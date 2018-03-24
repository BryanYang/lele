import React from 'react';
import { Icon, NavBar, InputItem, Grid, List } from 'antd-mobile';
import fetch from '../../fetch';
import db from '@db/index';
import WebIM from "@WebIM";
import 'antd-mobile/lib/grid/style/index.css';
import './index.scss';

const userController = require('@apis/controller')('user');
const Item = List.Item;
const Brief = Item.Brief;

export default class Message extends React.Component {
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

    const { imusername, impassword } = db.get('user').value();

    WebIM.conn.open({
      apiUrl: WebIM.config.apiURL,
      user: imusername,
      pwd: impassword,
      //  accessToken: password,
      appKey: WebIM.config.appkey,
      success(token) {
        console.log(token);
      },
      error: e => {
          console.log(e);
      }
    })

  }

  toChat(msg){
    this.props.history.push(`/chat/${msg.userVo.uid}`);
  }

  render(){
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
          this.state.data.map(d => <Item
            key={d.id}
            onClick={() => {this.toChat(d)}}
            extra={d.msgdate} 
            align="top" 
            thumb={d.userVo.icon} multipleLine>
            {d.userVo.nickname}
            <Brief>{d.content}</Brief>
          </Item>)
        }
      </List>
    </div>)
  }
}