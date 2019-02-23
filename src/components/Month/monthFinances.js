import React, {Component} from 'react';
import _ from 'lodash';
import MonthSavings from './monthSavings';
import MonthIncome from './monthIncome';

class MonthFinances extends Component {
  render() {
    const { month, year, bank, callbackSavings, callbackIncome } = this.props;

    return (
      <React.Fragment>
        <div className="col">
          {this.props.savingsInputs.map((header, key) => (
            <MonthSavings key={key} 
                          header={header}
                          data={_.get(bank.savings, [year, month])}
                          callback={callbackSavings}
                          {...this.props} />
          ))}
        </div>
        <div className="col">
          {this.props.headersLine.map((header, key) => (
            <MonthIncome key={key} 
                         header={header} 
                         data={_.get(bank.income, [year, month, 'income'])} 
                         callback={callbackIncome} 
                         {...this.props} />
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default MonthFinances;
