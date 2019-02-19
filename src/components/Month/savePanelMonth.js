import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Display from '../UI/Display';
//import * as ROUTES from '../../constants/routes';


class SavePanelMonth extends Component {
  render() {
    const { month, year, updated, saveClick } = this.props;

    return (
      <div className={`alert ${updated ? 'alert-danger' : 'alert-light'}`}>
        <div className="text-center" style={{height: '38px'}}>
          <div className="btn-group pull-left">
            <button className="btn btn-light" onClick={this.props.prevMonth}>
              <i className="fa fa-backward"></i>
            </button>
            <button className="btn btn-light" onClick={this.props.nextMonth}>  
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
        </div>
      </div>
    );
  }
}

export default withRouter(SavePanelMonth);