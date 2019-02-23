import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
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
import FinanceHelpers from '../Finance/FinanceHelpers';


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
          let income_year_headers = _.get(snapshotIncome.data(), 'yearly_data', {});
          let new_state = {};
          
          new_state.income = FinanceHelpers.income(income_data, savings_data, headers);
          new_state.headersLine = FinanceHelpers.headersLine(headers);
          new_state.startingCapital = headers.startingCapital;
          new_state.year_headers = income_year_headers || {collapsed: {}};

          new_state.bank = this.newBank(new_state);
          new_state.loading = false;
          this.setState(new_state);
        });
      });
    });
  }

  newBank = (state) => {
    return new Bank.Bank(state.income, null, state.headersLine, state.startingCapital, state.year_headers, null);
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
      data: JSON.parse(JSON.stringify(FinanceHelpers.formatIncomeToSave(this.state.income))),
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
        <React.Fragment>
          {loading && <LoadingPanel />}
          {!loading && <SavePanel label="Revenues" saveClick={this.saveData} updated={this.state.updated} />}
          {!loading && <Container>
            <Row>
              <Col>
                <RevenuesTable {...this.state} callback={this.updateIncome} />
              </Col>
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
)(RevenuePage);