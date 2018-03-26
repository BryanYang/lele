import React from 'react';
import { Icon, NavBar, InputItem, List } from 'antd-mobile';
import fetch from '../../fetch';
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import ChatEmoji from "@components/chat/ChatEmoji"
import getTabMessages from "@/selectors/ChatSelector"
import './index.scss';
// import "./style.less"

const Item = List.Item;
const Brief = Item.Brief;

class Chat extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  componentDidMount(){
    
  }

  render(){
    const { messageList, match } = this.props;
    console.log(messageList)
    return (<div className="message" id="message">
      <NavBar
        mode="dark"
      >{match.params.id}</NavBar>
     <div className="x-chat-footer">
      <div className="x-list-item x-chat-ops">
          {/* emoji */}
          <div className="x-chat-ops-icon ib">
              <ChatEmoji onSelect={this.handleEmojiSelect}/>
          </div>
          {/* image upload */}
          <label
              htmlFor="uploadImage"
              className="x-chat-ops-icon ib"
              onClick={() => this.image && this.image.focus() && this.image.click()}>
              <i className="iconfont icon-picture"/>
              <input
                  id="uploadImage"
                  ref={node => (this.image = node)}
                  onChange={this.pictureChange}
                  type="file"
                  className="hide"
              />
          </label>
          {/*  file upload*/}
          <label
              htmlFor="uploadFile"
              className="x-chat-ops-icon ib"
              onClick={() => this.file && this.file.focus() && this.file.click()}>
              <i className="icon iconfont icon-file-empty"/>
              <input
                  id="uploadFile"
                  ref={node => (this.file = node)}
                  onChange={this.fileChange}
                  type="file"
                  className="hide"
              />
          </label>
 
          <label htmlFor="clearMessage" className="x-chat-ops-icon ib" onClick={this.onClearMessage}>
              <i className="icon iconfont icon-trash"></i>
          </label>
      </div>
      <div className="x-list-item x-chat-send">
          
          {/*<TextArea rows={2} />*/}
      </div>
    </div> 
    </div>)
  }
}



export default connect(
    (state, props) => ({
        common: state.common,
        message: state.entities.message,
        blacklist: state.entities.blacklist,
        messageList: getTabMessages(state, props)
    }),
    dispatch => ({
        // getGroups: () => dispatch(GroupActions.getGroups()),
        // getChatRooms: () => dispatch(ChatRoomActions.getChatRooms())
    })
)(Chat)
