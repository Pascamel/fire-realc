import React, { Component } from 'react';
import _ from 'lodash';

// import FireAmount from '../FireAmount';
import Display from '../Utilities/Display';

class SavingsTableBody extends Component {
  constructor(props) {
    super(props);

    this.state = {collapsed: props.year_headers.collapsed[props.year]};

    this.handleClickToggle = this.handleClickToggle.bind(this);
  }

  startOfYearAmount = (year) => {
    var keys = _.keys(this.props.savings), idx = keys.indexOf(year);

    if (idx <= 0) return this.props.startingCapital;
    
    return this.totalHolding('12', keys[idx - 1]);
  };

  totalMonth = (month, year, type) => {
    var m = _.get(this.props, ['savings', year, month]);
    if (!m || !Object.keys(m).length) return 0;

    if (type === 'T') return _.reduce(['P', 'I'], (v, i) => v + this.totalMonth(month, year, i), 0);
    return _.reduce(m, (v, i) => v + _.get(i, [type], 0), 0);
  };

  totalHolding = (month, year) => {
    var keys = _.keys(this.props.savings), idxYear = keys.indexOf(year);
    if (idxYear < 0) return 0;

    var yearData = this.props.savings[year], idxMonth = _.keys(yearData).indexOf(month);
    if (idxMonth < 0) return 0;

    return _.reduce(this.props.savings, (sum, data_y, y) => {
      if (parseInt(y) > parseInt(year)) return sum;
      return sum + _.reduce(data_y, (sum, data_m, m) => {
        if (parseInt(y) === parseInt(year) && parseInt(m) > parseInt(month)) return sum;
        return sum + _.reduce(data_m, (sum, data_institution) => {
          return sum + _.reduce(data_institution, (sum, amount, type) =>{
            if (type === 'T') return sum;
            return sum + amount;
          }, 0);
        }, 0)
      }, 0);
    }, this.props.startingCapital);
  };

  monthlyGoal = (year) => {
    var idxYear = _(this.props.savings).keys().indexOf(year);
    if (idxYear < 0) return 0;

    var goal_year = _.get(this.props, ['year_headers', 'goals', year], 0);
    var start_of_year = (idxYear === 0) ? this.props.startingCapital : this.totalHolding('12', (parseInt(year) - 1).toString());
    var goal = (goal_year - start_of_year) /  _.keys(this.props.savings[year]).length;

    return goal;
  }

  goalMonth = (month, year) => {
    var idxYear = _(this.props.savings).keys().indexOf(year);
    if (idxYear < 0) return 0;
  
    var goal_year = _.get(this.props, ['year_headers', 'goals', year], 0);
    var start_of_year = (idxYear === 0) ? this.props.startingCapital : this.totalHolding('12', (parseInt(year) - 1).toString());
    var goal = (goal_year - start_of_year) /  _.keys(this.props.savings[year]).length;
    var achieved = this.totalMonth(month, year, 'T');

    return Display.roundFloat(achieved - goal);
  };

  goalYearToDate = (month, year) => {
    var idxYear = _(this.props.savings).keys().indexOf(year);
    if (idxYear < 0) return 0;
    var idxMonth = _(this.props.savings[year]).keys().indexOf(month);
    if (idxYear < 0) return 0;

    var goal_year = _.get(this.props, ['year_headers', 'goals', year], 0);
    var start_of_year = (idxYear === 0) ? this.props.startingCapital : this.totalHolding('12', (parseInt(year) - 1).toString());
    var goal_by_month = (goal_year - start_of_year) / _.keys(this.props.savings[year]).length;
    var goal = start_of_year + goal_by_month * (idxMonth + 1);
    var achieved = this.totalHolding(month, year, 'T');

    return Display.roundFloat(achieved - goal);
  };

  totalInstitution = (year, institution, type) => {
    var idxYear = _(this.props.savings).keys().indexOf(year);
    if (idxYear < 0) return 0;

    if (type === 'T') return _.reduce(['P', 'I'], (v, i) => v + this.totalInstitution(year, institution, i), 0);

    return _.reduce(this.props.savings[year], (v, i) => v + _.get(i, [institution, type], 0), 0);
  };

