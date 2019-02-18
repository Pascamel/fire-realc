import React, { Component } from 'react';

import { withFirebase } from '../../Firebase';

class SignOutButton extends Component {
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
          <SignOutButton firebase={this.props.firebase} />
        </div>
      </div>
    );
  }
}

export default withFirebase(SignOutPanel);