import * as React from 'react';
import { Route,  Redirect} from 'react-router-dom';
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
            ? <Redirect to="/login" />
            : <route.component {...props} routes={route.routes} />
        }
      </div>)
    }}
  />
);
export default RouteWithSubRoutes;
