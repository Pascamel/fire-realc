import React, { Component } from 'react';
import { compose } from 'recompose';
import _ from 'lodash';

import RevenuesTable from './revenuesTable';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

class RevenuePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      income: [],
      headersLine: [],
      year_headers: {}
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    let formatYear = (months, value) => {
      return _(months).reduce((acc, m) => {
        acc[m] = _.cloneDeep(value);
        return acc;
      }, {});
    };

    this.props.firebase.headers().then(snapshotHeaders => {
      this.props.firebase.savings().then(snapshotSavings => {
        this.props.firebase.revenues().then(snapshotIncome => {

          let headers = snapshotHeaders.data().data;
          let savings_data = snapshotSavings.data().data;
          let income_data = snapshotIncome.data().data;
          let income_headers = snapshotIncome.data().yearly_data;
          let new_state = {};
          
          // formatHeaders
          new_state.firstMonth = headers.firstMonth
          new_state.firstYear = headers.firstYear;
          new_state.startingCapital = headers.startingCapital;
          new_state.incomes = headers.incomes;
          new_state.headersLine = _.map(headers.incomes, (h, idx) => {
            h.last = (idx === headers.incomes.length - 1);
            return h;
          });
          
          // formatSavingsAndIncome
          let income = {};
          let years = _.range(headers.firstYear, new Date().getFullYear() + 1);
    
          _(years).each((y, idx) => {
            // let months = [];
            if (idx === 0 && years.length === 1) {
              income[y] = formatYear(_.range(headers.firstMonth, new Date().getMonth() + 2), {});
            } else if (idx === 0) {
              income[y] = formatYear(_.range(headers.firstMonth, 13), {});
            } else {
              income[y] = formatYear(_.range(1, 13), {});
            }
          });
    
          _(savings_data).each((d) => {
            let current_value = _.get(income, [d.year, d.month, 'savings'], 0);
            _.set(income, [d.year, d.month, 'savings'], current_value + d.amount);
          });
    
          _(income_data).each((d) => {
            _.set(income, [d.year, d.month, 'income', d.type], d.amount);
          });
    
          new_state.income = income;

          // year headers
          new_state.year_headers = income_headers || {collapsed: {}};

          new_state.loading = false;
          this.setState(new_state);
        });
      });
    });
  }

  // componentDidUnmount() {
  // }

  render() {
    const { loading, income, headersLine, year_headers } = this.state;

    return (
      <div>
        <h1>Revenues</h1>
        {loading && <div>Loading ...</div>}
        {!loading && <p>{Object.keys(income).length} year(s)</p>}
        <RevenuesTable income={income} headersLine={headersLine} year_headers={year_headers} />
      </div>
    );
  }
}

export default compose(
  withAuthorization(authUser => !!authUser),
  withFirebase,
)(RevenuePage);