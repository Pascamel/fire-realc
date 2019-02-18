import React, { Component } from 'react';
import Display from '../UI/Display';

class SavingsTableHeader extends Component {
  render() {
    const { headersLine1, headersLine2 } = this.props;

    return (
      <thead>
        <tr>
          <th></th>
          {headersLine1.map((h1, idx) => (
          <th className="separator" colSpan={h1.weight} key={idx}>
            <span className={Display.hideIf(h1.icon)}>{h1.label}</span>
            <img src={h1.icon} alt="Institution" width="16" className={Display.showIf(h1.icon)} />
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