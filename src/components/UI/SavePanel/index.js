import React, { Component } from 'react';
import Display from '../../UI/Display';
import { Row, Col, Container } from 'reactstrap';

class SavePanel extends Component {
  render() {
    const { label, updated, saveClick } = this.props;

    return (
      <Container fluid className={`alert ${updated ? 'alert-danger' : 'alert-light'}`}>
        <Row>
          <Col>
            <Container>
              <Row>
                <Col>
                  <span className={Display.showIf(updated)}>
                    <i className="fa fa-lg fa-exclamation-triangle"></i>
                    Updates have been detected. Save now!
                  </span>
                  <span className={`title ${Display.hideIf(updated)}`}>
                    {label}
                  </span>
                  <button className={`btn btn-save pull-right ${updated ? 'btn-danger' : ''}`} onClick={saveClick}>
                    <i className="fa fa-floppy-o"></i>
                    Save
                  </button>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
} 

class SavePanelMonth extends Component {
  render() {
    const { month, year, updated, saveClick } = this.props;

    return (
      <Container fluid className={`alert ${updated ? 'alert-danger' : 'alert-light'}`}>
        <Row>
          <Col>
            <Container>
              <Row>
                <Col className="text-center">
                  <div className="btn-group pull-left">
                    <button className={`btn ${updated ? 'btn-danger' : 'btn-light'}`} onClick={this.props.prevMonth}>
                      <i className="fa fa-backward"></i>
                    </button>
                    <button className={`btn ${updated ? 'btn-danger' : 'btn-light'}`} onClick={this.props.nextMonth}>  
                      <i className="fa fa-forward"></i>
                    </button>
                  </div>
                  <span className="title">
                    {Display.labelMonth(month)} {year}
                  </span>
                  <button className={`btn btn-save pull-right ${updated ? 'btn-danger' : 'btn-light'}`} onClick={saveClick}>
                    <i className="fa fa-floppy-o"></i>
                    Save
                  </button>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}



export default SavePanel;

export { SavePanelMonth };