// sampleReducer.js
import { createActions, createReducer } from 'reduxsauce'


const Types = {
    SHOW_TAB: 'SHOW_TAB',
    HIDDEN_TAB: 'HIDDEN_TAB',
}
 
// the initial state of this reducer
export const INITIAL_STATE = { tabBarHidden: false }
 
// the eagle has landed
export const showTab = (state = INITIAL_STATE, action) => {
  return { ...state, tabBarHidden: false }
}
 
// uh oh
export const hiddenTab = (state = INITIAL_STATE, action) => {
  return { ...state, tabBarHidden: true  }
}
 
// map our action types to our reducer functions
export const HANDLERS = {
  [Types.SHOW_TAB]: showTab,
  [Types.HIDDEN_TAB]: hiddenTab
}


export const reducer = createReducer(INITIAL_STATE, HANDLERS);

const { types, Creators } = createActions({
  showTab: null,
  hiddenTab: null,
}, {}) // options - the 2nd parameter is optional


export default Creators;