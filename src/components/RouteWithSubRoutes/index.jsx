import * as React from 'react';
import { Route } from 'react-router-dom';

const RouteWithSubRoutes = route => (
  <Route
    path={route.path}
    exact={route.exact}
    render={(props) => {
      document.title = route.title;
      console.log(props)
      return (<div id="main">
        {
          route.needAuth 
            ? <span {...props} />
            : <route.component {...props} routes={route.routes} />
        }
      </div>)
    }}
  />
);
export default RouteWithSubRoutes;
