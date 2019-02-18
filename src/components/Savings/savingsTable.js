import React, { Component } from 'react';

import SavingsTableHeader from './savingsTableHeader';
import SavingsTableBody from './savingsTableBody';
import SavingsTableFooter from './savingsTableFooter';

class SavingsTable extends Component {
  render() {
    const {savings} = this.props;

    return (
      <table className="table table-striped table-finances">
        <SavingsTableHeader {...this.props} />
        {Object.entries(savings).map((year) => (
        <SavingsTableBody key={year[0]} year={year[0]} {...this.props} />
        ))}
        <SavingsTableFooter {...this.props} />
      </table>
    );
  }
}

export default SavingsTable;
