import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import * as ROLES from '../../../constants/roles';

const INITIAL_STATE = {
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.setUser(authUser.user.uid, {
          email,
          type: ROLES.USER
        });
      })
      .then((authUser) => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.DASHBOARD);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '';

    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-4">
            <div className="alert alert-secondary">
              <h4 className="alert-heading">Sign Up</h4>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input name="email" value={email} onChange={this.onChange}
                    className="form-control" type="text" placeholder="Email Address" />
                </div>
                <div className="form-group">
                  <input name="passwordOne" value={passwordOne} onChange={this.onChange}
                    className="form-control" type="password" placeholder="Password" />
                </div>
                <div className="form-group">
                  <input name="passwordTwo" value={passwordTwo} onChange={this.onChange}
                    className="form-control" type="password" placeholder="Confirm Password" />
                </div>
                <div className="form-group">
                  <button className="btn btn-primary btn-block" disabled={isInvalid} type="submit">
                    Sign Up
                  </button>
                </div>

                {error && <p>{error.message}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
      
    );
  }
}

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

class SignUpLink extends Component {
  render () {
    return (
      <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
      </p>
    );
  }
}

class SignUpPage extends Component {
  render () {
    return (
      <div>
        <SignUpForm />
      </div>
    );
  }
}

export default SignUpPage;

export { SignUpForm, SignUpLink };