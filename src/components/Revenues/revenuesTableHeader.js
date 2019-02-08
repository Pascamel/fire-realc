import React, { Component } from 'react';

class RevenuesTableHeader extends Component {
  render () {
    const {headersLine} = this.props;

    return (
      <thead>
        <tr>
          <th colSpan={2}></th>
          <th className={'separator'} colSpan={6}>Revenues</th>
          <th className={'separator'} colSpan={2}>Total</th>
          <th colSpan={1} style={{width: '70px'}}>Perf</th>
        </tr>
        <tr>
          <th></th>
          <th className={'separator'}>Savings</th>
          {headersLine.map((header) => (
            <th key={header.id} className={header.last ? 'separator' : ''}>{header.label}</th>
          ))}
          <th>Post</th>
          <th className={'separator'}>Pre</th>
          <th>SR</th>
        </tr>
      </thead>
    );    
  }
}

export default RevenuesTableHeader;