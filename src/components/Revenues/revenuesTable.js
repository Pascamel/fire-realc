import React, { Component } from 'react';

import RevenuesTableHeader from './revenuesTableHeader';
import RevenuesTableBody from './revenuesTableBody';

class RevenuesTable extends Component {
  render() {
    const { headersLine, income } = this.props;

    return (
      <table className="table table-striped table-finances">
        <RevenuesTableHeader key="1" headersLine={headersLine} />
        {Object.entries(income).map((year) => (
        <RevenuesTableBody key={year[0]} year={year[0]} {...this.props} />
        ))}
      </table>
    );
  }
}

export default RevenuesTable;