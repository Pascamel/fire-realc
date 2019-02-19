import React, { Component } from 'react';
import { compose } from 'recompose';
import _ from 'lodash';

import SavingsTable from './savingsTable';
import LoadingPanel from '../UI/LoadingPanel';
import SavePanel from '../UI/SavePanel';
import ErrorPanel from '../UI/ErrorPanel';
import Bank from '../Finance/Bank';
import * as ERRORS from '../../constants/errors';
import FinanceHelpers from '../Finance/FinanceHelpers';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../UserSession/Session';


class SavingsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      updated: false,
      headersLine1: [],
      headersLine2: [],
      inputLine: [],
      savings: []
    }
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.getHeaders().then((snapshotHeaders) => {
      this.props.firebase.getSavings().then((snapshotSavings) => {

        if (!snapshotHeaders.data()) {
          this.setState({loading: false, error: ERRORS.NO_HEADERS});
          return;
        }

        let new_state = {};
        let headers = snapshotHeaders.data() || [];
        let data = _.get(snapshotSavings.data(), 'data', []);
        let savings_headers = _.get(snapshotSavings.data(), 'yearly_data', {});

        new_state.headersLine1 = FinanceHelpers.headersLine1(headers.savings);
        new_state.headersLine2 = FinanceHelpers.headersLine2(headers.savings);
        
        new_state.savings = FinanceHelpers.savings(data, headers);
        new_state.startingCapital = headers.startingCapital;
        new_state.year_headers = savings_headers || {collapsed: {}, goals: {}};
        new_state.inputLine = FinanceHelpers.inputLine(headers.savings);

        new_state.bank = this.newBank(new_state);
        new_state.loading = false;

        this.setState(new_state);
      });
    });
  }

  newBank = (state) => {
    return new Bank.Bank(null, state.savings, null, state.startingCapital, state.year_headers, state.inputLine);
  }

  updateSavings = (index, indexes, amount) =>{
    let new_savings = JSON.parse(JSON.stringify(this.state[index]));

    _.set(new_savings, indexes, amount);
    const header = _.keyBy(this.state.headers, 'id')[_.nth(indexes, indexes.length - 2)];
    if (!header) return;

    if (header.interest) {
      indexes.pop();
      const value = _.reduce(['P', 'I'], (acc, v) => acc + _.get(new_savings, _.concat(indexes, v)), 0);
      _.set(new_savings, _.concat(indexes, 'T'), value);
    }
    
    const new_state = this.state;
    new_state.savings = new_savings;

    this.setState({savings: new_savings, bank: this.newBank(new_state), updated: true});
  }

  updateGoal = (index, indexes, amount) => {
    const new_year_headers = JSON.parse(JSON.stringify(this.state[index]));
    _.set(new_year_headers, indexes, amount);

    const new_state = this.state;
    new_state.year_headers = new_year_headers;

    this.setState({year_headers: new_year_headers, bank: this.newBank(new_state), updated: true});
  }

  formatDataToSave = () => {
    let data = [];

    _.each(this.state.savings, (data_year, year) => {
      _.each(data_year, (data_month, month) => {
        _.each(data_month, (data_institution, institution) => {
          _.each(data_institution, (amount, type) => {
            if (type === 'T') return;
            if (amount === 0) return;

            data.push({year: parseInt(year), month: parseInt(month), institution: institution, type: type, amount: amount});
          });
        });
      });
    });

    return data;
  }; 

  saveData = () => {
    const data = this.formatDataToSave();
    const payload = {
      last_update: (new Date()).getTime(),
      data: JSON.parse(JSON.stringify(data)),
      yearly_data: JSON.parse(JSON.stringify(this.state.year_headers))
    }

    this.props.firebase.setSavings(payload).then(() => {
      this.setState({updated: false});
    });
  }

  render() {
    const { loading, error } = this.state;

    if (error) {
      return (
        <ErrorPanel code={error} />
      );
    } else {
      return (
        <div>
          {loading && <LoadingPanel />}
          {!loading && <SavePanel label="Savings" saveClick={this.saveData} updated={this.state.updated} />}
          {!loading && <SavingsTable {...this.state} callback={this.updateSavings} callbackGoal={this.updateGoal} />}
        </div>
      );
    }
  }
}

export default compose(
  withAuthorization((authUser) => !!authUser),
  withFirebase,
)(SavingsPage);