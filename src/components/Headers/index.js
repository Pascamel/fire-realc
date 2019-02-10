import React, { Component } from 'react';
import { compose } from 'recompose';

import { withAuthorization } from '../UserSession/Session';
import { withFirebase } from '../Firebase';

class HeadersPage extends Component {
  render () {
    return (
      <span>Headers</span>
    );
  }
}

export default compose(
  withAuthorization((authUser) => !!authUser),
  withFirebase,
)(HeadersPage);
