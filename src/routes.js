import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import { history } from './store';

import MainLayout from './layouts/main-layout';

const routes = (
  <ConnectedRouter history={history}>
    <Switch>
      <Route exact path="/" component={MainLayout} />
    </Switch>
  </ConnectedRouter>
);

export default routes;
