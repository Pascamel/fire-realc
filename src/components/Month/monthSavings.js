import React, { Component } from 'react';
import _ from 'lodash';
import FireAmount from '../Finance/FireAmount';


class MonthSavings extends Component {
  render () {
    const { header, month, year, callback, data } = this.props;

    return (
      <React.Fragment>
        <div className="month-amount">
          <span className="label-fake-input smaller">Title</span>
          <div className="pull-right pt-2">
            <FireAmount amount={_.get(data, [header.id, header.type])} 
                        callback-props={['savings', year, month, header.id, header.type]} 
                        callback={callback} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MonthSavings;
