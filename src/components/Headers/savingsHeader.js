import React, { Component } from 'react';
import Display from '../UI/Display';

class SavingsHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editLabel: this.props.header.label || '',
      editSublabel: this.props.header.sublabel || '',
      editIcon: this.props.header.icon || '',
      editInterest: this.props.header.interest || ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  }

  editHeaderConfirm = (header) => {
    header.label = this.state.editLabel;
    header.sublabel = this.state.editSublabel;
    header.icon = this.state.editIcon;
    header.interest = this.state.editInterest;
    this.props.confirmEditHeaderCallback('savings', header);
  }

  editHeaderCancel = (header) => {
    this.setState({
      editLabel: this.props.header.label || '',
      editSublabel: this.props.header.sublabel || '',
      editIcon: this.props.header.icon || '',
      editInterest: this.props.header.interest || ''
    });
    this.props.cancelEditHeaderCallback('savings', header);
  }

  editHeader = (header) => {
    this.props.editHeaderCallback('savings', header);
  }

  removeHeader = (header) => {
    this.props.deleteHeaderCallback('savings', header);
  }

  moveUpHeader = (index) => {
    this.props.moveUpHeaderCallback('savings', index);
  }

  moveDownHeader = (index) => {
    this.props.moveDownHeaderCallback('savings', index);
  }

  render () {
    const { header, index, headers }  = this.props;

    return (
      <div className={'form-row form-headers'}>
        <div className={'col-2'}>
          <span className={`label-fake-input ${Display.hideIf(header.$edit)}`}>
            {header.label}
          </span>
          <input type="text"
                 name="editLabel"
                 value={this.state.editLabel} 
                 onChange={this.handleInputChange} 
                 className={`form-control ${Display.showIf(header.$edit)}`} />
        </div>
        <div className={'col-2'}>
          <span className={`label-fake-input ${Display.hideIf(header.$edit)}`}>
            {header.sublabel}
          </span>
          <input type="text"
                 name="editSublabel"
                 value={this.state.editSublabel} 
                 onChange={this.handleInputChange} 
                 className={`form-control ${Display.showIf(header.$edit)}`} />
        </div>
        <div className={'col-4'}>
          <span className={`label-fake-input nowrap-ellipsis ${Display.hideIf(header.$edit)}`}>
            {header.icon}
          </span>
          <input type="text"
                 name="editIcon"
                 value={this.state.editIcon} 
                 onChange={this.handleInputChange} 
                 className={`form-control ${Display.showIf(header.$edit)}`} />
        </div>
        <div className={'col-2'}>
          <div className={'checkbox'}>
            <i className={`fa mr-1 ${header.interest?'fa-check-square-o':'fa-square-o'} ${Display.hideIf(header.$edit)}`}></i>
            <label>
              <input type={'checkbox'} 
                     name="editInterest" 
                     checked={this.state.editInterest} 
                     onChange={this.handleInputChange} 
                     className={Display.showIf(header.$edit)} /> Interest
            </label>
          </div>
        </div>
        <div className={'col-2'} style={{textAlign: 'right'}}>
          <span className={`btn btn-link ${Display.showIf(header.$edit)}`} onClick={e => this.editHeaderConfirm(header)}>
            <i className={'fa fa-lg fa-check'}></i>
          </span>
          <span className={`btn btn-link ${Display.showIf(header.$edit)}`} onClick={e => this.editHeaderCancel(header)}>
            <i className={'fa fa-lg fa-times'}></i>
          </span>
          <span className={`btn btn-link ${Display.hideIf(header.$edit)}`} onClick={e => this.editHeader(header)}>
            <i className={'fa fa-lg fa-pencil'}></i>
          </span>
          <span className={`btn btn-link ${Display.hideIf(header.$edit)}`} onClick={e => this.removeHeader(header)}>
            <i className={'fa fa-lg fa-trash-o'}></i>
          </span>
          <span className={`btn btn-link ${Display.hideIf(header.$edit)} ${(index === 0) ? 'disabled' : ''}`} onClick={e => this.moveUpHeader(index)}>
            <i className={'fa fa-lg fa-chevron-up'}></i>
          </span>
          <span className={`btn btn-link ${Display.hideIf(header.$edit)} ${(index >= headers.savings.length-1) ? 'disabled' : ''}`} onClick={e => this.moveDownHeader(index)}>
            <i className={'fa fa-lg fa-chevron-down'}></i>
          </span>
        </div>
      </div>
    );
  }
}

export default SavingsHeader;
