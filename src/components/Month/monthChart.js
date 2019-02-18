import React, { Component } from 'react';
import {Doughnut} from 'react-chartjs-2';


class MonthChart extends Component {
  render() {
    const data = {
      // labels: ['Red', 'Green', 'Yellow'],
      datasets: [{
          data: [67, 33],
          backgroundColor: ['#FF6384', '#f5f5f5'],
          hoverBackgroundColor: ['#FF6384', '#f5f5f5'],
          borderWidth: [0, 0],
          hoverBorderWidth: [0, 0]
      }]
    };
    const options = {
      cutoutPercentage: 70,
      // responsive: true,
      // maintainAspectRatio: true,
      tooltips: {
        enabled: false
      }
    };

    return (
      <div className="container">
        <div className="row">
          <div className="col-8 pr-5">
            <div>
              <span>Month</span>
              <span className="pull-right">$2,000 left</span>
            </div>
            <div className="progress">
              <div className="progress-bar bg-success" role="progressbar" style={{width: '65%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                $4,000
              </div>
            </div>
            <div>
              <span>Year</span>
              <span className="pull-right">$400 over</span>
            </div>
            <div className="progress">
              <div className="progress-bar bg-success" role="progressbar" style={{width: '100%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                $12,000
              </div>
            </div>
          </div>
          {/* <div className="col-1"></div> */}
          <div className="col-2 chart-container">
            <Doughnut data={data} height={200} options={options}/>
            <span className="chart-label">34%</span>
          </div>
          <div className="col-2 chart-container">
            <Doughnut data={data} height={200} options={options}/>
            <span className="chart-label">76%</span>
          </div>
        </div>
      </div>
    );
  }
}

export default MonthChart;
