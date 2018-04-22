import React from "react";
import { NavBar, Icon, Toast } from "antd-mobile";
import _ from 'lodash';

const gameController = require("@apis/controller")("gameLobby");

export default class Table extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    this.gameId = this.props.match.params.id;
    gameController("betList", { id: this.gameId, version: 1 }).then(res => {
      console.log(res);
      if(res.code === 0 && res.data.gameBetVos){
        this.setState({data: res.data.gameBetVos});
      } else {
        Toast.info(res.msg)
      }
    });
  }

  render() {
    const TH = () => (
      <tr>
        <th className="xj">1靴14局</th>
        <th className="x">闲</th>
        <th className="z">庄</th>
        <th className="xd">闲对</th>
        <th className="zd">庄对</th>
        <th className="h">和</th>
      </tr>
    );
    return (
      <div>
        <div className="nav-placeholder">下注表</div>
        <NavBar
          mode="dark"
          className="table-nav-bar"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            console.log(this.props.history.goBack());
          }}
        >
          下注表
        </NavBar>
        <table className="table-bet table-header">
          <tbody>
            <TH />
          </tbody>
        </table>
        <table className="table-bet">
          <tbody>
            <TH />
            {this.state.data.map((d, i) => (
              <tr className="tr-num" key={i}>
                <td>{d.nickname}</td>
                <td>{d.xian}</td>
                <td>{d.zhuang}</td>
                <td>{d.xiandui}</td>
                <td>{d.zhuangdui}</td>
                <td>{d.he}</td>
              </tr>
            ))}
            <tr className="tr-footer" />
          </tbody>
        </table>
        <table className="table-bet table-footer">
          <tbody>
            <tr className="tr-num">
              <td>总计</td>
              <td>{_.sumBy(this.state.data, function(o) { return o.xian})}</td>
              <td>{_.sumBy(this.state.data, function(o) { return o.xiandui})}</td>
              <td>{_.sumBy(this.state.data, function(o) { return o.zhuang})}</td>
              <td>{_.sumBy(this.state.data, function(o) { return o.zhuangdui})}</td>
              <td>{_.sumBy(this.state.data, function(o) { return o.he})}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
