import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Info} from './pages/Info';
import {Graph} from './pages/Graph';
import {Authpage} from './pages/Authpage';
import {Registerpage} from './pages/Registerpage';

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/information" exact>
          <Info />
        </Route>
        <Route path="/graph" exact>
          <Graph />
        </Route>
        <Redirect to="/information"/>
      </Switch>
    )
  };

  if(!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" exact>
          <Authpage />
        </Route>
        <Route path="/register" exact>
          <Registerpage />
        </Route>
        <Redirect to="/" />
      </Switch>
    )
  };
};
