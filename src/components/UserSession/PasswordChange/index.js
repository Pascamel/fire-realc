import React, { Component } from 'react';

import { withFirebase } from '../../Firebase';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
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
    const { passwordOne, passwordTwo, error } = this.state;
    const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

    return (
      
      <div className={'col-4'}>
        <div className={'alert alert-secondary'}>
          <h4 className={'alert-heading'}>Password change</h4>
          <form onSubmit={this.onSubmit}>
            <div className={'form-group'}>
              <input name={'passwordOne'} value={passwordOne} onChange={this.onChange}
                className={'form-control'} type={'password'} placeholder={'New Password'} />
            </div>
            <div className={'form-group'}>
              <input name={'passwordTwo'} value={passwordTwo} onChange={this.onChange}
                className={'form-control'} type={'password'} placeholder={'Confirm New Password'} />
            </div>
            <div className={'form-group'}>
              <button className={'btn btn-primary btn-block'} disabled={isInvalid} type={'submit'}>
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

export default withFirebase(PasswordChangeForm);
