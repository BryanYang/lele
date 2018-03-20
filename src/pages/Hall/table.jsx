import React from 'react';
import { NavBar, Icon } from 'antd-mobile';

const data = Array.from(new Array(29)).map((_val, i) => ({
  icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
  text: `name${i}`,
}));
export default class Table extends React.PureComponent {

  componentDidUpdate(){

  }

  render(){
    const TH = () => <tr>
      <th className="xj">1靴14局</th>
      <th className="x">闲</th>
      <th className="z">庄</th>
      <th className="xd">闲对</th>
      <th className="zd">庄对</th>
      <th className="h">和</th>
    </tr>;
    return <div>
      <div className="nav-placeholder">下注表</div>
      <NavBar
        mode="dark"
        className="table-nav-bar"
        icon={<Icon type="left" />}
        onLeftClick={() => {
          console.log(this.props.history.goBack())
        }}
      >下注表</NavBar>
      <table className="table-bet table-header">
        <TH /> 
      </table>
      <table className="table-bet">
        <TH />
        {
          data.map(d => <tr className="tr-num">
          <td>nick name</td>
          <td>112</td>
          <td>1133</td>
          <td>131</td>
          <td>113</td>
          <td>11</td>
        </tr>)
        }
        <tr className="tr-footer"></tr>
      </table>
      <table className="table-bet table-footer">
        <tr className="tr-num">
          <td>总计</td>
          <td>112</td>
          <td>1133</td>
          <td>131</td>
          <td>113</td>
          <td>11</td>
        </tr>
      </table>
    </div>
  }
}