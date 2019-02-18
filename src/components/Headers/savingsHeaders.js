import React, { Component } from 'react';
import Display from '../UI/Display';


class SavingsHeaders extends Component {
  editHeaderConfirm = (header) => {}
  editHeaderCancel = (header) => {}
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
  newHeader = () => {
    this.props.addHeaderCallback('savings');
  }

  render() {
    const {headers} = this.props;
    console.log('headers', headers);

    return (
      <React.Fragment>
        <div className={'row'}>
          <div className={'col mt-4'}>
            <h3>Savings</h3>
          </div>
        </div>

        <div className={`row ${Display.showIf(!headers.savings.length)}`}>
          <div className={'col'}>
            No headers
          </div>
        </div>

        {headers.savings.map((header, key) => (
        <div className={'form-row form-headers'} key={key}>
          <div className={'col-2'}>
            <span className={`label-fake-input ${Display.hideIf(header.$edit)}`}>
              {header.label}
            </span>
            <input type={'text'} value={header.$editLabel} className={`form-control ${Display.showIf(header.$edit)}`} />
          </div>
          <div className={'col-2'}>
            <span className={`label-fake-input ${Display.hideIf(header.$edit)}`}>
              {header.sublabel}
            </span>
            <input type={'text'} value={header.$editSublabel} className={`form-control ${Display.showIf(header.$edit)}`} />
          </div>
          <div className={'col-3'}>
            <span className={`label-fake-input nowrap-ellipsis ${Display.hideIf(header.$edit)}`}>
              {header.icon}
            </span>
            <input type={'text'} value={header.$editIcon} className={`form-control ${Display.showIf(header.$edit)}`} />
          </div>
          <div className={'col-2'}>
            <div className={'checkbox'}>
              <label>
                <input type={'checkbox'} value={header.interest} disabled={!header.$edit} /> Yields interest
              </label>
            </div>
          </div>
          <div className={'col-3'} style={{textAlign: 'right'}}>
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
            <span className={`btn btn-link ${Display.hideIf(header.$edit)} ${(key === 0) ? 'disabled' : ''}`} onClick={e => this.moveUpHeader(key)}>
              <i className={'fa fa-lg fa-chevron-up'}></i>
            </span>
            <span className={`btn btn-link ${Display.hideIf(header.$edit)} ${(key >= headers.savings.length-1) ? 'disabled' : ''}`} onClick={e => this.moveDownHeader(key)}>
              <i className={'fa fa-lg fa-chevron-down'}></i>
            </span>
          </div>
        </div>
        ))}

        <div className={'row'}>
          <div className={'col'}>
            <button type={'button'} className={'btn btn-light btn-block'} onClick={this.newHeader}>
              Add new
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SavingsHeaders;