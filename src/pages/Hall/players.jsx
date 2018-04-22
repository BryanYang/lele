import React from 'react';
import { Grid } from 'antd-mobile';
import { NavBar, Icon } from 'antd-mobile';
import _ from 'lodash';

const defaultImg = 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png'

const gameController = require("@apis/controller")("gameLobby");

export default class Players extends React.PureComponent {

  constructor(props){
    super(props)
    this.state = {
      users: [],
    }
  }

  componentDidMount(){
    gameController("gameDetail", { id: this.props.match.params.id }).then(res => {
      this.setState({
        users: _.get(res, "data.gameLobbyVo.userVos", []) || []
      });
    });
  }

  render(){
    return <div className="players">
      <NavBar
        mode="dark"
        icon={<Icon type="left" />}
        onLeftClick={() => {
          console.log(this.props.history.goBack())
        }}
      >成员详情({this.state.users.length})</NavBar>
      <Grid data={this.state.users} hasLine={false} columnNum={5} square={false} renderItem={user => (
        <div className="players-list">
          <img src={user.icon || defaultImg}  alt="" />
          <div className="name" style={{ color: '#888'}}>
            <span>{user.nickname}</span>
          </div>
        </div>
      )}/>
    </div>
  }
}