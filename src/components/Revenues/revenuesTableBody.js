import React, { Component } from 'react';
import _ from 'lodash';
import FireAmount from '../Finance/FireAmount';
import Display from '../UI/Display';

class RevenuesTableBody extends Component {
  constructor(props) {
    super(props);

    this.state = {collapsed: _.get(props.bank.year_headers.collapsed, props.year, false)};

    this.handleClickToggle = this.handleClickToggle.bind(this);
  }

  handleClickToggle() {
    this.setState(state => ({
      collapsed: !state.collapsed
    }));
  }

  render() {
    const {year, bank, callback} = this.props;

    return (
      <tbody>
        <tr>
          <td className="td-chevron">
            <i className={"fa " + (this.state.collapsed ? 'fa-chevron-right' : 'fa-chevron-down')} onClick={this.handleClickToggle}></i>
          </td>
          <td className={Display.hideIf(this.state.collapsed)} colSpan={bank.incomeHeaders.length + 4}>
            <span className="pull-left" style={{paddingLeft: '10px'}}>
              { year }
            </span>
          </td>
          <td className={Display.showIf(this.state.collapsed)}>
            { bank.yearlySavings(year) }
          </td>
          {bank.incomeHeaders.map((header) => (
          <td key={header.id} className={Display.showIf(this.state.collapsed)}>
            { bank.yearlyIncome(year, header) }
          </td>
          ))}
          <td className={Display.showIf(this.state.collapsed)}>
            { bank.totalYearPost(year) }
          </td>
          <td className={Display.showIf(this.state.collapsed)}>
            { bank.totalYearPre(year) }
          </td>
          <td className={Display.showIf(this.state.collapsed)}>
            { Display.percentage(bank.savingRateYear(year) * 100) }
          </td> 
        </tr> 

        {Object.entries(bank.income[year]).map((month) => (
        <tr className={Display.hideIf(this.state.collapsed)} key={month[0]}>
          <td>{ month[0] }</td>
          <td>{ Display.amount(month[1].savings) }</td>
          {bank.incomeHeaders.map((header) => (
          <td key={year + '-' + month[0] + '-' + header.id}>
            <FireAmount amount={(month[1].income || {})[header.id]} 
                        callback-props={['income', year, month[0], 'income', header.id]} 
                        callback={callback} />
          </td>
          ))}
          <td className={Display.showIf(bank.totalMonthIncome(year, month[0]) === 0)} colSpan={3}></td>
          <td className={Display.hideIf(bank.totalMonthIncome(year, month[0]) === 0)}>
            { bank.totalMonthPost(year, month[0]) }
          </td>
          <td className={Display.hideIf(bank.totalMonthIncome(year, month[0]) === 0)}>
            { bank.totalMonthPre(year, month[0]) }
          </td>
          <td className={`${Display.hideIf(bank.totalMonthIncome(year, month[0]) === 0)} ${Display.goal(bank.savingRateMonth(year, month[0]), 0.5)}`}>
            { bank.savingRateMonth(year, month[0], true) }
          </td> 
        </tr>
        ))}

        <tr className={Display.hideIf(this.state.collapsed)}>
          <td><i className="fa fa-calendar-plus-o"></i></td>
          <td>{ bank.yearlySavings(year) }</td>
          {bank.incomeHeaders.map((h) => (
          <td key={h.id}>{ bank.yearlyIncome(year, h) }</td>
          ))}
          <td>{ bank.totalYearPost(year) }</td>
          <td>{ bank.totalYearPre(year) }</td>
          <td className={Display.goal(bank.savingRateYear(year), 0.5)}>
            { Display.percentage(bank.savingRateYear(year) * 100) }
          </td>
        </tr>
      </tbody>
    );
  }
};

export default RevenuesTableBody;