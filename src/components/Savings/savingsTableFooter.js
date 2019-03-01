import React, { Component } from 'react';

class SavingsTableFooter extends Component {
  render() {
    const {bank} = this.props;

    return (
      <tfoot>
        <tr>
          <td><i className="fa fa-university"></i></td>
          {bank.savingsInputs(true).map((amount, key) => (
          <td className="table-warning" key={key}>
            { bank.grandTotalInstitution(amount.id, amount.type, true) }
          </td>
          ))}
          <td>Total</td>
          <td className="table-warning">{ bank && bank.grandTotalHolding() }</td>
          <td colSpan="3"></td>
        </tr>
      </tfoot>
    );
  }
}

export default SavingsTableFooter;