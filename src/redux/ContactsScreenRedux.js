// @flow

import { createReducer, createActions } from "reduxsauce";
import { Toast } from 'antd-mobile'
const userController = require("@apis/controller")("user");

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setContacts: ["myContacts"],
  setApplyList: ["applyList"],
  passApply: ['id'],
  queryContacts: () => {
    return (dispatch, getState) => {
      userController("friendList").then((res) => {
        if(res.code !== 0){
          Toast.info(res.msg);
        } else {
          dispatch(Creators.setContacts(res.data.userVos)) 
        }
      });
    };
  },
  queryApply: () => {
    return (dispatch, getState) => {
      userController("applyAddFriendList").then((res) => {
        if(res.code !== 0) {
          Toast.info(res.msg); 
        } else dispatch(Creators.setApplyList(res.data.userFirendApplyVos)) 
      });
    };
  },
  applyPass: (id) => {
    return (dispatch, getState) => {
      userController("applyPass", { id, client: 'web' }).then(res => {
        dispatch(Creators.queryContacts());
        Toast.info('添加好友成功');
      });
    }; 
  }
});


/* ------------- Initial State ------------- */
export const INITIAL_STATE = { myContacts: [], applyList: [] };

export const setContacts = (state = INITIAL_STATE, { myContacts }) => {
  return { ...state, myContacts };
};

export const setApplyList = (state, { applyList }) => {
  return { ...state, applyList };
};

/* ------------- Reducers ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_CONTACTS]: setContacts,
  [Types.SET_APPLY_LIST]: setApplyList
});

export default Creators;