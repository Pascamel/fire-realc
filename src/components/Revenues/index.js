import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { compose } from 'recompose';

import RevenuesTable from './revenuesTable';
import LoadingPanel from '../UI/LoadingPanel';
import SavePanel from '../UI/SavePanel';
import ErrorPanel from '../UI/ErrorPanel';
import Bank from '../Finance/Bank';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../UserSession/Session';


class RevenuePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      updated: false,
      saveInProgress: false,
      bank: {}
    };
  }

  componentDidMount() {
    let bank = new Bank(this.props.firebase);
    bank.load().then(loaded => {
      this.setState({bank: bank, loading: !loaded});
    }).catch(function(error) {});
  }

  updateValue = (index, indexes, amount, updatedState) => {  
    this.state.bank.updateValue(index, indexes, amount);
    if (updatedState) {
      this.setState({bank: this.state.bank, updated: true});
    } else {
      this.setState({bank: this.state.bank});
      this.state.bank.saveLocalStorage();
    }
  }

  saveData = () => {
    this.setState({saveInProgress: true});

    this.state.bank.saveIncome().then((saved) => {
      this.setState({
        updated: !saved, 
        saveInProgress: false
      });
    }).catch((error) => {});
  }

  render() {
    const { loading, error, updated } = this.state;

    if (error) {
      return (
        <ErrorPanel code={error} />
      );
    } else {
      return (
        <React.Fragment>
          {loading && <LoadingPanel />}
          {!loading && <SavePanel label="Revenues" updated={updated} saveClick={this.saveData} callback={this.updateValue} {...this.state} />}
          {!loading && <Container>
            <Row>
              <Col>
                <RevenuesTable {...this.state} callback={this.updateValue} />
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