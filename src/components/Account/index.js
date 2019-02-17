import React from 'react';

import { AuthUserContext, withAuthorization } from '../UserSession/Session';
import { PasswordForgetForm } from '../UserSession/PasswordForget';
import PasswordChangeForm from '../UserSession/PasswordChange';
import SignOutButton from '../UserSession/SignOut';

const AccountPage = () => (
  
  <AuthUserContext.Consumer>
    {(authUser) => (
      <div className={'container'}>
        <div className={'row'}>
          <div className={'col'}>
            <h1>Account: {authUser.email}</h1>
          </div>
        </div>
        <div className={'row'}>
          <PasswordForgetForm />
          <PasswordChangeForm />
          <SignOutButton />
        </div>
      </div>
    )}
  </AuthUserContext.Consumer>
);

export default withAuthorization(authUser => !!authUser)(AccountPage);
