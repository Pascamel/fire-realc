import React, {Component} from 'react';
import { compose } from 'recompose';
import _ from 'lodash';

import * as ROUTES from '../../constants/routes';
import * as ERRORS from '../../constants/errors';
import MonthChart from './monthChart';
import MonthFinances from './monthFinances';
import LoadingPanel from '../UI/LoadingPanel';
import SavePanelMonth from './savePanelMonth';
import ErrorPanel from '../UI/ErrorPanel';
import Bank from '../Finance/Bank';
import FinanceHelpers from '../Finance/FinanceHelpers';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../UserSession/Session';


class MonthPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updated: false,
      loading: true,
      bank: {}
    };
  }

  componentDidMount() {
    const year = parseInt(this.props.match.params.year) || 0,
      month = parseInt(this.props.match.params.month) || 0,
      currentYear = new Date().getFullYear(),
      currentMonth = new Date().getMonth() + 1,
      route = ROUTES.MONTH.replace(':year', currentYear).replace(':month', currentMonth);

    if (month < 1 || month > 12) this.props.history.push(route);
    if (year > currentYear) this.props.history.push(route);

    this.setState({month: month, year: year.toString()});

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
          // let income_headers = _.get(snapshotIncome.data(), 'yearly_data', {});
          let new_state = {};
          
          new_state.income = FinanceHelpers.income(income_data, savings_data, headers);
          new_state.savings = FinanceHelpers.savings(savings_data, headers);
          new_state.headersLine = FinanceHelpers.headersLine(headers);
          new_state.startingCapital = headers.startingCapital;
          new_state.year_headers = _.get(snapshotSavings.data(), 'yearly_data', {});
          new_state.inputLine = FinanceHelpers.inputLine(headers.savings);

          new_state.bank = this.newBank(new_state);
          new_state.loading = false;
          this.setState(new_state);
        });
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.month !== this.props.match.params.month
      || prevProps.match.params.year !== this.props.match.params.year) {
      const year = parseInt(this.props.match.params.year) || 0,
        month = parseInt(this.props.match.params.month) || 0,
        currentYear = new Date().getFullYear(),
        currentMonth = new Date().getMonth() + 1,
        route = ROUTES.MONTH.replace(':year', currentYear).replace(':month', currentMonth);

      if (month < 1 || month > 12) this.props.history.push(route);
      if (year > currentYear) this.props.history.push(route);

      this.setState({month: month, year: year.toString()});
    }
  }

  newBank = (state) => {
    return new Bank.Bank(state.income, state.savings, state.headersLine, state.startingCapital, state.year_headers, state.inputLine);
  }

  prevMonth = () => {
    let { month, year } = this.state;

    month -= 1;
    if (month < 1) {
      month = 12;
      year--;
    }

    const route = ROUTES.MONTH.replace(':year', year).replace(':month', month);
    this.props.history.push(route);
    this.setState({month: month, year: year.toString()});
  }

  nextMonth = () => {
    let { month, year } = this.state;

    month += 1;
    if (month > 12) {
      month = 1;
      year++;
    }

    const route = ROUTES.MONTH.replace(':year', year).replace(':month', month);
    this.props.history.push(route);
    this.setState({month: month, year: year.toString()});
  }

  saveData = () => {

  }

  render () {
    const { loading, error } = this.state;

    if (error) {
      return (
        <ErrorPanel code={error} />
      );
    } else {
      return (
        <React.Fragment>
          {loading && <LoadingPanel />}
          {!loading && <SavePanelMonth saveClick={this.saveData} prevMonth={this.prevMonth} nextMonth={this.nextMonth} {...this.state}  />}
          {!loading && <MonthChart {...this.state} />}
          {!loading && <MonthFinances />}
        </React.Fragment>
      );
    }
  }
}

export default compose(
  withAuthorization((authUser) => !!authUser),
  withFirebase,
)(MonthPage);
