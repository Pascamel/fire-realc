import React from 'react';

import { AuthUserContext, withAuthorization } from '../UserSession/Session';
import { PasswordForgetForm } from '../UserSession/PasswordForget';
import PasswordChangeForm from '../UserSession/PasswordChange';

const AccountPage = () => (
  
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account: {authUser.email}</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
