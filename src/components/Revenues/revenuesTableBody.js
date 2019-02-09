import React, { Component } from 'react';
import _ from 'lodash';

import FireAmount from '../Finance/FireAmount';
import Bank from '../Finance/Bank';
import Display from '../UI/Display';

class RevenuesTableBody extends Component {
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
    const {income, headersLine, year, callback} = this.props;

    return (
      <tbody>
        <tr>
          <td className={'td-chevron'}>
            <i className={"fa " + (this.state.collapsed ? 'fa-chevron-right' : 'fa-chevron-down')} onClick={this.handleClickToggle}></i>
          </td>
          <td className={this.state.collapsed ? 'hidden' : ''} colSpan={headersLine.length + 4}>
            <span className={'pull-left'} style={{paddingLeft: '10px'}}>
              { year }
            </span>
          </td>
          <td className={this.state.collapsed ? '' : 'hidden'}>
            { Bank.yearlySavings(income, year) }
          </td>
          {headersLine.map((header) => (
          <td key={header.id} className={this.state.collapsed ? '' : 'hidden'}>
            { Bank.yearlyIncome(income, year, header) }
          </td>
          ))}
          <td className={this.state.collapsed ? '' : 'hidden'}>{ Bank.totalYearPost(income, headersLine, year) }</td>
          <td className={this.state.collapsed ? '' : 'hidden'}>{ Bank.totalYearPre(income, headersLine, year) }</td>
          <td className={this.state.collapsed ? '' : 'hidden'}>
            { Display.percentage(Bank.savingRateYear(income, headersLine, year) * 100) }
          </td> 
        </tr> 

        {Object.entries(income[year]).map((month) => (
        <tr className={this.state.collapsed ? 'hidden' : '' } key={month[0]}>
          <td>{ month[0] }</td>
          <td>{ Display.amount(month[1].savings) }</td>
          {headersLine.map((header) => (
          <td key={year + '-' + month[0] + '-' + header.id}>
            <FireAmount amount={(month[1].income || {})[header.id]} 
                        callback-props={['income', year, month[0], 'income', header.id]} 
                        callback={callback} />
          </td>
          ))}
          <td className={Bank.totalMonth(income, headersLine, year, month[0]) === 0 ? '' : 'hidden'} colSpan={3}></td>
          <td className={Bank.totalMonth(income, headersLine, year, month[0]) === 0 ? 'hidden' : ''}>
            { Bank.totalMonthPost(income, headersLine, year, month[0]) }
          </td>
          <td className={Bank.totalMonth(income, headersLine, year, month[0]) === 0 ? 'hidden' : ''}>
            { Bank.totalMonthPre(income, headersLine, year, month[0]) }
          </td>
          <td className={`${Bank.totalMonth(income, headersLine, year, month[0]) === 0 ? 'hidden' : ''} ${Display.goal(Bank.savingRateMonth(income, headersLine, year, month[0]), 0.5)}`}>            
            { Bank.savingRateMonth(income, headersLine, year, month[0], true) }
          </td> 
        </tr>
        ))}

        <tr className={this.state.collapsed ? 'hidden' : '' }>
          <td><i className={'fa fa-calendar-plus-o'}></i></td>
          <td>{ Bank.yearlySavings(income, year) }</td>
          {headersLine.map((h) => (
          <td key={h.id}>{ Bank.yearlyIncome(income, year, h) }</td>
          ))}
          <td>{ Bank.totalYearPost(income, headersLine, year) }</td>
          <td>{ Bank.totalYearPre(income, headersLine, year) }</td>
          <td className={Display.goal(Bank.savingRateYear(income, headersLine, year), 0.5)}>
            { Display.percentage(Bank.savingRateYear(income, headersLine, year) * 100) }
          </td>
        </tr>
      </tbody>
    );
  }
};

export default RevenuesTableBody;