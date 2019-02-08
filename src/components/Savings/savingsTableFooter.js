import React, { Component } from 'react';
import _ from 'lodash';

import Display from '../UI/Display';

class SavingsTableFooter extends Component {

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

  grandTotalHolding = () => {
    var year = _(this.props.savings).keys().last();
    if (!year) return;

    var month = _(this.props.savings[year]).keys().last();
    if (!month) return;

    return this.totalHolding(month, year);
  };

  render() {
    return (
      <tfoot>
        <tr>
          <td><i className={'fa fa-university'}></i></td>
          {this.props.inputLine.map((amount, key) => (
          <td className={'table-warning'} key={key}>
            { Display.amount(this.grandTotalInstitution(amount.id, amount.type), true) }
          </td>
          ))}
          <td>Total</td>
          <td className={'table-warning'}>{ Display.amount(this.grandTotalHolding()) }}</td>
          <td colSpan={2}></td>
        </tr>
      </tfoot>
    );
  }
}

export default SavingsTableFooter;