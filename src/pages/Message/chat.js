import React from 'react';
import { Icon, NavBar, InputItem, List } from 'antd-mobile';
import { Input } from 'antd'; 
import fetch from '../../fetch';
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import ChatEmoji from "@components/chat/ChatEmoji"
import getTabMessages from "@/selectors/ChatSelector"
import MessageActions from "@/redux/MessageRedux"
import WebIM from '@easemob/WebIM';
import './index.scss';
import "./style.less"

const Item = List.Item;
const Brief = Item.Brief;

class Chat extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showWebRTC: false,
      value: "",
      isLoaded: false
    }
    this.person = this.props.match.url.split('/')[2];
    console.log(this.props);
    this.handleSend = this.handleSend.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleEmojiSelect = this.handleEmojiSelect.bind(this)
    this.handleEmojiCancel = this.handleEmojiCancel.bind(this)
    this.handleKey = this.handleKey.bind(this)

    this.logger = WebIM.loglevel.getLogger("chat component")
  }

  componentDidMount(){
    
  }

  handleChange(e) {
    const v = e.target.value
    const splitValue = this.state.value ? this.state.value.split("") : []
    splitValue.pop()
    if (v == splitValue.join("")) {
        this.handleEmojiCancel()
    } else {
        this.setState({
            value: v
        })
    }
  }

  handleSend(e) {
    // console.log(this.state.value)
    const {
        match,
        message
        // form: { getFieldDecorator, validateFieldsAndScroll }
    } = this.props
    const { selectItem, selectTab } = match.params
    const { value } = this.state
    if (!value) return
    this.props.sendTxtMessage('chat', this.person, {
        msg: value
    })
    this.emitEmpty()
  }

  handleEmojiCancel() {
    if (!this.state.value) return
    const arr = this.state.value.split("")
    const len = arr.length
    let newValue = ""

    if (arr[len - 1] != "]") {
        arr.pop()
        newValue = arr.join("")
    } else {
        const index = arr.lastIndexOf("[")
        newValue = arr.splice(0, index).join("")
    }

    this.setState({
        value: newValue
    })
  }

  handleEmojiSelect(v) {
    this.setState({
        value: (this.state.value || "") + v.key
    }, () => {
        this.logger.info("callback")
        this.logger.info(this.state.value)
    })
    this.logger.info("async")
    this.logger.info(this.state.value)
    this.input.focus()
  }

  emitEmpty() {
    this.setState({
        value: ""
        // height: 34
    })
    this.input.value = ""
    this.input.focus()
  }

  handleKey(e) {
      if (e.keyCode == 8 || e.keycode == 46) {
          this.handleEmojiCancel()
      }
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
          <Input
              value={this.state.value}
              onChange={this.handleChange}
              onPressEnter={this.handleSend}
              placeholder={'message'}
              addonAfter={
                  <i
                    className="fontello icon-paper-plane"
                    onClick={this.handleSend}
                    style={{ cursor: "pointer" }}
                  />
              }
              ref={node => (this.input = node)}
          />
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
      sendTxtMessage: (chatType, id, message) => dispatch(MessageActions.sendTxtMessage(chatType, id, message)),
    })
)(Chat)
