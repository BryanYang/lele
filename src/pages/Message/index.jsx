import React from "react";
import {
  Icon,
  NavBar,
  InputItem,
  Grid,
  List,
  Badge,
  SwipeAction,
  Popover
} from "antd-mobile";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Switch, Route, Link } from "react-router-dom";
import fetch from "../../fetch";
import WebIM from "@easemob/WebIM";
import utils from "@/utils";
import MessageActions from "@/redux/MessageRedux";
import ContactsScreenRedux from "@/redux/ContactsScreenRedux";
import GroupActions from "@/redux/GroupRedux";
import GroupMemberActions from "@/redux/GroupMemberRedux";
import axios from "axios";
import _ from "lodash";
// import 'antd-mobile/lib/grid/style/index.css';
import "./index.scss";
import getCurrentContacts from "@/selectors/ContactSelector";

const userController = require("@apis/controller")("user");
const Item = List.Item;
const Brief = Item.Brief;

const chatTypes = {
  contact: "chat",
  group: "groupchat",
  chatroom: "chatroom",
  stranger: "stranger"
};

const myImg = name => require(`@/assets/png/${name}@3x.png`);
class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sysMsgs: [],
      visible: false,
      halls: [],
      loadingHalls: true
    };
    this.toChat = this.toChat.bind(this);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
    this.props.getContacts();
    // 下面是获取通知消息
    fetch
      .get("/app/v1/msg", {
        params: { page: 1, count: 10, type: 2 }
      })
      .then(({ data: res }) => {
        if (res.code === 0 && res.data.msgVos) {
          this.setState({
            sysMsgs: res.data.msgVos
          });
        }
      });
    this.loadHall();
    // 获取群成员
    // this.props.getGroups(45386610835457)
    // getGroups(); // 这里调用他会循环调用
  }

  loadHall() {
    this.setState({ loadingHalls: true });
    axios.get("/app/v1/gameLobby").then(({ data: res }) => {
      this.setState({ loadingHalls: false });
      if (res.code === 0 && res.data) {
        this.setState({
          halls: res.data.gameLobbyVos
        });
      }
    });
  }

  toChat(msg, e) {
    const { history, location, group } = this.props;
    // 群组
    if (msg.type === "groupchat") {
      this.props.clearUnread("groupchat", msg.id);
      history.push(`/chat/${msg.id}?name=${msg.name}&type=groupchat`);
    } else {
      this.props.clearUnread("chat", msg.name);
      history.push(`/chat/${msg.name}?name=${msg.nickname}`);
    }
  }

  handleVisibleChange() {
    this.setState({
      visible: true
    });
  }

  onSelect(node, index) {
    switch (node.key) {
      case "addContact":
        this.props.history.push("/contacts/add");
        break;
      case "createGroup":
        this.props.history.push("/message/createGroup");
        break;
      default:
        break;
    }
  }

  render() {
    const {
      contacts,
      blacklist,
      message,
      myContacts,
      common,
      getGroups,
      groupContacts
    } = this.props;

    // 私人聊天
    const personalItems = [];
    _.forEach(_.get(contacts, "friends", []), (name, index) => {
      if (_.includes(blacklist.names, name)) return;
      const info = utils.getLatestMessage(
        _.get(message, [chatTypes["contact"], name], [])
      );
      const count = message.getIn(["unread", "chat", name], 0);
      const contactInLele =
        _.get(myContacts, "myContacts", []).find(c => c.imusername === name) ||
        {};
      personalItems[index] = {
        name,
        unread: count,
        nickname: contactInLele.nickname || name,
        icon: contactInLele.icon,
        ...info
      };
    });
    // 获取群组聊天
    const groupItems = [];
    _.forEach(_.get(groupContacts, "names", []), (v, index) => {
      const [name, id] = v.split("_#-#_");
      const info = utils.getLatestMessage(
        _.get(message, [chatTypes["group"], id], [])
      );
      const count = message.getIn(["unread", "groupchat", id], 0);
      if (!this.state.halls.map(h => h.groupId).includes(String(id))) {
        groupItems[index] = {
          name,
          id,
          type: "groupchat",
          nickname: name,
          unread: count,
          latestMessage: "",
          latestTime: "",
          ...info
        };
      }
    });

    const items = [...personalItems, ...groupItems];

    return (
      <div className="message" id="message">
        <NavBar
          mode="dark"
          className="navbar"
          rightContent={[
            <Popover
              key={0}
              overlayClassName="fortest"
              overlayStyle={{ color: "currentColor" }}
              visible={this.state.visible}
              overlay={[
                <Popover.Item
                  key="createGroup"
                  icon={<img src={myImg("qunliao")} alt="" />}
                >
                  发起群聊
                </Popover.Item>,
                <Popover.Item
                  key="addContact"
                  icon={<img src={myImg("add_friend")} alt="" />}
                  style={{ whiteSpace: "nowrap" }}
                >
                  添加朋友
                </Popover.Item>
              ]}
              align={{
                overflow: { adjustY: 0, adjustX: 0 },
                offset: [-10, 0]
              }}
              onVisibleChange={this.handleVisibleChange}
              onSelect={this.onSelect}
            >
              <div className="message-nav-right-img" />
            </Popover>
          ]}
        >
          消息
        </NavBar>
        {this.state.loadingHalls ? (
          ""
        ) : (
          <List className="my-list">
            {items.map((d, index) => (
              <Item
                key={index}
                onClick={() => {
                  this.toChat(d);
                }}
                extra={d.latestTime}
                align="top"
                thumb={
                  d.icon ||
                  "http://happyeveryone.oss-cn-shanghai.aliyuncs.com/35_3e4f3b77e4b3458eb1efd5b53b74695b.png"
                }
                multipleLine
              >
                {d.nickname}
                <Brief>{d.latestMessage}</Brief>
                <Badge
                  style={{ marginLeft: 10 }}
                  text={d.unread}
                  overflowCount={99}
                />
              </Item>
            ))}
          </List>
        )}
      </div>
    );
  }
}

export default withRouter(
  connect(
    (state, props) => ({
      common: state.common,
      contacts: getCurrentContacts(state, props.match), // roster
      groupContacts: getCurrentContacts(state, { path: "group" }), // 群
      myContacts: state.contacts,
      message: state.entities.message,
      blacklist: state.entities.blacklist
    }),
    dispatch => ({
      clearUnread: (chatType, id) =>
        dispatch(MessageActions.clearUnread(chatType, id)),
      getContacts: () => {
        dispatch(ContactsScreenRedux.queryContacts());
      },
      getGroups: () => dispatch(GroupActions.getGroups()),
      listGroupMemberAsync: groupId =>
        dispatch(GroupMemberActions.listGroupMemberAsync({ groupId }))
      // getChatRooms: () => dispatch(ChatRoomActions.getChatRooms())
    })
  )(Message)
);
