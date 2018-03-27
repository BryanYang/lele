
import React from 'react';
import { List, NavBar } from 'antd-mobile';
import { connect } from "react-redux"
import { Switch, Route, Link } from 'react-router-dom';

import MySet from './set';
import Log from './log';

const Item = List.Item;

const Home = () => (<div className="set-home">
    <NavBar
      mode="dark"
    >我</NavBar>
    <List className="my-list">
      <Item arrow="horizontal"><Link to="/my/log"><div>操作记录</div></Link></Item>
    </List>

    <List  className="my-list2">
      <Item arrow="horizontal" className="set-btn"><Link to="/my/set"><div>设置</div></Link></Item>
    </List>

  </div>
)

const My = (props) => (
    <Switch>
      <Route path="/my/set" exact component={MySet} {...props} />
      <Route path="/my/log" exact component={Log} {...props} />
      <Route exact component={Home} />
    </Switch>
)




export default connect(
  ({ }) => ({
  }),
  dispatch => ({
  })
)(My)