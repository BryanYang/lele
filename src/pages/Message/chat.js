import React from "react";
import { Icon, NavBar, InputItem, List } from "antd-mobile";
import { Input } from "antd";
import fetch from "../../fetch";
import qs from "query-string";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ChatEmoji from "@components/chat/ChatEmoji";
import getTabMessages from "@/selectors/ChatSelector";
import MessageActions from "@/redux/MessageRedux";
import WebIM from "@easemob/WebIM";
import config from "@easemob/config";
import _ from "lodash";
import ChatMessage from "@/components/chat/ChatMessage";
import "./index.scss";
import "./style.less";

const Item = List.Item;
const Brief = Item.Brief;

const { PAGE_NUM } = config;
const DefaultImg = 'http://happyeveryone.oss-cn-shanghai.aliyuncs.com/35_3e4f3b77e4b3458eb1efd5b53b74695b.png';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showWebRTC: false,
      value: "",
      isLoaded: false
    };
    this.person = this.props.match.url.split("/")[2];
    const queryStrings = qs.parse(this.props.location.search);
    this.type = queryStrings.type || 'personal';
    this.group = props.match.params.id;

    this.handleSend = this.handleSend.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEmojiSelect = this.handleEmojiSelect.bind(this);
    this.handleEmojiCancel = this.handleEmojiCancel.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.onClearMessage = this.onClearMessage.bind(this);

    this.logger = WebIM.loglevel.getLogger("chat component");
  }

  componentDidMount() {}

  handleChange(e) {
    const v = e.target.value;
    const splitValue = this.state.value ? this.state.value.split("") : [];
    splitValue.pop();
    if (v == splitValue.join("")) {
      this.handleEmojiCancel();
    } else {
      this.setState({
        value: v
      });
    }
  }

  handleSend(e) {
    // console.log(this.state.value)
    const { value } = this.state;
    if (!value) return;
    if(this.type === 'personal'){
      this.props.sendTxtMessage("chat", this.person, {
        msg: value
      });
    }
    else if(this.type === 'groupchat') {
      this.props.sendTxtMessage("groupchat", this.group, {
        msg: value
      }); 
    }

    this.emitEmpty();
  }

  handleEmojiCancel() {
    if (!this.state.value) return;
    const arr = this.state.value.split("");
    const len = arr.length;
    let newValue = "";

    if (arr[len - 1] != "]") {
      arr.pop();
      newValue = arr.join("");
    } else {
      const index = arr.lastIndexOf("[");
      newValue = arr.splice(0, index).join("");
    }

    this.setState({
      value: newValue
    });
  }

  handleEmojiSelect(v) {
    this.setState(
      {
        value: (this.state.value || "") + v.key
      },
      () => {
        this.logger.info("callback");
        this.logger.info(this.state.value);
      }
    );
    this.logger.info("async");
    this.logger.info(this.state.value);
    this.input.focus();
  }

  handleScroll = e => {
    const _this = this;
    if (e.target.scrollTop === 0) {
      // TODO: optimization needed
      setTimeout(function() {
        const offset = _this.props.messageList
          ? _this.props.messageList.length
          : 0;
        const { selectItem, selectTab } = _.get(
          _this.props,
          ["match", "params"],
          {}
        );
        const chatTypes = {
          contact: "chat",
          group: "groupchat",
          chatroom: "chatroom",
          stranger: "stranger"
        };
        const chatType = chatTypes[selectTab];
        // load more history message
        _this.props.fetchMessage(this.person, "chat", offset, res => {
          // no more history when length less than 20
          if (res < PAGE_NUM) {
            _this.setState({
              isLoaded: true
            });
            _this._not_scroll_bottom = false;
          }
        });
        _this._not_scroll_bottom = true;
      }, 500);
    }
  };

  onClearMessage = () => {
    const chatTypes = {
      contact: "chat",
      group: "groupchat",
      chatroom: "chatroom",
      stranger: "stranger"
    };
    const chatType = chatTypes["contact"];
    this.props.clearMessage(chatType, this.person);
  };

  emitEmpty() {
    this.setState({
      value: ""
      // height: 34
    });
    this.input.value = "";
    this.input.focus();
  }

  handleKey(e) {
    if (e.keyCode == 8 || e.keycode == 46) {
      this.handleEmojiCancel();
    }
  }

  render() {
    const { messageList, match, myContacts } = this.props;
    const queryStrings = qs.parse(this.props.location.search);
    const contactInLele =
        _.get(myContacts, 'myContacts', []).find(c => c.imusername === queryStrings.name) || {};
    const _messageList = _.cloneDeep(messageList);
    _.each(_messageList || [], (msg, i) => {
      if(i > 0) {
        msg.showTime = msg.time - messageList[i-1].time > 1000 * 60 * 20; // 相邻20分钟不展示时间
      } else {
        msg.showTime = true; // 第一条默认显示时间 
      }
    });
    return (
      <div className="message" id="message">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.goBack();
          }}
        >
          {queryStrings.name}
        </NavBar>
        <div
          className="x-chat-content"
          ref="x-chat-content"
          onScroll={this.handleScroll}
        >
          {/* fixed bug of messageList.map(...) */}
          {this.state.isLoaded && (
            <div
              style={{
                width: "150px",
                height: "30px",
                lineHeight: "30px",
                backgroundColor: "#888",
                color: "#fff",
                borderRadius: "15px",
                textAlign: "center",
                margin: "10px auto"
              }}
            >
              没有消息
            </div>
          )}
          {_.map(messageList, message => (
            <ChatMessage key={message.id} {...message} userPic={contactInLele.icon || DefaultImg} chatType={this.type}/>
          ))}
        </div>
        <div className="x-chat-footer">
          <div className="x-list-item x-chat-ops">
            {/* emoji */}
            <div className="x-chat-ops-icon ib">
              <ChatEmoji onSelect={this.handleEmojiSelect} />
            </div>
            {/* image upload */}
            <label
              htmlFor="uploadImage"
              className="x-chat-ops-icon ib"
              onClick={() =>
                this.image && this.image.focus() && this.image.click()
              }
            >
              <i className="iconfont icon-picture" />
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
              onClick={() =>
                this.file && this.file.focus() && this.file.click()
              }
            >
              <i className="icon iconfont icon-file-empty" />
              <input
                id="uploadFile"
                ref={node => (this.file = node)}
                onChange={this.fileChange}
                type="file"
                className="hide"
              />
            </label>

            <label
              htmlFor="clearMessage"
              className="x-chat-ops-icon ib"
              onClick={this.onClearMessage}
            >
              <i className="icon iconfont icon-trash" />
            </label>
          </div>
          <div className="x-list-item x-chat-send">
            <Input
              value={this.state.value}
              onChange={this.handleChange}
              onPressEnter={this.handleSend}
              placeholder={"message"}
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
      </div>
    );
  }
}

export default connect(
  (state, props) => ({
    common: state.common,
    message: state.entities.message,
    blacklist: state.entities.blacklist,
    messageList: getTabMessages(state, props),
    myContacts: state.contacts,
  }),
  dispatch => ({
    sendTxtMessage: (chatType, id, message) =>
      dispatch(MessageActions.sendTxtMessage(chatType, id, message)),
    clearMessage: (chatType, id) =>
      dispatch(MessageActions.clearMessage(chatType, id)),
    fetchMessage: (id, chatType, offset, cb) =>
      dispatch(MessageActions.fetchMessage(id, chatType, offset, cb))
  })
)(Chat);
