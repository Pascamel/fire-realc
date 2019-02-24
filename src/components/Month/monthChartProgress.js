import React, { Component } from 'react';
import Display from '../UI/Display';


class MonthChartProgress extends Component {
  render () {
    const { result, goal, percentage, label } = this.props

    return (
      <React.Fragment>
        <div className="row">
          <div className="col">
            <span>{label}</span>
          </div>
          <div className="col text-right">
            <span className={`${result >= 0 ? 'text-success':'text-danger'} ${Display.hideIf(result === 0)}`}>
              ${Display.amount(Math.abs(result))} {result > 0 ? 'over' : 'left'}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="progress mb-2">
              <div className={`progress-bar ${result >= 0 ? 'bg-success' : 'bg-danger'}`}
                  role="progressbar" 
                  style={{width: percentage + '%'}}>
                ${Display.amount(result + goal)}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MonthChartProgress;
