import React from 'react';
import { NavBar, Icon } from 'antd-mobile';

import './index.scss';

export default class Article extends React.PureComponent {
  render(){
     return <div style={{height: '100%'}} className="content">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.replace('/')
          }}
        >详情</NavBar>
        <iframe className="article" title="detail" src={decodeURIComponent(this.props.match.params.id)}
          style={{width: '100%', height: '100%'}} />
      </div> 
  } 
} 