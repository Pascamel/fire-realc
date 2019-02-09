import React, { Component } from 'react';

class LoadingPanel extends Component {
  render() {
    return (
      <div className={'col-xs-12 loading-spinner'}>
        <div className={'fa fa-spinner fa-spin'}>
        </div>
      </div>
    )
  };
}

export default LoadingPanel;
