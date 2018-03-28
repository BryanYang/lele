import React, { Component } from 'react';
import { TabBar, NavBar, Icon } from 'antd-mobile';
import Message from '@pages/Message/index';
import Explore from '@pages/Explore/index';
import Hall from '@pages/Hall/index';
import My from '@pages/My/index';
import Contact from '@pages/Contact/index';
import { withRouter, Route } from "react-router-dom"
import { connect } from "react-redux"
import { Img } from '@components/Icon';

import ChatRoomActions from "@/redux/ChatRoomRedux"

import GroupActions from "@/redux/GroupRedux"
import GroupMemberActions from "@/redux/GroupMemberRedux"
import MessageActions from "@/redux/MessageRedux"

import 'antd-mobile/lib/tab-bar/style/index.css';
import 'antd-mobile/lib/nav-bar/style/index.css';
import './index.scss';


class Home extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      selectedTab: props.location.pathname.substr(1) || 'explore',
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
          hidden={this.props.layout.tabBarHidden}
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
            <Contact />
          </TabBar.Item>
          <TabBar.Item
            icon={<Img type="wo"/>}
            selectedIcon={<Img type="wo_alt"/>}
            title="我的"
            key="my"
            selected={this.state.selectedTab.indexOf('my') > -1 }
            onPress={() => {
              this.props.history.replace('/my')
            }}
          >
            <My {...this.props}  hiddenTabBar={this.hiddenTabBar} />
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

export default withRouter(
  connect(
      ({ breakpoint, entities, login, common, layout }) => ({
          breakpoint,
          login,
          common,
          layout,
      }),
      dispatch => ({
          getGroupMember: id => dispatch(GroupMemberActions.getGroupMember(id)),
          listGroupMemberAsync: opt => dispatch(GroupMemberActions.listGroupMemberAsync(opt)),
          switchRightSider: ({ rightSiderOffset }) => dispatch(GroupActions.switchRightSider({ rightSiderOffset })),
          joinChatRoom: roomId => dispatch(ChatRoomActions.joinChatRoom(roomId)),
          quitChatRoom: roomId => dispatch(ChatRoomActions.quitChatRoom(roomId)),
          clearUnread: (chatType, id) => dispatch(MessageActions.clearUnread(chatType, id)),
          getGroups: () => dispatch(GroupActions.getGroups()),
          getChatRooms: () => dispatch(ChatRoomActions.getChatRooms()),
          getMutedAsync: groupId => dispatch(GroupMemberActions.getMutedAsync(groupId)),
          getGroupAdminAsync: groupId => dispatch(GroupMemberActions.getGroupAdminAsync(groupId)),
          fetchMessage: (id, chatType, offset) => dispatch(MessageActions.fetchMessage(id, chatType, offset))
      })
  )(Home)
)
