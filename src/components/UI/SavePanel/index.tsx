import React, { Component } from 'react';
import Display from '../../UI/Display';
import { Row, Col, Container, ButtonGroup, Button } from 'reactstrap';

import FiltersBtn from './FiltersBtn';
import ButtonDecimals from './DecimalsBtn';
import Bank from '../../Finance/Bank';

interface ISavePanelProps {
  updated: boolean, 
  saveInProgress: boolean, 
  label: string, 
  bank: Bank
  saveClick: () => void,
  prevMonth: () => void,
  nextMonth: () => void,
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

interface ISavePanelState {
  
}

class SavePanel extends Component<ISavePanelProps, ISavePanelState> {
  render() {
    const { updated, saveInProgress, label, saveClick } = this.props;

    return (
      <Container fluid className={`alert ${updated ? 'alert-warning' : 'alert-light'}`}>
        <Row>
          <Col>
            <Container>
              <Row>
                <Col className="text-center">
                
                  {label === 'Savings' && <ButtonGroup className="pull-left">
                    <FiltersBtn {...this.props} />
                    <ButtonDecimals {...this.props} />
                  </ButtonGroup>}

                  {label === 'Revenues' && <ButtonGroup className="pull-left">
                  <ButtonDecimals {...this.props} />
                  </ButtonGroup>}

                  {label !== 'Savings' && label !== 'Revenues' && label !== 'Settings' && 
                  <ButtonGroup className="pull-left">
                    <Button color={updated ? 'warning' : 'light'} onClick={this.props.prevMonth}>
                      <i className="fa fa-backward"></i>
                    </Button>
                    <Button color={updated ? 'warning' : 'light'} onClick={this.props.nextMonth}>
                      <i className="fa fa-forward"></i>
                    </Button>
                  </ButtonGroup>}                

                  <span className={Display.showIf(updated)}>
                    <i className="fa fa-lg fa-exclamation-triangle"></i>
                    Updates have been detected. Save now!
                  </span>
                  <span className={`title ${Display.hideIf(updated)}`}>
                    {label}
                  </span>

                  <button className={`btn btn-save pull-right ${updated ? 'btn-warning' : 'btn-light'}`} onClick={saveClick}>
                    {!saveInProgress && <i className="fa fa-floppy-o"></i>}
                    {saveInProgress && <i className="fa fa-spinner fa-spin"></i>}
                    {saveInProgress ? 'Saving' : 'Save'}
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
