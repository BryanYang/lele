import { createSelector } from "reselect"
import _ from "lodash"

const chatType = {
    chat: "chat",
    group: "groupchat",
    chatroom: "chatroom",
    stranger: "stranger"
}

const getTabMessageArray = (state, props) => {
    const [ blank, selectTab, selectItem] = props.match.url.split('/');
    console.log(_.get(state, [ "entities", "message"]))
    return _.get(state, [ "entities", "message", chatType[selectTab], selectItem ])
}


const getTabMessages = createSelector(
    [ getTabMessageArray ],
    (TabMessageArray) => {
        console.log("getTabMessages", TabMessageArray)
        return TabMessageArray
    }
)

export default getTabMessages