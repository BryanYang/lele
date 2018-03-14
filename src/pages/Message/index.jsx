import React from 'react';
import { Icon, InputItem, Grid } from 'antd-mobile';

import 'antd-mobile/lib/grid/style/index.css';
import './index.scss';

const STATE = ['chat', 'game'];

const DATA = ['闲', '和', '庄', '闲对', '庄对', '双对', '三宝'].map(t => ({text: t}));

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
    return (<div className="message">
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
      </InputItem> : <div>
        <Grid data={DATA} onClick={this.selectData} itemStyle={{ height: '50px', background: 'rgba(0,0,0,.05)' }} />
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
    </div>)
  }
}