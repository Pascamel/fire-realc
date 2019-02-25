import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { compose } from 'recompose';

import SavingsTable from './savingsTable';
import LoadingPanel from '../UI/LoadingPanel';
import SavePanel from '../UI/SavePanel';
import ErrorPanel from '../UI/ErrorPanel';
import Bank from '../Finance/Bank';
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

  updateSavings = (index, indexes, amount) => {
    this.state.bank.updateValue(index, indexes, amount);
    this.setState({bank: this.state.bank, updated: true});
  }

  saveData = () => {
    this.state.bank.saveSavings().then(saved => {
      this.setState({updated: false});
    }).catch((error) => {});
  }

  render() {
    const { loading, updated, error } = this.state;

    if (error) {
      return (
        <ErrorPanel code={error} />
      );
    } else {
      return (
        <React.Fragment>
          {loading && <LoadingPanel />}
          {!loading && <SavePanel label="Savings" updated={updated} saveClick={this.saveData} callback={this.updateSavings} {...this.state} />}
          {!loading && <Container>
            <Row>
              <Col>
                <SavingsTable {...this.state} callback={this.updateSavings} />
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