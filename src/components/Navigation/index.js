import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';


const Navigation = ({ authUser }) => (
  <div>
    <AuthUserContext.Consumer>
      {authUser => authUser ? <NavigationAuth /> : <NavigationNonAuth />}
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <div className={'container'}>
    <div className={'row'}>
      <div className={'col-sm'}>
        <ul className={'nav'}>
          <li className={'nav-item'}>
            <Link to={ROUTES.LANDING} className={'nav-link'}>Landing</Link>
          </li>
          <li className={'nav-item'}>
            <Link to={ROUTES.HOME} className={'nav-link'}>Home</Link>
          </li>
          <li className={'nav-item'}>
            <Link to={ROUTES.ACCOUNT} className={'nav-link'}>Account</Link>
          </li>
          <li className={'nav-item'}>
            <Link to={ROUTES.ADMIN} className={'nav-link'}>Admin</Link>
          </li>
          <li className={'nav-item'}>
            <Link to={ROUTES.REVENUES} className={'nav-link'}>Revenues</Link>
          </li>
          <li className={'nav-item'}>
            <Link to={ROUTES.SAVINGS} className={'nav-link'}>Savings</Link>
          </li>
        </ul>
      </div>
      <div className={'col-sm-3'}>
        <ul className={'nav justify-content-end'}>
          <li className={'nav-item'}>
            <SignOutButton />
          </li>
        </ul>
      </div>
    </div>
  </div>
  
);

const NavigationNonAuth = () => (
  <div className={'container'}>
    <div className={'row'}>
      <div className={'col-sm'}>
        <ul className={'nav'}>
          <li className={'nav-item'}>
            <Link to={ROUTES.LANDING} className={'nav-link'}>Landing</Link>
          </li>
          <li className={'nav-item'}>
            <Link to={ROUTES.SIGN_IN} className={'nav-link'}>Sign In</Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default Navigation;