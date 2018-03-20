import React from 'react';
import { Grid } from 'antd-mobile';
import { NavBar, Icon } from 'antd-mobile';

const data = Array.from(new Array(2)).map((_val, i) => ({
  icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
  text: `name${i}`,
}));
export default class Players extends React.PureComponent {

  render(){
    return <div className="players">
      <NavBar
        mode="dark"
        icon={<Icon type="left" />}
        onLeftClick={() => {
          console.log(this.props.history.goBack())
        }}
      >成员详情(22)</NavBar>
      <Grid data={data} hasLine={false} columnNum={5} square={false} renderItem={dataItem => (
        <div className="players-list">
          <img src={dataItem.icon}  alt="" />
          <div className="name" style={{ color: '#888'}}>
            <span >I am title..</span>
          </div>
        </div>
      )}/>
    </div>
  }
}