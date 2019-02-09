import React, { Component } from 'react';
import { compose } from 'recompose';
import _ from 'lodash';

import RevenuesTable from './revenuesTable';
import LoadingPanel from '../UI/LoadingPanel';
import Bank from '../Finance/Bank';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../UserSession/Session';

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
          
          // format headers
          new_state.firstMonth = headers.firstMonth
          new_state.firstYear = headers.firstYear;
          new_state.startingCapital = headers.startingCapital;
          new_state.incomes = headers.incomes;
          new_state.headersLine = _.map(headers.incomes, (h, idx) => {
            h.last = (idx === headers.incomes.length - 1);
            return h;
          });
          
          // format savings and income
          let income = {};
          let years = _.range(headers.firstYear, new Date().getFullYear() + 1);
    
          _(years).each((y, idx) => {
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

          new_state.bank = this.newBank(new_state);
          new_state.loading = false;
          this.setState(new_state);
        });
      });
    });
  }

  newBank = (state) => {
    const bank = new Bank.Bank(
      state.income, 
      state.savings, 
      state.headersLine, 
      state.startingCapital, 
      state.year_headers, 
      state.inputLine
    )

    return bank;
  }

  updateIncome = (index, indexes, amount) => {
    const new_income = JSON.parse(JSON.stringify(this.state[index]));
    _.set(new_income, indexes, amount);

    const new_state = this.state;
    new_state.income = new_income;

    this.setState({income: new_income, bank: this.newBank(new_state)});
  }

  render() {
    const { loading } = this.state;

    return (
      <div>
        <h1>Revenues</h1>
        {loading && <LoadingPanel />}
        {!loading && <RevenuesTable {...this.state} callback={this.updateIncome} />}
      </div>
    );
  }
}

export default compose(
  withAuthorization(authUser => !!authUser),
  withFirebase,
)(RevenuePage);