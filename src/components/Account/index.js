import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { AuthUserContext, withAuthorization } from '../UserSession/Session';
import { PasswordForgetForm } from '../UserSession/PasswordForget';
import PasswordChangeForm from '../UserSession/PasswordChange';
import SignOutPanel from '../UserSession/SignOut';

const AccountPage = () => (
  
  <AuthUserContext.Consumer>
    {(authUser) => (
      <Container>
        <Row>
          <Col>
            <h1>Account: {authUser.email}</h1>
          </Col>
        </Row>
        <Row>
          <PasswordForgetForm />
          <PasswordChangeForm />
          <SignOutPanel />
        </Row>
      </Container>
    )}
  </AuthUserContext.Consumer>
);

export default withAuthorization(authUser => !!authUser)(AccountPage);
