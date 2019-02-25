import React, { Component } from 'react';
import _ from 'lodash';
import FireAmount from '../Finance/FireAmount';
import FinanceHelpers from '../Finance/FinanceHelpers';


class MonthSavings extends Component {
  constructor (props) {
    super(props);

    const h = _(props.bank.savingsHeaders).keyBy('id').get([props.header.id], 'N/A');

    let header_label = h.label || 'N/A';
    if (h.sublabel) header_label += ' > ' + h.sublabel;
    if (h.interest) header_label += ' > ' + FinanceHelpers.labelSavings(props.header.type);

    this.state = {
      label: header_label
    }
  }

  render () {    
    const { header, month, year, callback, data, bank } = this.props;

    return (
      <React.Fragment>
        <div className="month-amount">
          <span className="label-fake-input smaller mb-1">{this.state.label}</span>
          <div className="pull-right">
            <FireAmount amount={_.get(data, [header.id, header.type])} 
                        extraClassName="label-fake-input"
                        display-if-zero="true"
                        display-decimals={bank.showDecimals}
                        callback-props={['savings', year, month, header.id, header.type]} 
                        callback={callback} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MonthSavings;
