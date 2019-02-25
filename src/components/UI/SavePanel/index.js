import React, { Component } from 'react';
import Display from '../../UI/Display';
import { Row, Col, Container } from 'reactstrap';

class SavePanel extends Component {
  render() {
    const { label, updated, saveClick } = this.props;

    return (
      <Container fluid className={`alert ${updated ? 'alert-warning' : 'alert-light'}`}>
        <Row>
          <Col>
            <Container>
              <Row>
                <Col className="text-center">

                  {label === 'Savings' && 
                  <div className={`btn ${updated ? 'btn-warning' : 'btn-light'} pull-left`}>
                    todo savings
                  </div>}

                  {label === 'Revenues' && 
                  <div className={`btn ${updated ? 'btn-warning' : 'btn-light'} pull-left`}>
                    todo Revenues
                  </div>}

                  {label !== 'Savings' && label !== 'Revenues' && label !== 'Settings' && 
                  <div className="btn-group pull-left">
                    <button className={`btn ${updated ? 'btn-warning' : 'btn-light'}`} onClick={this.props.prevMonth}>
                      <i className="fa fa-backward"></i>
                    </button>
                    <button className={`btn ${updated ? 'btn-warning' : 'btn-light'}`} onClick={this.props.nextMonth}>  
                      <i className="fa fa-forward"></i>
                    </button>
                  </div>}                

                  <span className={Display.showIf(updated)}>
                    <i className="fa fa-lg fa-exclamation-triangle"></i>
                    Updates have been detected. Save now!
                  </span>
                  <span className={`title ${Display.hideIf(updated)}`}>
                    {label}
                  </span>

                  <button className={`btn btn-save pull-right ${updated ? 'btn-warning' : 'btn-light'}`} onClick={saveClick}>
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
