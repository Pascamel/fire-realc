import React, { Component } from 'react';
import _ from 'lodash';

import FireAmount from '../FireAmount';
import Display from '../Utilities/Display';

class RevenuesTableBody extends Component {
  constructor(props) {
    super(props);

    this.state = {collapsed: props.year_headers.collapsed[props.year]};

    this.handleClickToggle = this.handleClickToggle.bind(this);
  }

  totalMonthPreOrPost = (year, month, isPre) => {
    return _.reduce(this.props.income[year][month].income, (sum, amount, type) => {
      var header = _.keyBy(this.props.headersLine, 'id')[type];
      if (!header || header.pretax !== isPre) return sum;
      return sum + amount / header.count;
    }, 0);
  };

  totalMonthPre = (year, month) => {
    return this.totalMonthPreOrPost(year, month, true);
  };

  totalMonthPost = (year, month) => {
    return this.totalMonthPreOrPost(year, month, false);
  };

  totalMonth = (year, month) => {
    return this.totalMonthPre(year, month) + this.totalMonthPost(year, month);
  };

  savingRateMonth = (year, month) => {
    let i = _.reduce(this.props.income[year][month].income, (sum, amount, type) => {
      var header = _.keyBy(this.props.headersLine, 'id')[type];
      return sum + amount / header.count;
    }, 0);

    return this.props.income[year][month].savings / i;
  };

  yearlySavings = (year) => {
    return _.reduce(this.props.income[year], (sum, month) => {
      return sum + _.get(month, 'savings', 0);
    }, 0);
  };

  yearlyIncome = (year, header) => {
    return _.reduce(this.props.income[year], (sum, month) => {
      return sum + _.get(month, ['income', header.id], 0);
    }, 0);
  };

  totalYearPreOrPost = (year, isPre) => {
    return _.reduce(this.props.income[year], (sum, month) => {
      return sum + _.reduce(_.get(month, 'income', {}), (sum, amount, type) => {
        var header = _.keyBy(this.props.headersLine, 'id')[type];
        if (!header || header.pretax !== isPre) return sum;
        return sum + amount / header.count;
      }, 0);
    }, 0);
  };

  totalYearPre = (year) => {
    return this.totalYearPreOrPost(year, true);
  };

  totalYearPost = (year) => {
    return this.totalYearPreOrPost(year, false);
  };

  yearlyTotal = (year) => {
    return this.totalYearPre(year) + this.totalYearPost(year);
  };

  savingRateYear = (year) => {
    let i = _.reduce(this.props.income[year], (sum, month) => {
      return sum + _.reduce(_.get(month, 'income', {}), (sum, amount, type) => {
        var header = _.keyBy(this.props.headersLine, 'id')[type];
        return sum + amount / header.count;
      }, 0);
    }, 0);
    let s = _.reduce(this.props.income[year], (sum, month) => {
      return sum + _.get(month, 'savings', 0);
    }, 0);

    return s / i;
  };

  handleClickToggle() {
    this.setState(state => ({
      collapsed: !state.collapsed
    }));
  }

  render() {
    return (
      <tbody>
        <tr>
          <td className={'td-chevron'}>
            <i className={"fa " + (this.state.collapsed ? 'fa-chevron-right' : 'fa-chevron-down')} onClick={this.handleClickToggle}></i>
          </td>
          <td className={this.state.collapsed ? 'hidden' : ''} colSpan={this.props.headersLine.length + 4}>
            <span className={'pull-left'} style={{paddingLeft: '10px'}}>
              { this.props.year }
            </span>
          </td>
          <td className={this.state.collapsed ? '' : 'hidden'}>
            { Display.amount(this.yearlySavings(this.props.year)) }
          </td>
          {this.props.headersLine.map((header) => (
          <td key={header.id} className={this.state.collapsed ? '' : 'hidden'}>
            { Display.amount(this.yearlyIncome(this.props.year, header), true) }
          </td>
          ))}
          <td className={this.state.collapsed ? '' : 'hidden'}>{ this.totalYearPost(this.props.year) }</td>
          <td className={this.state.collapsed ? '' : 'hidden'}>{ this.totalYearPre(this.props.year) }</td>
          <td className={this.state.collapsed ? '' : 'hidden'}>
            { Display.percentage(this.savingRateYear(this.props.year) * 100) }
          </td> 
        </tr> 

        {Object.entries(this.props.income[this.props.year]).map((month) => (
        <tr className={this.state.collapsed ? 'hidden' : '' } key={month[0]}>
          <td>{ month[0] }</td>
          <td>{ Display.amount(month[1].savings) }</td>
          {this.props.headersLine.map((header) => (
          <td key={this.props.year + '-' + month[0] + '-' + header.id}>
            <FireAmount amount={(month[1].income || {})[header.id]} 
                        callback-props={['income', this.props.year, month[0], 'income', header.id]} 
                        callback={this.props.callback} />
          </td>
          ))}
          <td className={this.totalMonth(this.props.year, month[0]) === 0 ? '' : 'hidden'} colSpan={3}></td>
          <td className={this.totalMonth(this.props.year, month[0]) === 0 ? 'hidden' : ''}>
            { Display.amount(this.totalMonthPost(this.props.year, month[0]), true) }
          </td>
          <td className={this.totalMonth(this.props.year, month[0]) === 0 ? 'hidden' : ''}>
            { Display.amount(this.totalMonthPre(this.props.year, month[0]), true) }
          </td>
          <td className={`${this.totalMonth(this.props.year, month[0]) === 0 ? 'hidden' : ''} ${Display.goal(this.savingRateMonth(this.props.year, month[0]), 0.5)}`}>            
            { Display.percentage(this.savingRateMonth(this.props.year, month[0]) * 100) }
          </td> 
        </tr>
        ))}

        <tr className={this.state.collapsed ? 'hidden' : '' }>
          <td><i className={'fa fa-calendar-plus-o'}></i></td>
          <td>{ Display.amount(this.yearlySavings(this.props.year), true) }</td>
          {this.props.headersLine.map((header) => (
          <td key={header.id}>{ Display.amount(this.yearlyIncome(this.props.year, header), true) }</td>
          ))}
          <td>{ Display.amount(this.totalYearPost(this.props.year), true) }</td>
          <td>{ Display.amount(this.totalYearPre(this.props.year), true) }</td>
          <td className={Display.goal(this.savingRateYear(this.props.year), 0.5)}>
            { Display.percentage(this.savingRateYear(this.props.year) * 100) }
          </td>
        </tr>
      </tbody>
    );
  }
};

export default RevenuesTableBody;