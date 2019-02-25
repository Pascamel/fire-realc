import React, {Component} from 'react';
import { Container, Row } from 'reactstrap';
import { compose } from 'recompose';
import Display from '../UI/Display';

import * as ROUTES from '../../constants/routes';
import MonthChart from './monthChart';
import MonthFinances from './monthFinances';
import LoadingPanel from '../UI/LoadingPanel';
import SavePanel from '../UI/SavePanel';
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

  updateSavings = (index, indexes, amount) => {
    this.state.bank.updateValue(index, indexes, amount);
    this.setState({bank: this.state.bank, updated: true});
  }

  updateIncome = (index, indexes, amount) => {
    this.state.bank.updateValue(index, indexes, amount);
    this.setState({bank: this.state.bank, updated: true});
  }

  saveData = () => {
    this.state.bank.saveSavings().then(saved => {
      this.state.bank.saveIncome().then(saved => {
        this.setState({updated: false});
      }).catch((error) => {});
    }).catch((error) => {});
  }

  render () {
    const { loading, error, month, year } = this.state;

    if (error) {
      return (
        <ErrorPanel code={error} />
      );
    } else {
      return (
        <React.Fragment>
          {loading && <LoadingPanel />}
          {!loading && <SavePanel label={`${Display.labelMonth(month)} ${year}`} saveClick={this.saveData} prevMonth={this.prevMonth} nextMonth={this.nextMonth} {...this.state} />}
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
