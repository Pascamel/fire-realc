import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { compose } from 'recompose';
import _ from 'lodash';

import SavingsTable from './savingsTable';
import LoadingPanel from '../UI/LoadingPanel';
import SavePanel from '../UI/SavePanel';
import ErrorPanel from '../UI/ErrorPanel';
import Bank from '../Finance/Bank';
import FinanceHelpers from '../Finance/FinanceHelpers';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../UserSession/Session';


class SavingsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      updated: false,
      bank: {}
    }
  }

  componentDidMount() {
    let bank = new Bank(this.props.firebase);
    bank.load().then(loaded => {
      this.setState({bank: bank, loading: !loaded});
    }).catch(function(error) {});
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

    // this.setState({savings: new_savings, bank: this.newBank(new_state), updated: true});
  }

  updateGoal = (index, indexes, amount) => {
    const new_year_headers = JSON.parse(JSON.stringify(this.state[index]));
    _.set(new_year_headers, indexes, amount);

    const new_state = this.state;
    new_state.year_headers = new_year_headers;

    // this.setState({year_headers: new_year_headers, bank: this.newBank(new_state), updated: true});
  }

  saveData = () => {
    const payload = {
      last_update: (new Date()).getTime(),
      data: JSON.parse(JSON.stringify(FinanceHelpers.formatSavingstaToSave(this.state.savings))),
      yearly_data: JSON.parse(JSON.stringify(this.state.year_headers))
    };

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
        <React.Fragment>
          {loading && <LoadingPanel />}
          {!loading && <SavePanel label="Savings" saveClick={this.saveData} updated={this.state.updated} />}
          {!loading && <Container>
            <Row>
              <Col>
                <SavingsTable {...this.state} callback={this.updateSavings} callbackGoal={this.updateGoal} />
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
)(SavingsPage);