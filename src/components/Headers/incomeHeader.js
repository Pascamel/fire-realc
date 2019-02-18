import React, { Component } from 'react';
import Display from '../UI/Display';

class IncomeHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editLabel: this.props.header.label,
      editPretax: this.props.header.pretax,
      editCount: this.props.header.count
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
    header.pretax = this.state.editPretax;
    header.count = this.state.editCount;
    this.props.confirmEditHeaderCallback('incomes', header);
  }
  editHeaderCancel = (header) => {
    this.setState({
      editLabel: this.props.header.label || '',
      editPretax: this.props.header.pretax || false,
      editCount: this.props.header.count || 1
    });
    this.props.cancelEditHeaderCallback('incomes', header);
  }
  editHeader = (header) => {
    this.props.editHeaderCallback('incomes', header);
  }
  removeHeader = (header) => {
    this.props.deleteHeaderCallback('incomes', header);
  }
  moveUpHeader = (index) => {
    this.props.moveUpHeaderCallback('incomes', index);
  }
  moveDownHeader = (index) => {
    this.props.moveDownHeaderCallback('incomes', index);
  }
  render () {
    const { header, index, headers }  = this.props;

    return (
      <div className="form-row form-headers">
        <div className="col-7">
          <span className={`label-fake-input ${Display.hideIf(header.$edit)}`}>
            {header.label}
          </span>
          <input type="text" 
                 name="editLabel"
                 value={this.state.editLabel} 
                 onChange={this.handleInputChange} 
                 className={`form-control ${Display.showIf(header.$edit)}`} />
        </div>
        <div className="col-2">
          <div style={{display: 'inline-block'}}>
          <i className={`fa ${header.pretax?'fa-check-square-o':'fa-square-o'} ${Display.hideIf(header.$edit)}`}></i>
            <label>
              <input type="checkbox"
                     name="editPretax"
                     checked={this.state.editPretax}  
                     onChange={this.handleInputChange} 
                     className={Display.showIf(header.$edit)} />
              <span className="ml-1">Pre-tax</span>
            </label>
          </div>

          <div className={`btn-group ml-3 ${Display.hideIf(header.$edit)}`}>
            <label className={`disabled btn ${header.count === 1 ? 'btn-secondary' : 'btn-light'}`}>1</label>
            <label className={`disabled btn ${header.count === 2 ? 'btn-secondary' : 'btn-light'}`}>2</label>
          </div>

          <div className={`btn-group ml-3 ${Display.showIf(header.$edit)}`}>
            <label className={`btn ${this.state.editCount === 1 ? 'btn-primary' : 'btn-light'}`} onClick={e => {this.setState({editCount: 1});}}>1</label>
            <label className={`btn ${this.state.editCount === 2 ? 'btn-primary' : 'btn-light'}`} onClick={e => {this.setState({editCount: 2});}}>2</label>
          </div>
        </div>
        <div className="col-3" style={{textAlign: 'right'}}>
          <span className={`btn btn-link ${Display.showIf(header.$edit)}`} onClick={e => this.editHeaderConfirm(header)}>
            <i className="fa fa-lg fa-check"></i>
          </span>
          <span className={`btn btn-link ${Display.showIf(header.$edit)}`} onClick={e => this.editHeaderCancel(header)}>
            <i className="fa fa-lg fa-times"></i>
          </span>
          <span className={`btn btn-link ${Display.hideIf(header.$edit)}`} onClick={e => this.editHeader(header)}>
            <i className="fa fa-lg fa-pencil"></i>
          </span>
          <span className={`btn btn-link ${Display.hideIf(header.$edit)}`} onClick={e => this.removeHeader(header)}>
            <i className="fa fa-lg fa-trash-o"></i>
          </span>
          <span className={`btn btn-link ${Display.hideIf(header.$edit)} ${(index === 0) ? 'disabled' : ''}`} onClick={e => this.moveUpHeader(index)}>
            <i className="fa fa-lg fa-chevron-up"></i>
          </span>
          <span className={`btn btn-link ${Display.hideIf(header.$edit)} ${(index >= headers.savings.length-1) ? 'disabled' : ''}`} onClick={e => this.moveDownHeader(index)}>
            <i className="fa fa-lg fa-chevron-down"></i>
          </span>
        </div>
      </div>
    );
  }
}

export default IncomeHeader;
