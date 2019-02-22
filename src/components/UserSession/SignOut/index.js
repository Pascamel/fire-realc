import React, { Component } from 'react';

import { withFirebase } from '../../Firebase';

class SignOutLinkBase extends Component {
  render () {
    const { firebase } = this.props;

    return (
      <span onClick={firebase.doSignOut}>
        Sign Out
      </span>
    );
  }
}

class SignOutButtonBase extends Component {
  render () {
    const { firebase } = this.props;

    return (
      <button type="button" className="btn btn-primary btn-block" onClick={firebase.doSignOut}>
        Sign Out
      </button>
    );
  }
}

class SignOutPanel extends Component {
  render () {
    return (
      <div className="col-4">
        <div className="alert alert-secondary">
          <h4 className="alert-heading">See you soon!</h4>
          <SignOutButtonBase firebase={this.props.firebase} />
        </div>
      </div>
    );
  }
}

const SignOutButton = withFirebase(SignOutButtonBase)
const SignOutLink = withFirebase(SignOutLinkBase)

export { SignOutButton, SignOutLink };
export default withFirebase(SignOutPanel);