import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../UserSession/SignUp';
import SignInPage from '../UserSession/SignIn';
import PasswordForgetPage from '../UserSession/PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import RevenuesPage from '../Revenues';
import SavingsPage from '../Savings';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../UserSession/Session';


const App = () => (
  <div className={'container'}>
    <div className={'col-xs'}>
      <Router>
        <div>
          <Navigation />

          <hr />

          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />

          <Route path={ROUTES.REVENUES} component={RevenuesPage} />
          <Route path={ROUTES.SAVINGS} component={SavingsPage} />
        </div>
      </Router>
    </div>
  </div>
);

export default withAuthentication(App);
