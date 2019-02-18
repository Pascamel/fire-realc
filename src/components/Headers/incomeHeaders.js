import React, { Component } from 'react';
import Display from '../UI/Display';


class IncomeHeaders extends Component {

  editHeaderConfirm = (header) => {}
  editHeaderCancel = (header) => {}
  editHeader = (header) => {}
  removeHeader = (header) => {}
  moveUpHeader = (index) => {}
  moveDownHeader = (index) => {}

  newHeader = () => {
    this.props.addCallback('incomes');
  }

  render() {
    const { headers } = this.props;

    return (
      <React.Fragment>
        <div className={'row'}>
          <div className={'col mt-4'}>
            <h3>Income</h3>
          </div>
        </div>

        <div className={`row ${Display.showIf(!headers.incomes.length)}`}>
          <div className={'col'}>
            No headers
          </div>
        </div>

        {headers.incomes.map((income, key) => (
        <div className={'form-row form-headers'} key={key}>
          <div className={'col-7'}>
            <span className={`label-fake-input ${Display.hideIf(income.$edit)}`}>
              {income.label}
            </span>
            <input type={'text'} value={income.$editLabel} className={`form-control ${Display.showIf(income.$edit)}`} />
          </div>
          <div className={'col-2'}>
            <div style={{display: 'inline-block'}}>
              <label>
                <input type={'checkbox'} value={income.pretax} className={Display.hideIf(income.$edit)} disabled />
                <input type={'checkbox'} value={income.$editPretax} className={Display.showIf(income.$edit)} />
                <span className={'ml-1'}>
                  Pre-tax
                </span>
              </label>
            </div>
            <div className={'btn-group ml-3'}>
              <label className={`btn ${income.count === 1 ? 'btn-primary' : 'btn-light'}`}>1</label>
              <label className={`btn ${income.count === 2 ? 'btn-primary' : 'btn-light'}`}>2</label>
            </div>
          </div>
          <div className={'col-3'} style={{textAlign: 'right'}}>
            <span className={`btn btn-link ${Display.showIf(income.$edit)}`} onClick={this.editHeaderConfirm('incomes', income)}>
              <i className={'fa fa-lg fa-check'}></i>
            </span>
            <span className={`btn btn-link ${Display.showIf(income.$edit)}`} onClick={this.editHeaderCancel('incomes', income)}>
              <i className={'fa fa-lg fa-times'}></i>
            </span>
            <span className={`btn btn-link ${Display.hideIf(income.$edit)}`} onClick={this.editHeader('incomes', income)}>
              <i className={'fa fa-lg fa-pencil'}></i>
            </span>
            <span className={`btn btn-link ${Display.hideIf(income.$edit)}`} onClick={this.removeHeader('incomes', income)}>
              <i className={'fa fa-lg fa-trash-o'}></i>
            </span>
            <span className={`btn btn-link ${Display.hideIf(income.$edit)}`} onClick={this.moveUpHeader(key)} disabled={key===0}>
              <i className={'fa fa-lg fa-chevron-up'}></i>
            </span>
            <span className={`btn btn-link ${Display.hideIf(income.$edit)}`} onClick={this.moveDownHeader(key)} disabled={key>=headers.savings.length-1}>
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

export default IncomeHeaders