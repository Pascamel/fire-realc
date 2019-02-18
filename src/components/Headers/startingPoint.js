import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment'

class StartingPoint extends Component {

  constructor(props) {
    super(props);

    this.currentYear = new Date().getFullYear();
  }

  labelMonth = (m) => {
    return moment().month(m-1).format('MMMM');
  }

  onValueChange = (type, value) => {
    this.setState({inputStartingCapital: value})
    this.props.updateCallback(['headers', type], value);
  }

  render() {
    const {headers} = this.props;

    return (
      <React.Fragment>
        <div className={'row'}>
          <div className={'col'}>
            <h3>Starting point</h3>
          </div>
        </div>
        <div className={'row'}>
          <div className={'col'}>
            <div className={'form-inline'}>
              <label>Starting Capital</label>
              <input type={'text'} 
                     value={headers.startingCapital} 
                     onChange={(e) => this.onValueChange('startingCapital', parseFloat(e.target.value) || 0)}
                     className={'form-control'} 
                     style={{width: '80px', margin: '0 10px'}} />
              <label>First month</label>
              <select value={headers.firstMonth}
                      className={'form-control'} 
                      onChange={(e) => this.onValueChange('firstMonth', parseInt(e.target.value) || 0)} 
                      style={{margin: '0 10px'}}>
                {_.range(1, 13).map((m, key) => (
                  <option value={m} key={key}>{this.labelMonth(m)}</option>
                ))}
              </select>
              <select value={headers.firstYear}
                      className={'form-control'} 
                      onChange={(e) => this.onValueChange('firstYear', parseInt(e.target.value) || 0)}>
                {_.range(this.currentYear - 10, this.currentYear + 1).map((y, key) => (
                  <option value={y} key={key}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default StartingPoint;
