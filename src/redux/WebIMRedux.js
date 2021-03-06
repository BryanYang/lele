import { createReducer, createActions } from "reduxsauce"
import Immutable from "seamless-immutable"
import _ from "lodash"
import WebIM from "@easemob/WebIM"
import CommonActions from "@redux/CommonRedux"
import RosterActions from "@redux/RosterRedux"
import LoginActions from "@redux/LoginRedux"
import GroupActions from "@redux/GroupRedux"
import ChatRoomActions from "@redux/ChatRoomRedux"
import StrangerActions from "@redux/StrangerRedux"
import SubscribeActions from "@redux/SubscribeRedux"
import BlacklistActions from "@redux/BlacklistRedux"
import MessageActions from "@redux/MessageRedux"
import GroupRequestActions from "@redux/GroupRequestRedux"
import { store } from "@redux"
import { history } from "@/utils"
import utils from "@/utils"
import AppDB from "@/utils/AppDB"
import { I18n } from "react-redux-i18n"
import { Toast } from "antd-mobile"

const message = {
    success: Toast.success,
    error: Toast.fail,
    warning: Toast.info,
}

const logger = WebIM.loglevel.getLogger("WebIMRedux")
console.log('初始化 web im redux')
WebIM.conn.listen({
    // success connect to xmpp
    onOpened: msg => {
        console.log('open')
        const username = store.getState().login.username
        const token = utils.getToken()
        const hash = utils.getHash()
        // TODO all path could visited by anonymous should be declared directly
        const path = history.location.pathname.indexOf("login") !== -1 ? "/contact" : history.location.pathname
        const redirectUrl = `${path}?username=${username}`

        // init local db
        AppDB.init(username)

        // get unread message number from localdb
        store.dispatch(MessageActions.initUnread())

        // presence to be online and receive message
        WebIM.conn.setPresence()
    
        // get roster

        store.dispatch(RosterActions.getContacts())
        
        // dispatch login success callback
        store.dispatch(LoginActions.setLoginSuccess())
        
        // fetch blacklist
        store.dispatch(BlacklistActions.getBlacklist())

        // fetch grouplist
        store.dispatch(GroupActions.getGroups())

        // fetch chatrooms
        store.dispatch(ChatRoomActions.getChatRooms())

        store.dispatch(LoginActions.stopLoging())

        // refresh page
        //hash.indexOf(redirectUrl) === -1 && history.push(redirectUrl)
    },
    onPresence: msg => {
        // console.log("onPresence", msg, store.getState())
        switch (msg.type) {
        case "joinGroupNotifications":
            logger.info("joinGroupNotifications")
            store.dispatch(CommonActions.setShowGroupRequestModal(true))
            store.dispatch(GroupRequestActions.addGroupRequest(msg))
            break
        case "leaveGroup": // dismissed by admin
            message.error(
                `${msg.kicked || I18n.t("you")} ${I18n.t("dismissed")}${I18n.t("by")}${msg.actor ||
                    I18n.t("admin")} .`
            )
            store.dispatch(GroupActions.getGroups())
            break
        case "joinPublicGroupSuccess":
            message.success(`${I18n.t("joinGroup")} ${msg.from} ${I18n.t("successfully")}`)
            store.dispatch(GroupActions.getGroups())
            break
        case "joinPublicGroupDeclined":
            message.error(
                `${I18n.t("join")}${I18n.t("group")}${msg.gid}${I18n.t("refuse")}${I18n.t("by")}${msg.owner}`
            )
            break
        case "joinChatRoomSuccess": // Join the chat room successfully
            // Demo.currentChatroom = msg.from;
            break
        case "reachChatRoomCapacity": // Failed to join the chat room
            // Demo.currentChatroom = null;
            message.error(`${I18n.t("joinGroup")}${I18n.t("failed")}`)
            break
        case "subscribe":
            // jion friend action is subscribe/publish pattern，so when you agree to add a friend
            // it will notify the other side automatic，when state equasl [resp:true], do nothing
            if (msg.status === "[resp:true]") {
                return
            }

            store.dispatch(SubscribeActions.addSubscribe(msg))
            break
        case "subscribed":
            store.dispatch(RosterActions.getContacts())
            // Alert.alert(msg.from + " " + I18n.t("subscribed"))
            message.warning(msg.from + "" + I18n.t("subscribed"))
            break
        case "unsubscribe": // The sender deletes a friend.
        case "unsubscribed": // The other party has removed you from the friend list.
            store.dispatch(RosterActions.getContacts())
            // Alert.alert(msg.from + " " + I18n.t("unsubscribed"))
            if ("code" in msg) {
                message.warning(msg.from + " " + I18n.t("refuse"))
            } else {
                message.warning(msg.from + " " + I18n.t("unsubscribed"))
            }
            break
        case "memberJoinPublicGroupSuccess":
            message.success(`${msg.mid}${I18n.t("join")}${I18n.t("group")}${msg.from}${I18n.t("successfully")}`)
            break
        case "memberJoinChatRoomSuccess":
            // message.success(`${msg.mid}${I18n.t("join")}${I18n.t("chatroom")}${msg.from}${I18n.t("successfully")}`)
            break
        case "leaveChatRoom": // Leave the chat room
            break
        case "addMute":
            console.log("you was muted", msg)
            message.warning(`you was muted: ${msg}`)
            break
        case "removeMute":
            console.log("you was unmuted", msg)
            message.success(`you was unmuted: ${msg}`)
            break
        default:
            break
        }
    },
    // handle all exception
    onError: error => {
        console.log(error)
        // 16: server-side close the websocket connection
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
            console.log(
                "WEBIM_CONNCTION_DISCONNECTED",
                WebIM.conn.autoReconnectNumTotal,
                WebIM.conn.autoReconnectNumMax
            )
            if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
                return
            }
            message.error(`${I18n.t("serverSideCloseWebsocketConnection")}`)
            history.push("/login")
            return
        }
        // 2: login by token failed
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_AUTH_ERROR) {
            message.error(`${I18n.t("webIMConnectionAuthError")}`)

            return
        }
        // 7: client-side network offline (net::ERR_INTERNET_DISCONNECTED)
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_CLOSE_ERROR) {
            console.log("WEBIM_CONNCTION_SERVER_CLOSE_ERROR")
            //TODO: need add judgement first: should not display err message while logout
            // message.error("client-side network offline")

            return
        }
        // 8: offline by multi login
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
            console.log("WEBIM_CONNCTION_SERVER_ERROR")
            message.error(`${I18n.t("offlineByMultiLogin")}`)
            history.push("/login")
            return
        }
        if (error.type == 1) {
            let data = error.data ? error.data.data : ""
            data && message.error(data)
            store.dispatch(LoginActions.loginFailure(error))
        }
    },
    onClosed: msg => {
        console.log("onClosed", msg)
        // msg.msg && message.error(msg.msg)
        store.dispatch(Creators.logoutSuccess())
    },
    onBlacklistUpdate: list => {
        store.dispatch(BlacklistActions.updateBlacklist(list))
    },
    onReadMessage: message => {
        logger.info("onReadMessage", message)
        store.dispatch(MessageActions.updateMessageStatus(message, "read"))
    },
    onDeliveredMessage: message => {
        logger.info("onDeliveredMessage", message)
        // store.dispatch(MessageActions.updateMessageStatus(message, "sent"))
    },
    onReceivedMessage: message => {
        logger.info("onReceivedMessage", message)
        const { id, mid } = message
        store.dispatch(MessageActions.updateMessageMid(id, mid))
    },
    onTextMessage: message => {
        // console.log("onTextMessage", message)
        store.dispatch(MessageActions.addMessage(message, "txt"))
        store.dispatch(MessageActions.sendRead(message))
        const { type, from, to } = message
        switch (type) {
        case "chat":
            store.dispatch(RosterActions.topRoster(from))
            break
        case "groupchat":
            store.dispatch(GroupActions.topGroup(to))
            break
        case "chatroom":
            store.dispatch(ChatRoomActions.topChatroom(to))
            break
        default:
            break
        }
    },
    onPictureMessage: message => {
         // 为什么游戏是组聊天，应该是聊天室
        if(message.from === "admin") {
          message.type = "chatroom";
        }
        console.log("onPictureMessage", message)
        store.dispatch(MessageActions.addMessage(message, "img"))
        store.dispatch(MessageActions.sendRead(message))
        const { type, from, to } = message;
        switch (type) {
        case "chat":
            store.dispatch(RosterActions.topRoster(from))
            break
        case "groupchat":
            store.dispatch(GroupActions.topGroup(to))
            break
        case "chatroom":
            store.dispatch(ChatRoomActions.topChatroom(to))
            break
        default:
            break
        }
    },
    onFileMessage: message => {
        store.dispatch(MessageActions.addMessage(message, "file"))
        store.dispatch(MessageActions.sendRead(message))
        const { type, from, to } = message
        switch (type) {
        case "chat":
            store.dispatch(RosterActions.topRoster(from))
            break
        case "groupchat":
            store.dispatch(GroupActions.topGroup(to))
            break
        case "chatroom":
            store.dispatch(ChatRoomActions.topChatroom(to))
            break
        default:
            break
        }
    },
    onAudioMessage: message => {
        store.dispatch(MessageActions.addAudioMessage(message, "audio"))
        store.dispatch(MessageActions.sendRead(message))
        const { type, from, to } = message
        switch (type) {
        case "chat":
            store.dispatch(RosterActions.topRoster(from))
            break
        case "groupchat":
            store.dispatch(GroupActions.topGroup(to))
            break
        case "chatroom":
            store.dispatch(ChatRoomActions.topChatroom(to))
            break
        default:
            break
        }
    },
    onVideoMessage: message => {
        store.dispatch(MessageActions.addMessage(message, "video"))
        store.dispatch(MessageActions.sendRead(message))
        const { type, from, to } = message
        switch (type) {
        case "chat":
            store.dispatch(RosterActions.topRoster(from))
            break
        case "groupchat":
            store.dispatch(GroupActions.topGroup(to))
            break
        case "chatroom":
            store.dispatch(ChatRoomActions.topChatroom(to))
            break
        default:
            break
        }
    },
    onInviteMessage: msg => {
        console.log("onInviteMessage", msg)
        store.dispatch(GroupRequestActions.addGroupRequest(msg))
        store.dispatch(GroupActions.getGroups())
        message.success(`${msg.from}${I18n.t("invite")}${I18n.t("you")}${I18n.t("join")}${msg.roomid}`)
    },
    onMutedMessage: msg => {
        console.log("onMutedMessage", msg)
        store.dispatch(MessageActions.muteMessage(msg.mid))
        message.error(`${I18n.t("you")}${I18n.t("muted")}`)
    }
})

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    logoutSuccess: null,
    signin: null,

    // ----------------async------------------
    logout: () => {
        return (dispatch, state) => {
            let I18N = store.getState().i18n.translations[store.getState().i18n.locale]
            message.success(I18N.logoutSuccessfully)
            dispatch(CommonActions.fetching())
            dispatch(LoginActions.logout())
            if (WebIM.conn.isOpened()) {
                WebIM.conn.close("logout")
            }
        }
    }
})

export const WebIMTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({})

/* ------------- Reducers ------------- */

export const logoutSuccess = state => {
    // console.log("logoutSuccess", state)
    history.push("/login")
    return state
}

export const signin = state => {
    history.push("/login")
    return state
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.LOGOUT_SUCCESS]: logoutSuccess,
    [Types.SIGNIN]: signin
})

/* ------------- Selectors ------------- */

/** Constants: Connection Status Constants
 *  Connection status constants for use by the connection handler
 *  callback.
 *
 *  Status.ERROR - An error has occurred
 *  Status.CONNECTING - The connection is currently being made
 *  Status.CONNFAIL - The connection attempt failed
 *  Status.AUTHENTICATING - The connection is authenticating
 *  Status.AUTHFAIL - The authentication attempt failed
 *  Status.CONNECTED - The connection has succeeded
 *  Status.DISCONNECTED - The connection has been terminated
 *  Status.DISCONNECTING - The connection is currently being terminated
 *  Status.ATTACHED - The connection has been attached
 *  Status.CONNTIMEOUT - The connection has timed out
 */
