import React from 'react';
import { Icon, NavBar, InputItem, List } from 'antd-mobile';
import db from '@db/index';
import fetch from '../../fetch';

import './index.scss';

const Item = List.Item;
const Brief = Item.Brief;

export default class Chat extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
    this.friend = db.get('friends').find({uid: Number(this.props.match.params.id)}).value();
  }

  componentDidMount(){
   console.log(this.friend);
  }

  render(){
    return (<div className="message" id="message">
      <NavBar
        mode="dark"
      >{this.friend.nickname}</NavBar>
      
    </div>)
  }
}