import React from 'react';

import { AuthUserContext, withAuthorization } from '../UserSession/Session';
import { PasswordForgetForm } from '../UserSession/PasswordForget';
import PasswordChangeForm from '../UserSession/PasswordChange';
import SignOutButton from '../UserSession/SignOut';

const AccountPage = () => (
  
  <AuthUserContext.Consumer>
    {(authUser) => (
      <div>
        <h1>Account: {authUser.email}</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
        <SignOutButton />
      </div>
    )}
  </AuthUserContext.Consumer>
);

export default withAuthorization(authUser => !!authUser)(AccountPage);
