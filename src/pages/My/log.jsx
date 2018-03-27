
import React from 'react';
import { List, NavBar, Icon } from 'antd-mobile';
import { connect } from "react-redux"

const Item = List.Item;

class Com extends React.Component {

  render() {
    return (<div>
      <NavBar
        mode="dark"
        icon={<Icon type="left" />}
        onLeftClick={() => {
          this.props.history.push('/my')
        }}
      >设置</NavBar>
      <List className="my-list">
        <Item arrow="horizontal" onClick={() => {}}>退出</Item>
      </List>
    </div>)
  }
  
}

export default connect(
  ({ }) => ({
  }),
  dispatch => ({
  })
)(Com)
