/* eslint-disable */
import "script-loader!easemob-websdk/dist/strophe-1.2.8.js"
/* eslint-enable */
import WebIM from "easemob-websdk"
import config from "./config"
import emoji from "./emoji"
import Api from "axios"
import { Toast } from "antd-mobile"
import loglevel from "./loglevel"
import code from './status';


console = console || {}

console.group = console.group || function () {}
console.groupEnd = console.groupEnd || function () {}

// init DOMParser / document for strophe and sdk

WebIM.statusCode= code;
WebIM.config = config || {};

WebIM.loglevel = loglevel
// replace all console.log with loglevel.info
// console.log = loglevel.info

WebIM.conn = new WebIM.connection({
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
