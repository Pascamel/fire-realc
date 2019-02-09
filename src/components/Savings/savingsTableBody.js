import React, { Component } from 'react';

// import FireAmount from '../FireAmount';
import Display from '../UI/Display';

class SavingsTableBody extends Component {
  constructor(props) {
    super(props);

    this.state = {collapsed: props.year_headers.collapsed[props.year]};

    this.handleClickToggle = this.handleClickToggle.bind(this);
  }

  handleClickToggle() {
    this.setState(state => ({
      collapsed: !state.collapsed
    }));
  }

  render() {
    const {savings, year, headersLine2, inputLine, bank} = this.props;
    
    return (
      <tbody>
        <tr>
          <td className={'td-chevron'}>
            <i className={`fa ${this.state.collapsed ? 'fa-chevron-right' : 'fa-chevron-down'}`} onClick={this.handleClickToggle}></i>
          </td>
          <td colSpan={headersLine2.length + 4} className={Display.hideIf(this.state.collapsed)}>
            <span className={'pull-left'} style={{paddingLeft: '10px'}}>
              { year }
            </span>
            <span>
              Begins at <b>{ bank.startOfYearAmount(year) }</b> -
              Goal is
              TODO1
              {/* <fire-amount type="year" id="year" institution="year_headers.goals" types="[]" class="'bold'"></fire-amount> */}
              ({ bank.monthlyGoal(year) }/mo)
            </span>
          </td>
          {inputLine.map((amount, idx) => (
          <td className={Display.showIf(this.state.collapsed)} key={idx}>
            { Display.amount(bank.totalInstitution(year, amount.id, amount.type), true) }
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
          <td className={`${Display.showIf(this.state.collapsed)} ${Display.goal(bank.goalYearToDate('12', this.props.year), 0)}`}>
            { Display.amount(bank.goalYearToDate('12', year), true) }
          </td>
        </tr>
        {Object.entries(savings[year]).map((month, idx) => (
        <tr key={idx} className={Display.hideIf(this.state.collapsed)}>
          <td>{ month[0] }</td>
          {inputLine.map((amount, idx) => (
          <td key={idx}>
            {/* <fire-amount type="amount.type" id="amount.id" institution="savings[year][month][amount.id]" types="amount.types"></fire-amount>*/}
            TODO2
          </td>
          ))}
          <td>{ Display.amount(bank.totalMonthSavings(month, year, 'T')) }</td>
          <td className={Display.showIf(bank.totalMonthSavings(month[0], year, 'T') === 0)} colSpan={3}></td>
          <td className={Display.hideIf(bank.totalMonthSavings(month[0], year, 'T') === 0)}>
            { Display.amount(bank.totalHolding(month[0], year)) }
          </td>
          <td className={`${Display.hideIf(bank.totalMonthSavings(month[0], year, 'T') === 0)} ${Display.goal(bank.goalMonth(month[0], this.props.year), 0)}`} >
            { Display.amount(bank.goalMonth(month[0], year), true) }
          </td>
          <td className={`${Display.hideIf(bank.totalMonthSavings(month[0], year, 'T') === 0)} ${Display.goal(bank.goalYearToDate(month[0], this.props.year), 0)}`} >
            { Display.amount(bank.goalYearToDate(month[0], year), true) }
          </td>
        </tr>
        ))}
        <tr className={`tr-total ${Display.hideIf(this.state.collapsed)}`}>
          <td><i className={'fa fa-calendar-plus-o'}></i></td>
          {inputLine.map((amount, idx) => (
          <td key={idx}>
            { Display.amount(bank.totalInstitution(year, amount.id, amount.type), true) }
          </td>
          ))}
          <td>Total</td>
          <td className={'table-warning'}>{ Display.amount(bank.totalHolding('12', year)) }</td>
          <td>Goal</td>
          <td className={Display.goal(bank.goalYearToDate('12', year), 0)}>
            { Display.amount(bank.goalYearToDate('12', year), true) }
          </td>
        </tr>
      </tbody>
    );
  }
}

export default SavingsTableBody;