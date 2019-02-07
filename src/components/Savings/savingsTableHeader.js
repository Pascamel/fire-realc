import React, { Component } from 'react';

class SavingsTableHeader extends Component {
  render() {
    const { headersLine1, headersLine2 } = this.props;

    return (
      <thead>
        <tr>
          <th></th>
          {headersLine1.map((h1, idx) => (
          <th className="separator" colSpan={h1.weight} key={idx}>
            <span style={{display: h1.icon ? 'none' : 'inline-block' }}>{h1.label}</span>
            <img src={h1.icon} alt="Description" width={16} />
          </th>
          ))}
          <th className="separator" colSpan={2}>Total</th>
          <th colSpan={2}>Goal</th>
        </tr>
        <tr>
          <th></th>
          {headersLine2.map((h2, idx) => (
          <th key={idx} className={h2.last ? 'separator' : ''}>{h2.label}</th>
          ))}
          <th>Monthly</th>
          <th className="separator">Total</th>
          <th>Month</th>
          <th>Total</th>
        </tr>
      </thead>
    );
  }
}

export default SavingsTableHeader;