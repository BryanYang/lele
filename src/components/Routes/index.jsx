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
import My from '@pages/My/index';
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
      title: '消息',
      needAuth: true,
    },
    {
      path: '/contacts',
      component: Home,
      title: '通讯录',
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
      console.log(utils.hasToken())
      if (hasToken) {
        console.log(222)
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