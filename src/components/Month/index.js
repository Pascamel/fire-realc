import React, {Component} from 'react';
import { Container, Row } from 'reactstrap';
import { compose } from 'recompose';
import _ from 'lodash';

import FinanceHelpers from '../Finance/FinanceHelpers';
import * as ROUTES from '../../constants/routes';
import MonthChart from './monthChart';
import MonthFinances from './monthFinances';
import LoadingPanel from '../UI/LoadingPanel';
import { SavePanelMonth } from '../UI/SavePanel';
import ErrorPanel from '../UI/ErrorPanel';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../UserSession/Session';
import Bank from '../Finance/Bank';


class MonthPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updated: false,
      loading: true,
      year: (parseInt(props.match.params.year) || 0).toString(),
      month: parseInt(props.match.params.month) || 0,
      bank: {}
    };
  }

  componentDidMount() {
    const y = new Date().getFullYear(), 
      m = new Date().getMonth() + 1,
      route = ROUTES.MONTH.replace(':year', y).replace(':month', m);

    if (this.state.month < 1 || this.state.month > 12) this.props.history.push(route);
    if (this.state.year > y) this.props.history.push(route);

    let bank = new Bank(this.props.firebase);
    bank.load().then(loaded => {
      this.setState({bank: bank, loading: !loaded});
    }).catch(function(error) {});
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

  updateSavings = (index, indexes, amount) =>{
    let new_savings = JSON.parse(JSON.stringify(this.state[index]));

    _.set(new_savings, indexes, amount);
    const header = _.keyBy(this.state.savings_headers, 'id')[_.nth(indexes, indexes.length - 2)];
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

  updateIncome = (index, indexes, amount) => {
    const new_income = JSON.parse(JSON.stringify(this.state[index]));
    _.set(new_income, indexes, amount);
    
    const new_state = this.state;
    new_state.income = new_income;

    this.setState({income: new_income, bank: this.newBank(new_state), updated: true});
  }

  saveData = () => {
    const payload = {
      last_update: (new Date()).getTime(),
      data: JSON.parse(JSON.stringify(FinanceHelpers.formatSavingstaToSave(this.state.savings))),
      yearly_data: JSON.parse(JSON.stringify(this.state.year_headers))
    };

    this.props.firebase.setSavings(payload).then(() => {
      
      const payload = {
        last_update: (new Date()).getTime(),
        data: JSON.parse(JSON.stringify(FinanceHelpers.formatIncomeToSave(this.state.income))),
        yearly_data: JSON.parse(JSON.stringify(this.state.income_headers))
      }
  
      this.props.firebase.setRevenues(payload).then(() => {
        this.setState({updated: false});
      });
    });
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
          {!loading && <Container>
            <Row>
              <MonthFinances {...this.state} callbackSavings={this.updateSavings} callbackIncome={this.updateIncome} />
              <MonthChart {...this.state} />
            </Row>
          </Container>}
          
        </React.Fragment>
      );
    }
  }
}

export default compose(
  withAuthorization((authUser) => !!authUser),
  withFirebase,
)(MonthPage);
