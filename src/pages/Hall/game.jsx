/**
 * 游戏大厅，发消息和玩游戏用
 */
import React from "react";
import { Icon, InputItem, Grid, NavBar, Toast } from "antd-mobile";
import ReactDOM from "react-dom";
import { Input } from "antd";
import { connect } from "react-redux";
import qs from "query-string";
import { Link } from "react-router-dom";
import { Img } from "@components/Icon";
import _ from "lodash";

import ChatEmoji from "@components/chat/ChatEmoji";
import Lele from "@components/lele/index";
import getTabMessages from "@/selectors/ChatSelector";
import MessageActions from "@/redux/MessageRedux";
import WebIM from "@easemob/WebIM";
import config from "@easemob/config";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatRoomActions from "@/redux/ChatRoomRedux";

import "./index.scss";

const gameController = require("@apis/controller")("gameLobby");
const userController = require("@apis/controller")("user");

const { PAGE_NUM } = config;
const DATA = ["闲", "庄", "闲对", "庄对", "和", "双对", "三宝"];
const DefaultImg =
  "http://happyeveryone.oss-cn-shanghai.aliyuncs.com/35_3e4f3b77e4b3458eb1efd5b53b74695b.png";

const getLeleUser = imusername => {
  userController("userDetail", { imusername }).then(res => {
    console.log(res);
  });
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameLobby: {
        serviceUserVo: {}
      },
      value: "",
      online: false
    };

    this.queryParams = qs.parse(props.location.search);
    this.gameId = props.match.params.id;
    this.groupId = this.queryParams.groupId;
    this.type = this.queryParams.type;
    // this.groupId = "45520317906945"; // mock

    this.handLeleSelect = this.handLeleSelect.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEmojiSelect = this.handleEmojiSelect.bind(this);
    this.handleEmojiCancel = this.handleEmojiCancel.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.onClearMessage = this.onClearMessage.bind(this);
    this.pictureChange = this.pictureChange.bind(this);
  }

  componentDidMount() {
    // 将用户加入大厅
    gameController("clickGame", { gameid: this.gameId }).then(res => {
      // console.log(res);
      setTimeout(() => {
        // join 聊天室
        this.props.joinChatRoom(this.groupId);
      }, 200);
    });

    gameController("gameDetail", { id: this.gameId }).then(res => {
      this.setState({
        gameLobby: {
          serviceUserVo: {},
          ...(_.get(res, "data.gameLobbyVo") || {})
        }
      });
    });

    this.scollBottom();
  }

  componentWillReceiveProps(nextProps) {
    const { messageList = [] } = nextProps;
    const thisMessageList = this.props.messageList || [];
    if (thisMessageList.length !== messageList.length) {
      this._not_scroll_bottom = false;
    } else {
      this._not_scroll_bottom = true;
    }
  }

  componentDidUpdate() {
    this.scollBottom();
  }

  componentWillUnmount() {
    this.props.quitChatRoom(this.groupId);
  }

  handLeleSelect(d) {
    this.setState({
      value: d.text + ':'
    });
    this.input.focus();
  }

  scollBottom() {
    if (!this._not_scroll_bottom) {
      setTimeout(() => {
        const dom = this.refs["x-chat-content"];
        if (!ReactDOM.findDOMNode(dom)) return;
        dom.scrollTop = dom.scrollHeight;
      }, 0);
    }
  }

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
    const { value } = this.state;
    const betMsg = this.parseBetMsg(value);
    if (!value) return;
    if (betMsg) {
      this.bet(betMsg).then(res => {
        if (res.code === 0) {
          this.props.sendTxtMessage("chatroom", this.groupId, {
            msg: value
          });
          Toast.success('下注成功');
        } else {
          Toast.fail(res.msg);
        }
      });
    } else {
      this.props.sendTxtMessage("chatroom", this.groupId, {
        msg: value
      });
    }
    this.emitEmpty();
  }

  // 下注
  bet(msg) {
    return gameController("bet", { id: this.gameId, ...msg }, "post");
  }

  // 闲1，庄1，闲对12
  parseBetMsg(value) {
    const res = /(^[闲|庄|闲对|庄对|和|双对|三宝]+):(\d+)$/.exec(value);
    if (res) {
      return {
        type: DATA.indexOf(res[1]) + 1,
        score: res[2]
      };
    }
    return null;
  }

  pictureChange(e) {
    const isRoom = this.type === "chatroom";
    let file = WebIM.utils.getFileUrl(e.target);
    if (!file.filename) {
      this.image.value = null;
      return false;
    }

    if (!config.imgType[file.filetype.toLowerCase()]) {
      this.image.value = null;
      // todo i18n
      alert("不支持类型");
    }

    this.props.sendImgMessage(this.type, this.groupId, { isRoom }, file, () => {
      this.image.value = null;
    });
    //
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
    this.setState({
      value: (this.state.value || "") + v.key
    });
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
        // load more history message
        _this.props.fetchMessage(this.groupId, "chatroom", offset, res => {
          // no more history when length less than 20
          if (res < PAGE_NUM) {
            _this.setState({
              isLoaded: true
            });
            // _this._not_scroll_bottom = false;
          }
        });
        // _this._not_scroll_bottom = true;
      }, 500);
    }
  };

  onClearMessage = () => {
    const chatType = this.type;
    this.props.clearMessage(chatType, this.groupId);
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
    const { gameLobby } = this.state;
    const { messageList, match, myContacts } = this.props;
    const _messageList = _.cloneDeep(messageList);
    _.each(_messageList || [], (msg, i) => {
      if (i > 0) {
        msg.showTime = msg.time - messageList[i - 1].time > 1000 * 60 * 20; // 相邻20分钟不展示时间
      } else {
        msg.showTime = true; // 第一条默认显示时间
      }
    });
    return (
      <div>
        <NavBar
          mode="dark"
          className="game-nav"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.push("/hall")}
          rightContent={[
            <Link key="table" to={`/table/${this.gameId}`}>
              <Img type="tables_b" />
            </Link>,
            <Link
              key="service"
              to={`/chat/${gameLobby.serviceUserVo.imusername}?name=${
                gameLobby.serviceUserVo.nickname
              }&type=stranger`}
            >
              <Img type="custome_service" />
            </Link>,
            <Link key="players" to={`/players/${this.gameId}`}>
              <Img type="qunliao_s" />
            </Link>
          ]}
        >
          <span>
            {gameLobby.name}
            <i
              className={"state-circle " + this.state.online ? "online" : ""}
            />
          </span>
        </NavBar>
        <div className="game" id="game">
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
            {_.map(_messageList, message => (
              <ChatMessage
                key={message.id}
                {...message}
                userPic={DefaultImg}
                chatType={this.type}
              />
            ))}
          </div>
          <div className="x-chat-footer">
            <div className="x-list-item x-chat-ops">
              {/* game */}
              <div className="x-chat-ops-icon ib">
                <Lele onSelect={this.handLeleSelect} />
              </div>
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
            </div>
            <div className="x-list-item x-chat-send">
              <Input
                value={this.state.value}
                onChange={this.handleChange}
                onPressEnter={this.handleSend}
                placeholder={"请输入..."}
                addonAfter={
                  <span onClick={this.handleSend}>发送</span>
                }
                ref={node => (this.input = node)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state, props) => ({
    messageList: getTabMessages(state, props),
    myContacts: state.contacts
  }),
  dispatch => ({
    joinChatRoom: roomId => dispatch(ChatRoomActions.joinChatRoom(roomId)),
    quitChatRoom: roomId => dispatch(ChatRoomActions.quitChatRoom(roomId)),
    sendTxtMessage: (chatType, id, message) =>
      dispatch(MessageActions.sendTxtMessage(chatType, id, message)),
    sendImgMessage: (chatType, id, message, source) =>
      dispatch(MessageActions.sendImgMessage(chatType, id, message, source)),
    clearMessage: (chatType, id) =>
      dispatch(MessageActions.clearMessage(chatType, id)),
    fetchMessage: (id, chatType, offset, cb) =>
      dispatch(MessageActions.fetchMessage(id, chatType, offset, cb))
    /*
      getGroupMember: id => dispatch(GroupMemberActions.getGroupMember(id)),
      listGroupMemberAsync: opt => dispatch(GroupMemberActions.listGroupMemberAsync(opt)),
      switchRightSider: ({ rightSiderOffset }) => dispatch(GroupActions.switchRightSider({ rightSiderOffset })),
     
      quitChatRoom: roomId => dispatch(ChatRoomActions.quitChatRoom(roomId)),
      clearUnread: (chatType, id) => dispatch(MessageActions.clearUnread(chatType, id)),
      getGroups: () => dispatch(GroupActions.getGroups()),
      getChatRooms: () => dispatch(ChatRoomActions.getChatRooms()),
      getMutedAsync: groupId => dispatch(GroupMemberActions.getMutedAsync(groupId)),
      getGroupAdminAsync: groupId => dispatch(GroupMemberActions.getGroupAdminAsync(groupId)),
      fetchMessage: (id, chatType, offset) => dispatch(MessageActions.fetchMessage(id, chatType, offset))
      */
  })
)(Game);
