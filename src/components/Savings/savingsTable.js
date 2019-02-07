import React, { Component } from 'react';

import SavingsTableHeader from './savingsTableHeader';
import SavingsTableBody from './savingsTableBody';
import SavingsTableFooter from './savingsTableFooter';

class SavingsTable extends Component {
  render() {
    const { savings, headersLine1, headersLine2 } = this.props;

    return (
      <table className="table table-striped table-finances">
        <SavingsTableHeader key="1" headersLine1={headersLine1} headersLine2={headersLine2} />
        {Object.entries(savings).map((year) => (
        <SavingsTableBody key={year[0]} year={year[0]} {...this.props} />
        ))}
        <SavingsTableFooter key="2" />
      </table>
    );
  }
}

export default SavingsTable