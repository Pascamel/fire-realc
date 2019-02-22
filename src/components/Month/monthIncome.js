import React, { Component } from 'react';
import _ from 'lodash';
import FireAmount from '../Finance/FireAmount';

class MonthIncome extends Component {
  render () {
    const { header, month, year, callback, data } = this.props;

    return (
      <React.Fragment>
        <div className="month-amount">
          <span className="label-fake-input smaller">Title Tile title</span>
          <div className="pull-right pt-2">
            <FireAmount amount={_.get(data, header.id)} 
                        callback-props={['income', year, month, 'income', header.id]} 
                        callback={callback} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MonthIncome;