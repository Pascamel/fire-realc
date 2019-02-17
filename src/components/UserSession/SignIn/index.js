import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../../UserSession/SignUp';
import { PasswordForgetLink } from '../../UserSession/PasswordForget';
import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase.doSignInWithEmailAndPassword(email, password).then(() => {
      this.setState({ ...INITIAL_STATE });
      this.props.history.push(ROUTES.DASHBOARD);
    }).catch(error => {
      this.setState({ error });
    });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';

    return (
      <div className={'container'}>
        <div className={'row justify-content-center'}>
          <div className={'col-4'}>
            <div className={'alert alert-secondary'}>
              <h4 className={'alert-heading'}>Login</h4>
              <form onSubmit={this.onSubmit}>
                <div className={'form-group'}>
                  <input name={'email'} value={email} onChange={this.onChange} 
                         className={'form-control'} type={'text'} placeholder={'Email Address'} />
                </div>
                <div className={'form-group'}>
                  <input name={'password'} value={password} onChange={this.onChange} 
                         className={'form-control'} type={'password'} placeholder={'Password'} />
                </div>
                <div className={'form-group'}>
                  <button className={'btn btn-primary btn-block'} disabled={isInvalid} type={'submit'}>Sign In</button>
                </div>

                {error && <p>{error.message}</p>}

                <div className={'form-group'}>
                  <SignUpLink />
                  <PasswordForgetLink />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

class SignInPage extends Component {
  render() {
    return (
      <div>
        <SignInForm />
      </div>
    );
  }
}

export default SignInPage;
