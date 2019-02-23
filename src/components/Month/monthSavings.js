import React, { Component } from 'react';
import _ from 'lodash';
import FireAmount from '../Finance/FireAmount';


class MonthSavings extends Component {
  constructor (props) {
    super(props);

    let header_label = _(props.bank.savingsHeaders).keyBy('id').get([props.header.id, 'label'], 'N/A');
    if (_(props.bank.savingsHeaders).keyBy('id').get([props.header.id, 'interest'])) {
      header_label += ' > ' + props.header.type;
    }
    
    this.state = {
      label: header_label
    }
  }

  render () {
    const { header, month, year, callback, data } = this.props;

    return (
      <React.Fragment>
        <div className="month-amount">
          <span className="label-fake-input smaller mb-1">
            {this.state.label}
          </span>
          <div className="pull-right">
            <FireAmount amount={_.get(data, [header.id, header.type])} 
                        callback-props={['savings', year, month, header.id, header.type]} 
                        callback={callback} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MonthSavings;
