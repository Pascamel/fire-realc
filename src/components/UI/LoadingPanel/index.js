import React, { Component } from 'react';

class FireAmount extends Component {
  render() {
    return (
      <div className="col-xs-12 loading-spinner" ng-show="loaded">
        <div className="fa fa-spinner fa-spin">
        </div>
      </div>
    )
  };
}

export default FireAmount;