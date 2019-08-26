/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { func } from 'prop-types';

// Containers
import Home from '../js/containers/Home';
import Game from '../js/containers/Game';
import NameChange from '../js/containers/NameChange';
import Hiscores from '../js/containers/Hiscores';
import Menu from '../js/containers/Menu';

// Stores
import { auth } from '../js/store/index';

const Root = () => (
  <Router>
    <Switch>
      <Route path="/" component={Home} exact />
      <PrivateRoute path="/menu" component={Menu} exact />
      <PrivateRoute path="/game" component={Game} exact />
      <PrivateRoute path="/namechange" component={NameChange} exact />
      <PrivateRoute path="/highscores" component={Hiscores} exact />
    </Switch>
  </Router>
);

const PrivateRoute = ({ component: Component, ...rest }) => {
  if (auth.isAuthenticated) {
    return (
      <Route
        {...rest}
        render={props => {
          window.onbeforeunload =
            process.env.NODE_ENV === 'development' ? null : () => true;
          return <Component {...props} />;
        }}
      />
    );
  }

  if (process.env.NODE_ENV === 'development') {
    return (
      <Route
        {...rest}
        render={props => {
          window.onbeforeunload = null;
          return <Component {...props} />;
        }}
      />
    );
  }

  return <Route render={() => <Redirect to={`/`} />} />;
};

PrivateRoute.propTypes = {
  component: func.isRequired,
};

export default Root;
