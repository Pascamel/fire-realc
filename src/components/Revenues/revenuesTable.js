import React from 'react';

import RevenuesTableHeader from './revenuesTableHeader';
import RevenuesTableBody from './revenuesTableBody';

const RevenuesTable = ({ income, headersLine, year_headers }) => {
  return (
    <table className="table table-striped table-finances">
      <RevenuesTableHeader key="1" headersLine={headersLine} />
      {Object.entries(income).map((year) => (
      <RevenuesTableBody key={year[0]} income={income} year={year[0]} headersLine={headersLine} year_headers={year_headers} />
      ))}
    </table>
  );
};

export default RevenuesTable;