  grandTotalInstitution = (institution, type) => {
    if (type === 'T') return _.reduce(['P', 'I'], (v, i) => v + this.grandTotalInstitution(institution, i), 0);

    var sp = (type === 'P' && _.findIndex(this.props.headers, (o) => { return o.id === institution; }) === 0) ? this.props.startingCapital : 0;
    var ti = _(this.props.savings).keys().reduce((acc, year) => acc + this.totalInstitution(year, institution, type), 0);

    return sp + ti;
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
            <i className={`fa ${this.state.collapsed ? 'fa-chevron-right' : 'fa-chevron-down'}`} onClick={this.handleClickToggle}></i>
          </td>
          <td colSpan={this.props.headersLine2.length + 4} className={this.state.collapsed ? 'hidden' : ''}>
            <span className={'pull-left'} style={{paddingLeft: '10px'}}>
              { this.props.year }
            </span>
            <span>
              Begins at <b>{ Display.amount(this.startOfYearAmount(this.props.year)) }</b> -
              Goal is 
              TODO1
              {/* <fire-amount type="year" id="year" institution="year_headers.goals" types="[]" class="'bold'"></fire-amount> */}
              ({ this.monthlyGoal(this.props.year) }/mo)
            </span>
          </td>
          {this.props.inputLine.map((amount, idx) => (
          <td className={this.state.collapsed ? '':'hidden'} key={idx}>
            { Display.amount(this.totalInstitution(this.props.year, amount.id, amount.type), true) }
          </td>
          ))}
          <td className={this.state.collapsed ? '':'hidden'}>Total</td>
          <td className={`table-warning ${this.state.collapsed ? '':'hidden'}`}>{ Display.amount(this.totalHolding('12', this.props.year)) }</td>
          <td className={this.state.collapsed ? '':'hidden'}>Goal</td>
          <td className={`${this.state.collapsed ? '':'hidden'} ${Display.goal(this.goalYearToDate('12', this.props.year), 0)}`}>
            { Display.amount(this.goalYearToDate('12', this.props.year), true) }
          </td>
        </tr>
        {Object.entries(this.props.savings[this.props.year]).map((month, idx) => (
        <tr key={idx} className={this.state.collapsed ? 'hidden':''}>
          <td>{ month[0] }</td>
          {this.props.inputLine.map((amount, idx) => (
          <td key={idx}>
            {/* <fire-amount type="amount.type" id="amount.id" institution="savings[year][month][amount.id]" types="amount.types"></fire-amount>*/}
            TODO2
          </td>
          ))}
          <td>{ Display.amount(this.totalMonth(month, this.props.year, 'T')) }</td>
          <td className={this.totalMonth(month[0], this.props.year, 'T') === 0 ? '' : 'hidden'} colSpan={3}></td>
          <td className={this.totalMonth(month[0], this.props.year, 'T') === 0 ? 'hidden' : ''}>
            { Display.amount(this.totalHolding(month[0], this.props.year)) }
          </td>
          <td className={`${this.totalMonth(month[0], this.props.year, 'T') === 0 ? 'hidden' : ''} ${Display.goal(this.goalMonth(month[0], this.props.year), 0)}`} >
            { Display.amount(this.goalMonth(month[0], this.props.year), true) }
          </td>
          <td className={`${this.totalMonth(month[0], this.props.year, 'T') === 0 ? 'hidden' : ''} ${Display.goal(this.goalYearToDate(month[0], this.props.year), 0)}`} >
            { Display.amount(this.goalYearToDate(month[0], this.props.year), true) }
          </td>
        </tr>
        ))}
        <tr className={`tr-total ${this.state.collapsed ? 'hidden' : ''}`}>
          <td><i className={'fa fa-calendar-plus-o'}></i></td>
          {this.props.inputLine.map((amount, idx) => (
          <td key={idx}>
            { Display.amount(this.totalInstitution(this.props.year, amount.id, amount.type), true) }
          </td>
          ))}
          <td>Total</td>
          <td className={'table-warning'}>{ Display.amount(this.totalHolding('12', this.props.year)) }</td>
          <td>Goal</td>
          <td className={Display.goal(this.goalYearToDate('12', this.props.year), 0)}>
            { Display.amount(this.goalYearToDate('12', this.props.year), true) }
          </td>
        </tr>
      </tbody>
    );
  }
}

export default SavingsTableBody;