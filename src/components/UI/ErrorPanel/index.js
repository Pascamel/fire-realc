import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../../constants/routes';
import * as ERRORS from '../../../constants/errors';

class ErrorPanel extends Component {
  render() {
    const {code} = this.props;

    let content = 'An error has occurred, please try again later';

    if (code === ERRORS.NO_HEADERS) content = (
      <div>
        Your headers have not been created yet.&nbsp;
        <Link to={ROUTES.HEADERS} className="alert-link">Settings</Link>
      </div>
    );

    if (code === ERRORS.NOT_AUTHORIZED) content = (
      <div>
        You are not authorized to view this content
      </div>
    );

    return (
      <div className="alert alert-danger">
        {content}
      </div>
    )
  }
}

export default ErrorPanel;
