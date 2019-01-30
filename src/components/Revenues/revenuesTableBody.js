import React, { Component } from 'react';
import _ from 'lodash';

import Display from '../Utilities/Display';

//const RevenuesTableBody = ({ year, year_headers, headersLine }) => {
class RevenuesTableBody extends Component {
  constructor(props) {
    super(props);

    this.state = {collapsed: !props.year_headers.collapsed[props.year]};

    this.handleClickToggle = this.handleClickToggle.bind(this);
  }

  // componentDidMount() {
  // }

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
          <td>body</td>
          <td colSpan="10">
            year={ this.props.year }
            test={ this.state.collapsed ? 'yes' : 'no' }
          </td>
        </tr>
        <tr>
          <td className="td-chevron">
            {/* <fire-collapse-toggle flag="year_headers.collapsed[year]"></fire-collapse-toggle> */}
            <i className={"fa " + (this.state.collapsed ? 'fa-chevron-down' : 'fa-chevron-right')} onClick={this.handleClickToggle}>
            </i>
          </td>
          <td style={{ display: this.state.collapsed ? 'none' : 'table-cell' }} colSpan={this.props.headersLine.length + 4}>
            <span className="pull-left" style={{paddingLeft: '10px'}}>
              { this.props.year }
            </span>
          </td>
          <td style={{ display: this.state.collapsed ? 'table-cell' : 'none' }}>
            { Display.amount(this.yearlySavings(this.props.year)) }
          </td>

          {this.props.headersLine.map((header) => (
          <td key={header.id} style={{ display: this.state.collapsed ? 'table-cell' : 'none' }}>
            { Display.amount(this.yearlyIncome(this.props.year, header), true) }
          </td>
          ))}
          <td style={{ display: this.state.collapsed ? 'table-cell' : 'none' }}>{ this.totalYearPost(this.props.year) /*| amount:true*/ }</td>
          <td style={{ display: this.state.collapsed ? 'table-cell' : 'none' }}>{ this.totalYearPre(this.props.year) /*| amount:true*/ }</td>
          <td style={{ display: this.state.collapsed ? 'table-cell' : 'none' }}>
            { Display.percentage(this.savingRateYear(this.props.year) * 100) }
          </td> 
        </tr> 

        {Object.entries(this.props.income[this.props.year]).map((month) => (
        <tr style={{ display: this.state.collapsed ? 'table-row' : 'none' }} key={month[0]}>
          <td>{ month[0] }</td>
          <td>{ Display.amount(month[1].savings) }</td>
          {this.props.headersLine.map((header) => (
          <td key={this.props.year + '-' + month[0] + '-' + header.id}>
            {/* <fire-amount type="'R'" id="header.id" institution="income[year][month].income" ></fire-amount> */}
            { (month[1].income || {})[header.id] }
          </td>
          ))}
          <td style={{ display: this.totalMonth(this.props.year, month[0]) === 0 ? 'table-cell' : 'none' }} colSpan="3"></td>
          <td style={{ display: this.totalMonth(this.props.year, month[0]) === 0 ? 'none' : 'table-cell' }}>
            { Display.amount(this.totalMonthPost(this.props.year, month[0]), true) }
            </td>
          <td style={{ display: this.totalMonth(this.props.year, month[0]) === 0 ? 'none' : 'table-cell' }}>
            { Display.amount(this.totalMonthPre(this.props.year, month[0]), true) }
          </td>
          {/*  */}
          <td style={{ display: this.totalMonth(this.props.year, month[0]) === 0 ? 'none' : 'table-cell' }}
              className={Display.goal(this.savingRateMonth(this.props.year, month[0]), 0.5)} > {/*ng-class="savingRateMonth(year, month) | goal:0.5"*/}
            { Display.percentage(this.savingRateMonth(this.props.year, month[0]) * 100) }
          </td> 
        </tr>
        ))}

        <tr style={{ display: this.state.collapsed ? 'table-row' : 'none' }}>
          <td><i className="fa fa-calendar-plus-o"></i></td>
          <td>{ this.yearlySavings(this.props.year) /*| amount:true*/ }</td>
          {this.props.headersLine.map((header) => (
          <td key={header.id}>{ this.yearlyIncome(this.props.year, header) /*| amount:true*/ }</td>
          ))}
          <td>{ Display.amount(this.totalYearPost(this.props.year), true) }</td>
          <td>{ this.totalYearPre(this.props.year) /*| amount:true*/ }</td>
          <td ng-class="savingRateYear(year) | goal:0.5">
            { Display.percentage(this.savingRateYear(this.props.year) * 100) }
          </td>
        </tr>
      </tbody>
    );
  }
};

export default RevenuesTableBody;