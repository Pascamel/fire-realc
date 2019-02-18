import React, { Component } from 'react';

class SavePanelMonth extends Component {
  render() {
    const { label, updated, saveClick } = this.props;

    return (
      <div className={`alert ${updated ? 'alert-danger' : 'alert-light'}`}>
        <div className="text-center" style={{height: '38px'}}>
          <div className="btn-group pull-left">
            <button className="btn btn-light">
              <i class="fa fa-backward"></i>
            </button>
            <button className="btn btn-light">  
              <i class="fa fa-forward"></i>
            </button>
          </div>
          <span className="title">
            Month title todo
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

export default SavePanelMonth;