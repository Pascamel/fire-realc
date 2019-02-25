import React, { Component } from 'react';
import _ from 'lodash';
import FireAmount from '../Finance/FireAmount';

class MonthIncome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      label: _(props.bank.incomeHeaders).keyBy('id').get([props.header.id, 'label'], 'N/A')
    };
  }
  
  render () {
    const { header, month, year, callback, data, bank } = this.props;

    return (
      <React.Fragment>
        <div className="month-amount">
          <span className="label-fake-input smaller mb-1">{this.state.label}</span>
          <div className="pull-right">
            <FireAmount amount={_.get(data, header.id)} 
                        extraClassName="label-fake-input"
                        display-if-zero="true"
                        display-decimals={bank.showDecimals}
                        callback-props={['income', year, month, 'income', header.id]} 
                        callback={callback} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MonthIncome;
