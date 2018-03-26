import * as React from 'react';
import { Route } from 'react-router-dom';
import Login from '@components/Login/index';
import {isLogin} from '@/utils/index';
 
const RouteWithSubRoutes = route => (
  <Route
    path={route.path}
    exact={route.exact}
    render={(props) => {
      document.title = route.title;
      return (<div id="main">
        {
          route.needAuth && !isLogin()
            ? <Login {...props}/>
            : <route.component {...props} routes={route.routes} />
        }
      </div>)
    }}
  />
);
export default RouteWithSubRoutes;
