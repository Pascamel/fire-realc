import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
      <div className="col-4">
        <div className="alert alert-secondary">
          <h4 className="alert-heading">Password reset</h4>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <input name="email" value={this.state.email} onChange={this.onChange}
                className="form-control" type="text" placeholder="Email Address" />
            </div>
            <div className="form-group">
              <button className="btn btn-primary btn-block" disabled={isInvalid} type="submit">
                Reset My Password
              </button>
            </div>
            {error && <p>{error.message}</p>}
          </form>
        </div>
      </div>
    );
  }
}

const PasswordForgetPage = () => (
  <div className="container">
    <div className="row justify-content-center">
      <PasswordForgetForm />
    </div>
  </div>
);

const PasswordForgetLink = () => (
  <p>
    Forgot Password? <Link to={ROUTES.PASSWORD_FORGET}>Click here</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
