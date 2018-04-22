import * as React from 'react';
import { Switch, HashRouter as Router, Redirect, withRouter } from 'react-router-dom'
import { connect } from "react-redux"
import RouteWithSubRoutes from '../RouteWithSubRoutes/';
import Home from '@pages/Home/index';
import Article from '@pages/Explore/article';
import Game from '@pages/Hall/game';
import Players from '@pages/Hall/players';
import Service from '@pages/Hall/service';
import Table from '@pages/Hall/table';
import Chat from '@pages/Message/chat';
import CreateGroup from '@pages/Message/createGroup';
import GroupDetail from '@pages/Message/groupDetail';
import Register from '@components/Login/register'
import Login from '@components/Login/index'
import utils from '@/utils';
import LoginActions from "@/redux/LoginRedux"

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
      exact: true,
      title: '消息',
      needAuth: true,
    },
    {
      path: '/message/createGroup',
      component: CreateGroup,
      exact: true, 
      title: '创建群聊',
      needAuth: true,
    },
    {
      path: '/message/groupDetail/:id',
      component: GroupDetail,
      exact: true, 
      title: '聊天详情',
      needAuth: true,
    },
    {
      path: '/contacts',
      component: Home,
      title: '通讯录',
      needAuth: false,
    },
    {
      path: '/game/:id',
      component: Game,
      title: '游戏厅',
      needAuth: true,
    },
    {
      path: '/players/:id',
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
      path: '/table/:id',
      component: Table,
      title: '下注表',
      needAuth: true,
    },
    {
      path: '/chat/:id',
      component: Chat,
      title: '消息',
      needAuth: true,
    },
    {
      path: '/my',
      component: Home,
      title: '我的',
      needAuth: true,
    },
    {
      path: '/register',
      component: Register,
      title: '注册',
      needAuth: false,
    },
    {
      path: '/login',
      component: Login,
      title: '登录',
      needAuth: false,
    },
]; 

class App extends React.Component {
  constructor() {
    super()
    this.state = {
        hasToken: utils.hasToken() && utils.getUserName()
    }
  }

  componentDidMount(){
      // 1. check user auth by cookie
      const { hasToken } = this.state
      const { loginByToken } = this.props
      if (hasToken) {
          loginByToken(utils.getUserName(), utils.getToken())
      }
  }

  render(){
    return <Router>
      <Switch>
        {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
        <Redirect from="/" to="/explore" />
      </Switch>
    </Router>
  }
}

export default 
  connect(
      ({ breakpoint, login }) => ({
          breakpoint,
          token: login.token,
          isLogin: login.isLogin,
          isLoading: login.fetching
      }),
      dispatch => ({
          loginByToken: (username, token) => dispatch(LoginActions.loginByToken(username, token))
      })
  )(App)