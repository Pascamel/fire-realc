import React, { Component } from 'react';
import IncomeHeader from './incomeHeader';
import Display from '../UI/Display';


class IncomeHeaders extends Component {
  newHeader = () => {
    this.props.addHeaderCallback('incomes');
  }

  render() {
    const { headers } = this.props;

    return (
      <React.Fragment>
        <div className="row">
          <div className="col mt-4">
            <h3>Income</h3>
          </div>
        </div>

        <div className={`row ${Display.showIf(!headers.incomes.length)}`}>
          <div className="col">
            No headers
          </div>
        </div>

        {headers.incomes.map((header, key) => (
          <IncomeHeader key={key} header={header} index={key} {...this.props} />
        ))}

        <div className="row">
          <div className="col">
            <button type="button" className="btn btn-light btn-block" onClick={this.newHeader}>
              Add new
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default IncomeHeaders;
