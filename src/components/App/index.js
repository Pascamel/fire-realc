import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import HomePage from '../Home';
import SignUpPage from '../UserSession/SignUp';
import SignInPage from '../UserSession/SignIn';
import PasswordForgetPage from '../UserSession/PasswordForget';
import DashboardPage from '../Dashboard';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import HeadersPage from '../Headers';
import RevenuesPage from '../Revenues';
import SavingsPage from '../Savings';
import MonthPage from '../Month';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../UserSession/Session';


const App = () => (
  <div className="container">
    <div className="col-xs">
      <Router>
        <div>
          <Navigation />
          <hr />
          <Route exact path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route path={ROUTES.DASHBOARD} component={DashboardPage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
          <Route path={ROUTES.HEADERS} component={HeadersPage} />
          <Route path={ROUTES.REVENUES} component={RevenuesPage} />
          <Route path={ROUTES.SAVINGS} component={SavingsPage} />
          <Route path={ROUTES.MONTH} component={MonthPage} />
        </div>
      </Router>
    </div>
  </div>
);

export default withAuthentication(App);
