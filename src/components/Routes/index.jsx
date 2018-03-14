import * as React from 'react';
import { Switch, BrowserRouter as Router, Redirect } from 'react-router-dom'
import RouteWithSubRoutes from '../RouteWithSubRoutes/';
import Home from '@pages/Home/index';

const routes = [
    {
      path: '/explore',
      component: Home,
      title: '首页',
      needAuth: false,
    },
    {
      path: '/hall',
      component: Home,
      title: '大厅',
      needAuth: false,
    },
    {
      path: '/message',
      component: Home,
      title: '消息',
      needAuth: false,
    },
    {
      path: '/contacts',
      component: Home,
      title: '通讯录',
      needAuth: false,
    },
    {
      path: '/my',
      component: Home,
      title: '个人中心',
      needAuth: false,
    },
];
export default () => (
  <Router>
    <Switch>
      {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
      <Redirect from="/" to="/explore" />
    </Switch>
  </Router>
  )