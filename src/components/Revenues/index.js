import React, { Component } from 'react';
import { compose } from 'recompose';
import _ from 'lodash';

import RevenuesTable from './revenuesTable';
import LoadingPanel from '../UI/LoadingPanel';
import SavePanel from '../UI/SavePanel';
import ErrorPanel from '../UI/ErrorPanel';
import Bank from '../Finance/Bank';
import * as ERRORS from '../../constants/errors';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../UserSession/Session';

class RevenuePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      updated: false,
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

    this.props.firebase.getHeaders().then((snapshotHeaders) => {
      this.props.firebase.getSavings().then((snapshotSavings) => {
        this.props.firebase.getRevenues().then((snapshotIncome) => {

          if (!snapshotHeaders.data()) {
            this.setState({loading: false, error: ERRORS.NO_HEADERS});
            return;
          }

          let headers = snapshotHeaders.data() || [];
          let savings_data = _.get(snapshotSavings.data(), 'data', []);
          let income_data = _.get(snapshotIncome.data(), 'data', []);
          let income_headers = _.get(snapshotIncome.data(), 'yearly_data', {});
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

    this.setState({income: new_income, bank: this.newBank(new_state), updated: true});
  }

  formatDataToSave = () => {
    let data = [];

    _.each(this.state.income, (data_year, year) => {
      _.each(data_year, (data_month, month) => {
        _.each(data_month.income, (amount, institution) => {
          data.push({year: parseInt(year), month: parseInt(month), type: institution, amount: amount});
        })
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

    this.props.firebase.setRevenues(payload).then(() => {
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
          {!loading && <SavePanel label="Revenues" saveClick={this.saveData} updated={this.state.updated} />}
          {!loading && <RevenuesTable {...this.state} callback={this.updateIncome} />}
        </div>
      );
    }
  }
}

export default compose(
  withAuthorization((authUser) => !!authUser),
  withFirebase,
)(RevenuePage);