import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../UserSession/Session';


class NavigationAuth extends Component {
  render () {

    const

    currentYear = new Date().getFullYear(),
      currentMonth = new Date().getMonth() + 1,
      route = ROUTES.MONTH.replace(':year', currentYear).replace(':month', currentMonth);

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm">
            <ul className="nav">
              <li className="nav-item">
                <NavLink to={ROUTES.DASHBOARD} className="nav-link" activeClassName="disabled">Dashboard</NavLink>
              </li>  
              <li className="nav-item">
                <NavLink exact to={route} className="nav-link" activeClassName="disabledd">Month</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={ROUTES.REVENUES} className="nav-link" activeClassName="disabled">Revenues</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={ROUTES.SAVINGS} className="nav-link" activeClassName="disabled">Savings</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={ROUTES.HEADERS} className="nav-link" activeClassName="disabled">Settings</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={ROUTES.ADMIN} className="nav-link" activeClassName="disabled">Admin</NavLink>
              </li>
            </ul>
          </div>
          <div className="col-sm-3">
            <ul className="nav justify-content-end">
              <li className="nav-item">
                <NavLink to={ROUTES.ACCOUNT} className="nav-link" activeClassName="disabled">
                  My account <i className="fa fa-caret-down"></i>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

class NavigationNonAuth extends Component {
  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm">
            <ul className="nav">
              <li className="nav-item">
                <NavLink to={ROUTES.HOME} className="nav-link" activeClassName="disabled">FiReCalc</NavLink>
              </li>
            </ul>
          </div>
          <div className="col-sm">
            <ul className="nav justify-content-end">
              <li className="nav-item">
                <NavLink to={ROUTES.SIGN_IN} className="nav-link" activeClassName="disabled">Sign In</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

class Navigation extends Component {
  render () {
    // const { authUser } = this.props;
    return (
      <div>
       <AuthUserContext.Consumer>
         {(authUser) => authUser ? <NavigationAuth /> : <NavigationNonAuth />}
       </AuthUserContext.Consumer>
     </div>
    );
  }
}

export default withRouter(Navigation);