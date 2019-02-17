import React, { Component } from 'react';
import Display from '../UI/Display';


class SavingsHeaders extends Component {

  editHeaderConfirm = (header) => {}
  editHeaderCancel = (header) => {}
  editHeader = (header) => {}
  removeHeader = (header) => {}
  moveUpHeader = (index) => {}
  moveDownHeader = (index) => {}

  render() {
    const {headers} = this.props;

    return (
      <React.Fragment>
        <div className={'row'}>
        <div className={'col'}>
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
            <span className={`btn btn-link ${Display.hideIf(header.$edit)}`} onClick={header => this.editHeaderConfirm(header)}>
              <i className={'fa fa-lg fa-check'}></i>
            </span>
            <span className={`btn btn-link ${Display.hideIf(header.$edit)}`} onClick={header => this.editHeaderCancel(header)}>
              <i className={'fa fa-lg fa-times'}></i>
            </span>
            <span className={`btn btn-link ${Display.hideIf(header.$edit)}`} onClick={header => this.editHeader(header)}>
              <i className={'fa fa-lg fa-pencil'}></i>
            </span>
            <span className={`btn btn-link ${Display.hideIf(header.$edit)}`} onClick={header => this.removeHeader(header)}>
              <i className={'fa fa-lg fa-trash-o'}></i>
            </span>
            <span className={`btn btn-link ${Display.hideIf(header.$edit)}`} onClick={header => this.moveUpHeader(key)} disabled={key===0}>
              <i className={'fa fa-lg fa-chevron-up'}></i>
            </span>
            <span className={`btn btn-link ${Display.hideIf(header.$edit)}`} onClick={header => this.moveDownHeader(key)} disabled={key>=headers.savings.length-1}>
              <i className={'fa fa-lg fa-chevron-down'}></i>
            </span>
          </div>
        </div>
        ))}
        
        <div className={'row'}>
        <div className={'col-2'}>
            <input type={'text'} ng-model={'newHeaderLabel'} className={'form-control'} />
          </div>
          <div className={'col-2'}>
            <input type={'text'} ng-model={'newHeaderSublabel'} className={'form-control'} />
          </div>
          <div className={'col-2'}>
            <input type={'text'} ng-model={'newHeaderIcon'} className={'form-control input-block'} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SavingsHeaders;