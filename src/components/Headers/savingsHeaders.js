import React, { Component } from 'react';
import SavingsHeader from './savingsHeader';
import Display from '../UI/Display';


class SavingsHeaders extends Component {
  newHeader = () => {
    this.props.addHeaderCallback('savings');
  }

  render() {
    const {headers} = this.props;

    return (
      <React.Fragment>
        <div className="row">
          <div className="col mt-4">
            <h3>Savings</h3>
          </div>
        </div>
        <div className={`row ${Display.showIf(!headers.savings.length)}`}>
          <div className="col">
            No headers
          </div>
        </div>
        {headers.savings.map((header, key) => (
          <SavingsHeader key={key} header={header} index={key} {...this.props} />
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

export default SavingsHeaders;
