import React from 'react';
import { NavBar, Icon } from 'antd-mobile';

export default class Players extends React.PureComponent {

  render(){
    return <div>
      <NavBar
        mode="dark"
        icon={<Icon type="left" />}
        onLeftClick={() => {
          console.log(this.props.history.goBack())
        }}
      >客服</NavBar>
    </div>
  }
}