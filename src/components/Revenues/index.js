import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { compose } from 'recompose';
import _ from 'lodash';

import RevenuesTable from './revenuesTable';
import LoadingPanel from '../UI/LoadingPanel';
import SavePanel from '../UI/SavePanel';
import ErrorPanel from '../UI/ErrorPanel';
import Bank from '../Finance/Bank';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../UserSession/Session';
import FinanceHelpers from '../Finance/FinanceHelpers';


class RevenuePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      updated: false,
      bank: {}
    };
  }

  componentDidMount() {
    let bank = new Bank(this.props.firebase);
    bank.load().then(loaded => {
      this.setState({bank: bank, loading: !loaded});
    }).catch(function(error) {});
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