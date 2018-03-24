/* eslint-disable */
import "script-loader!easemob-websdk/dist/strophe-1.2.8.js"
/* eslint-enable */
import websdk from "easemob-websdk"
import Message from '@stores/Message'
import config from "./config"
import emoji from "./emoji"
import Api from "axios"
import { Toast } from "antd-mobile"
import loglevel from "./loglevel"


console = console || {}
console.group = console.group || function () {}
console.groupEnd = console.groupEnd || function () {}

// init DOMParser / document for strophe and sdk
let WebIM = window.WebIM || {}
WebIM.config = config
WebIM.loglevel = loglevel
// replace all console.log with loglevel.info
// console.log = loglevel.info

WebIM.conn = new websdk.connection({
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    https: WebIM.config.https,
    url: WebIM.config.xmppURL,
    isAutoLogin: false,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    autoReconnectInterval: WebIM.config.autoReconnectInterval,
    isStropheLog: WebIM.config.isStropheLog,
    delivery: WebIM.config.delivery
})

WebIM.conn.listen({
    // success connect to xmpp
    onOpened: msg => {
    
        // init local db
        // AppDB.init(username)

        // get unread message number from localdb
        Message.initUnread();
        console.log(msg)
        // presence to be online and receive message
        WebIM.conn.setPresence()
    
        // get roster
        // store.dispatch(RosterActions.getContacts());
        WebIM.conn.getRoster({
            success: roster => {
              console.log(roster);
            },
            error: error => {
                
            }
        })

        
        // dispatch login success callback
        // store.dispatch(LoginActions.setLoginSuccess())
        
        // fetch blacklist
        // store.dispatch(BlacklistActions.getBlacklist())

        // fetch grouplist
        // store.dispatch(GroupActions.getGroups())

        // fetch chatrooms
        // store.dispatch(ChatRoomActions.getChatRooms())

        // store.dispatch(LoginActions.stopLoging())

        // refresh page
        // hash.indexOf(redirectUrl) === -1 && history.push(redirectUrl)
    },
   
})

// for downward compatibility 
if (!WebIM.conn.apiUrl) {
    WebIM.conn.apiUrl = WebIM.config.apiURL
}

// websdk.debug(true)

const appKeyPair = WebIM.config.appkey.split("#")
export let api = Api.create({
    baseURL: `${WebIM.config.apiURL}/${appKeyPair[0]}/${appKeyPair[1]}`,
    validateStatus: function (status) {
        return true
    }
})

function requestFail(data) {
    if (data.data && data.data.error_description) {
        data.msg = data.data.error_description
    } else if (data.data && data.data.data && data.data.data.error_description) {
        data.msg = data.data.data.error_description
    }
    Toast.info("Error:" + data.status + ", " + data.msg)
    return Promise.reject(data)
}

api.interceptors.response.use(
    function (resp) {
        if (resp.status >= 300) {
            return requestFail(resp)
        }
        if (resp.data && resp.data.status && resp.data.status !== 200) {
            return requestFail(resp.data)
        }
        if (resp.data && resp.data.data) {
            resp.data = resp.data.data
        }
        return resp
    },
    function (error) {
        console.log(error)
    }
)

WebIM.api = api
WebIM.emoji = emoji
window.WebIM = WebIM;
export default WebIM
