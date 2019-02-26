import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import SavingsHeader from './savingsHeader';
import Display from '../UI/Display';


class SavingsHeaders extends Component {
  newHeader = () => {
    this.props.addHeaderCallback('savings');
  }

  render() {
    const {headers} = this.props;

    return (
      <React.Fragment>
        <Row>
          <Col className="mt-4">
            <h3>Savings</h3>
          </Col>
        </Row>
        <Row className={Display.showIf(!headers.savings.length)}>
          <Col>
            No headers
          </Col>
        </Row>
        {headers.savings.map((header, key) => (
          <SavingsHeader key={key} header={header} index={key} {...this.props} />
        ))}
        <Row>
          <Col>
            <Button color="light" block={true} onClick={this.newHeader}>
              Add New
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default SavingsHeaders;
