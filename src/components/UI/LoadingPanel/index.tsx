import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

export default class LoadingPanel extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <div className="loading-spinner">
              <div className="fa fa-spinner fa-spin"></div>
            </div>
          </Col>
        </Row>
      </Container>
    )
  };
}

