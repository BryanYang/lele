import * as React from 'react';
import { Switch, HashRouter as Router, Redirect } from 'react-router-dom'
import RouteWithSubRoutes from '../RouteWithSubRoutes/';
import Home from '@pages/Home/index';
import Article from '@pages/Explore/article';
import Game from '@pages/Hall/game';
import Players from '@pages/Hall/players';
import Service from '@pages/Hall/service';
import Table from '@pages/Hall/table';

const routes = [
    {
      path: '/explore',
      component: Home,
      title: '首页',
      needAuth: false,
    },
    {
      path: '/article/:id',
      component: Article,
      title: '详情',
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
    {
      path: '/game',
      component: Game,
      title: '游戏厅',
      needAuth: false,
    },
    {
      path: '/players',
      component: Players,
      title: '玩家',
      needAuth: false,
    },
    {
      path: '/service',
      component: Service,
      title: '客服',
      needAuth: false,
    },
    {
      path: '/table',
      component: Table,
      title: '下注表',
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