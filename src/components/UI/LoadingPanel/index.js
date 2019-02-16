import React, { Component } from 'react';

class LoadingPanel extends Component {
  render() {
    return (
      <div className={'loading-spinner'}>
        <div className={'fa fa-spinner fa-spin'}>
        </div>
      </div>
    )
  };
}

export default LoadingPanel;
