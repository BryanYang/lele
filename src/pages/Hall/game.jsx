import React from 'react';
import { Icon, InputItem, Grid, NavBar } from 'antd-mobile';
import {Link} from 'react-router-dom';
import {Img} from '@components/Icon';

import 'antd-mobile/lib/grid/style/index.css';
import './index.scss';

const STATE = ['chat', 'game'];

const DATA = ['闲', '和', '庄', '闲对', '庄对', '双对', '三宝'].map(t => ({text: t}));
const COLORS = {'闲': '#008fe0', '和': '#29ab91', '庄': '#f15a4a', '闲对': '#008fe0', '庄对': '#f15a4a', '双对': '#fc992c', '三宝': '#3bb1f3'};

const colors = (item) => {
  return COLORS[item] || 'black';
}

export default class Message extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      st: 'chat', // 当前模式， chat 或者 game,
      actionType: '',
    }
    this.changeSt = this.changeSt.bind(this);
    this.selectData = this.selectData.bind(this);
  }

  changeSt(){
    const index = STATE.indexOf(this.state.st);
    this.setState({
      st: STATE[index ^ 1],
    });
  }

  selectData(d){
    this.setState({
      actionType: d.text,
    });
  }

  componentDidUpdate(){
    this.state.st === 'chat' ? this.chatInput.focus() : this.gameInput.focus(); 
  }

  render(){
    return (<div>
      <NavBar
        mode="dark"
        className="game-nav"
        icon={<Icon type="left" />}
        onLeftClick={() => this.props.history.push('/hall')}
        rightContent={[
          <Link to="/table/888"><Img type="tables_b" /></Link>,
          <Link to="/service/888"><Img type="custome_service" /></Link>,
          <Link to="/players/888"><Img type="qunliao_s" /></Link>
        ]}
      ><span>大厅名字(12人)</span></NavBar>
      <div className="game" id="game">
      {
          this.state.st == 'chat' ? <InputItem
          className="input"
          placeholder="聊天内容"
          clear
          moneyKeyboardAlign="left"
          ref={el => this.chatInput = el}
      >
          <div onClick={this.changeSt}>
          <span style={{color: 'red'}}>LE</span>
          </div>
      </InputItem> : <div className="game-grid">
          <Grid data={DATA} onClick={this.selectData} square={false}
            renderItem={item => <div style={{color: colors(item.text)}} className="game-item" itemStyle={{height: '40px'}}>
              {item.text}
            </div>}
          />
          <InputItem
          placeholder="数字"
          clear
          type="number"
          ref={el => this.gameInput = el}
          >
          <div className="input-hot">
              <div onClick={this.changeSt}>
              <span style={{color: 'red'}}>Chat</span>
              </div>
              <div><span style={{color: 'gray'}}>{this.state.actionType}</span></div>
          </div>
          </InputItem>
      </div>
      }
      </div>
    </div>
    )
  }
}