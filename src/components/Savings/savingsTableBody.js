import React, { Component } from 'react';
import _ from 'lodash';

import Display from '../UI/Display';
import FireAmount from '../Finance/FireAmount';

class SavingsTableBody extends Component {
  constructor(props) {
    super(props);

    this.state = {collapsed: _.get(props.bank.savings_year_headers.collapsed, props.year, false)};
    this.handleClickToggle = this.handleClickToggle.bind(this);
  }

  handleClickToggle() {
    const newValue = !this.state.collapsed;
    this.setState({collapsed: newValue});
    this.props.callback('savings_year_headers', ['collapsed', this.props.year], newValue, false);
  }

  render() {
    const { year, bank, callback } = this.props;
    
    return (
      <tbody>
        <tr>
          <td className="td-chevron">
            <i className={`fa ${this.state.collapsed ? 'fa-chevron-right' : 'fa-chevron-down'}`} onClick={this.handleClickToggle}></i>
          </td>
          <td colSpan={bank.savingsInputs.length + 4} className={Display.hideIf(this.state.collapsed)}>
            <span className="pull-left" style={{paddingLeft: '10px'}}>
              { year }
            </span>
            <span>
              Begins at <b>{ bank.startOfYearAmount(year, true) }</b> - Goal is&nbsp;
              <FireAmount amount={_.get(bank.savings_year_headers, ['goals', year])}
                          extraClassName="bold"
                          display-decimals={bank.showDecimals}
                          callback-props={['savings_year_headers', 'goals', year]}
                          callback={callback} />
              &nbsp;({ bank.monthlyGoal(year, true) }/mo)
            </span>
          </td>
          {bank.savingsInputs.map((amount, idx) => (
          <td className={Display.showIf(this.state.collapsed)} key={idx}>
            { bank.totalInstitution(year, amount.id, amount.type, true) }
          </td>
          ))}
          <td className={Display.showIf(this.state.collapsed)}>
            Total
          </td>
          <td className={Display.showIf(this.state.collapsed)}>
            { bank.totalHolding('12', this.props.year, true) }
          </td>
          <td className={Display.showIf(this.state.collapsed)}>
            Goal
          </td>
          <td className={`${Display.showIf(this.state.collapsed)} ${Display.goal(bank.goalYearToDate('12', this.props.year, false), 0)}`}>
            { bank.goalYearToDate('12', year, true) }
          </td>
        </tr>
        {Object.entries(bank.savings[year]).map((month, idx) => (
        <tr key={idx} className={Display.hideIf(this.state.collapsed)}>
          <td>{ month[0] }</td>
          {bank.savingsInputs.map((amount, idx) => (
          <td key={idx}>
            {amount.type !== 'T' &&
            <FireAmount amount={_.get(month, [1, amount.id, amount.type])} 
                        display-decimals={bank.showDecimals}
                        callback-props={['savings', year, month[0], amount.id, amount.type]} 
                        callback={callback} />}
            {amount.type === 'T' && bank && bank.totalMonthInstitution(year, month[0], amount.id)}
          </td>
          ))}
          <td>{ bank.totalMonthSavings(month[0], year, 'T', true) }</td>
          <td className={Display.showIf(bank.totalMonthSavings(month[0], year, 'T', false) === 0)} colSpan={3}></td>
          <td className={Display.hideIf(bank.totalMonthSavings(month[0], year, 'T', false) === 0)}>
            { bank.totalHolding(month[0], year, true) }
          </td>
          <td className={`${Display.hideIf(bank.totalMonthSavings(month[0], year, 'T', false) === 0)} ${Display.goal(bank.goalMonth(month[0], this.props.year, false), 0)}`} >
            { bank.goalMonth(month[0], year, true) }
          </td>
          <td className={`${Display.hideIf(bank.totalMonthSavings(month[0], year, 'T', false) === 0)} ${Display.goal(bank.goalYearToDate(month[0], this.props.year, false), 0)}`} >
            { bank.goalYearToDate(month[0], year, true) }
          </td>
        </tr>
        ))}
        <tr className={`tr-total ${Display.hideIf(this.state.collapsed)}`}>
          <td><i className="fa fa-calendar-plus-o"></i></td>
          {bank.savingsInputs.map((amount, idx) => (
          <td key={idx}>
            { bank.totalInstitution(year, amount.id, amount.type, true) }
          </td>
          ))}
          <td>Total</td>
          <td className="table-warning">{ bank.totalHolding('12', year, true) }</td>
          <td>Goal</td>
          <td className={Display.goal(bank.goalYearToDate('12', year), 0)}>
            { bank.goalYearToDate('12', year, true) }
          </td>
        </tr>
      </tbody>
    );
  }
}

export default SavingsTableBody;