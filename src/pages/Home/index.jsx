import React, { Component } from 'react';
import { TabBar, NavBar, Icon } from 'antd-mobile';
import Message from '@pages/Message/index';
import Explore from '@pages/Explore/index';
import Hall from '@pages/Hall/index';

import { Img } from '@components/Icon';

import 'antd-mobile/lib/tab-bar/style/index.css';
import 'antd-mobile/lib/nav-bar/style/index.css';
import './index.scss';


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: props.location.pathname.substr(1) || 'explore',
      hidden: false,
      fullScreen: false,
    };
  }

  componentWillReceiveProps(next){
   console.log(next) 
  }

  renderContent(pageText) {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
        <a style={{ display: 'block', marginTop: 40, marginBottom: 20, color: '#108ee9' }}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              hidden: !this.state.hidden,
            });
          }}
        >
          Click to show/hide tab-bar11
        </a>
      </div>
    );
  }

  render() {
    return (
      <div className="home">
        <TabBar
          unselectedTintColor="#949494"
          tintColor="rgb(228, 53, 58)"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            title="发现"
            key="explore"
            icon={<Img type="faxian"/>}
            selectedIcon={<Img type="faxian_alt"/>}
            selected={this.state.selectedTab === 'explore'}
            badge={0}
            onPress={() => {
              this.props.history.push('/explore')
            }}
            data-seed="logId"
          >
            <Explore {...this.props} /> 
          </TabBar.Item>
          <TabBar.Item
            icon={<Img type="dating"/>}
            selectedIcon={<Img type="dating_alt"/>}
            title="大厅"
            key="hall"
            selected={this.state.selectedTab === 'hall'}
            onPress={() => {
              this.props.history.push('/hall')
            }}
            data-seed="logId1"
          >
            <Hall {...this.props} /> 
          </TabBar.Item>
          <TabBar.Item
            icon={<Img type="message" />}
            selectedIcon={<Img type="message_alt"/>}
            title="消息"
            key="message"
            dot
            selected={this.state.selectedTab === 'message'}
            onPress={() => {
              this.props.history.push('/message')
            }}
          >
            <Message {...this.props} />
          </TabBar.Item>
          <TabBar.Item
            icon={<Img type="tongxunlu"/>}
            selectedIcon={<Img type="tongxunlu_alt"/>}
            title="通讯录"
            key="contacts"
            selected={this.state.selectedTab === 'contacts'}
            onPress={() => {
              this.props.history.push('/contacts')
            }}
          >
            {this.renderContent('My')}
          </TabBar.Item>
          <TabBar.Item
            icon={<Img type="wo"/>}
            selectedIcon={<Img type="wo_alt"/>}
            title="我的"
            key="my"
            selected={this.state.selectedTab === 'my'}
            onPress={() => {
              this.props.history.push('/my')
            }}
          >
            {this.renderContent('My')}
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}
