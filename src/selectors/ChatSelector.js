import { createSelector } from "reselect"
import _ from "lodash"
import qs from "query-string";

const chatType = {
    chat: "chat",
    group: "groupchat",
    chatroom: "chatroom",
    stranger: "stranger"
}

const getTabMessageArray = (state, props) => {
    const queryStrings = qs.parse(props.location.search);
    // console.log(props.match);
    const [ blank, selectTab, selectItem] = props.match.url.split('/');
    console.log(_.get(state, ['entities', 'message']));
    if(queryStrings.type === 'groupchat') {
        const gid = props.match.params.id;
        return _.get(state, [ "entities", "message", queryStrings.type, Number(gid) ])
    } else if(queryStrings.type === 'chatroom') {
        const gid = queryStrings.groupId;
        // const group = _.get(state, [ "entities", "message", 'groupchat', Number(gid) ]) || [];
        return _.get(state, [ "entities", "message", queryStrings.type, Number(gid) ])
    } else if(queryStrings.type === 'stranger'){
      return _.get(state, [ "entities", "message", queryStrings.type,  selectItem])
    }
    return _.get(state, [ "entities", "message", chatType[selectTab], selectItem ])
}


const getTabMessages = createSelector(
    [ getTabMessageArray ],
    (TabMessageArray) => {
        // console.log("getTabMessages", TabMessageArray)
        return TabMessageArray
    }
)

export default getTabMessages