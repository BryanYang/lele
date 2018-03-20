import React from 'react';
import { NavBar, Icon, ListView } from 'antd-mobile';



export default class Search extends React.PureComponent {

  render() {
    return <div className="search">
      <NavBar
        mode="dark"
        icon={<Icon type="left" />}
        onLeftClick={() => {
          console.log(this.props.history.goBack())
        }}
      >详情</NavBar>
      

    </div>
  }
}