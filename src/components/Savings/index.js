import React, { Component } from 'react';
import { compose } from 'recompose';
import _ from 'lodash';

import SavingsTable from './savingsTable';
import LoadingPanel from '../UI/LoadingPanel';
import SavePanel from '../UI/SavePanel';
import ErrorPanel from '../UI/ErrorPanel';
import Bank from '../Finance/Bank';
import * as ERRORS from '../../constants/errors';
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

    let formatYear = (months) => {
      return _(months).reduce((acc, m) => {
        acc[m] = {};
        return acc;
      }, {});
    };

    this.props.firebase.getHeaders().then((snapshotHeaders) => {
      this.props.firebase.getSavings().then((snapshotSavings) => {

        if (!snapshotHeaders.data()) {
          this.setState({loading: false, error: ERRORS.NO_HEADERS});
          return;
        }

        let new_state = {};
        let headers = snapshotHeaders.data().data;
        let data = snapshotSavings.data().data;
        let savings_headers = snapshotSavings.data().yearly_data;

        new_state.firstMonth = headers.firstMonth
        new_state.firstYear = headers.firstYear;
        new_state.startingCapital = headers.startingCapital;
        new_state.headers = headers.headers;

        new_state.headersLine1 = _(headers.headers)
          .map((header) => {
            return {
              label: header.label,
              icon: header.icon,
              weight: header.interest ? 3 : 1
            };
          })
          .groupBy('label')
          .map((header, key) => {
            return {
              label: key,
              icon: header[0].icon,
              weight: _.reduce(header, (sum, h) => sum + h.weight, 0)
            };
          })
          .value();

        new_state.headersLine2 = _(headers.headers)
          .map((header) => {
            let headers = [header.sublabel || 'Principal'];
            if (header.interest) _.each(['Interest', 'Total'], (t) => headers.push(t)); 
            headers = _.map(headers, (h, idx) => {
              return {
                label: h,
                last: idx === headers.length-1
              }
            });
            return headers;
          })
          .flatMap()
          .value();

        new_state.inputLine = _(headers.headers)
          .map((header) => {
            let headers = [{id: header.id, type: 'P'}];
            if (header.interest) _.each(['I', 'T'], (t) => headers.push({id: header.id, type: t})); 
            _.each(headers, (item) => { item.types = _.map(headers, 'type')});
            return headers;
          })
          .flatMap()
          .value();
          
        new_state.savings = {};
        let years = _.range(headers.firstYear, new Date().getFullYear() + 1);

        _(years).each((y, idx) => {
          if (idx === 0 && years.length === 1) {
            new_state.savings[y] = formatYear(_.range(headers.firstMonth, new Date().getMonth() + 2));
          } else if (idx === 0) {
            new_state.savings[y] = formatYear(_.range(headers.firstMonth, 13));
          } else {
            new_state.savings[y] = formatYear(_.range(1, 13));
          }
        });

        _(data).each((d) => {
          _.set(new_state.savings, [d.year, d.month, d.institution, d.type], d.amount);
        });
        
        new_state.year_headers = savings_headers || {collapsed: {}, goals: {}};

        new_state.bank = this.newBank(new_state);
        new_state.loading = false;
        this.setState(new_state);
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
          {!loading && <SavePanel label={'Savings'} saveClick={this.saveData} updated={this.state.updated} />}
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