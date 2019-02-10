import React, { Component } from 'react';
import Display from '../../UI/Display';

class SavePanel extends Component {
  render() {
    const { label, updated, saveClick } = this.props;

    return (
      <div className={`alert ${updated ? 'alert-danger' : 'alert-light'}`}>
        <div style={{height: '38px'}}>
          <span className={Display.showIf(updated)}>
            <i className={'fa fa-lg fa-exclamation-triangle'}></i>
            Updates have been detected. Save now!
          </span>

          <span className={`title ${Display.hideIf(updated)}`}>
            {label}
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

export default SavePanel;
