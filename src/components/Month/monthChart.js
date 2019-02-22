import React, { Component } from 'react';
import {Doughnut} from 'react-chartjs-2';
import Display from '../UI/Display';


class MonthChart extends Component {
  constructor(props) {
    super(props);

    this.state = {month: 1};
  }
  
  render() {
    const month = this.props.month;
    const year = this.props.year;

    const mg = this.props.bank.monthlyGoal(year);
    const rm = this.props.bank.goalMonth(month, year);
    const ry = this.props.bank.goalYearToDate(month, year);
    
    const monthlyGoal = mg;
    const resultMonth = rm;
    const pctMonth = Math.min(100, Math.max(0, 100 + 100 * (rm / mg)));
    const resultYear = ry;
    const pctYear = Math.min(1000, Math.max(0, 100 + 100 * (ry / (mg * month))));
    const savingRateMonth = this.props.bank.savingRateMonth(year, month);
    const savingRateYear = this.props.bank.savingRateYear(year);

    const dataMonth = {
      datasets: [{
        data: [
          Math.min(100, Math.max(0, savingRateMonth * 100)), 
          100 - Math.min(100, Math.max(0, savingRateMonth * 100))
        ],
        backgroundColor: ['#FF6384', '#f5f5f5'],
        hoverBackgroundColor: ['#FF6384', '#f5f5f5'],
        borderWidth: [0, 0],
        hoverBorderWidth: [0, 0]
      }]
    };
    const dataYear = {
      datasets: [{
        data: [
          Math.min(100, Math.max(0, savingRateYear * 100)), 
          100 - Math.min(100, Math.max(0, savingRateYear * 100))
        ],
        backgroundColor: ['#FF6384', '#f5f5f5'],
        hoverBackgroundColor: ['#FF6384', '#f5f5f5'],
        borderWidth: [0, 0],
        hoverBorderWidth: [0, 0]
      }]
    };
    const options = {
      cutoutPercentage: 70,
      tooltips: {
        enabled: false
      }
    };

    return (
      <React.Fragment>
        <div className="col">
          <div className="alert alert-secondary">
            <div className="row">
              <div className="col">
                <span>Month</span>
                <span className={`pull-right ${resultMonth > 0 ? 'text-success':'text-danger'}`}>
                  ${Display.amount(Math.abs(resultMonth))} {resultMonth > 0 ? 'over' : 'left'}
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="progress mb-2">
                  <div className={`progress-bar ${resultMonth > 0 ? 'bg-success' : 'bg-danger'}`}
                      role="progressbar" 
                      style={{width: pctMonth + '%'}}>
                    ${Display.amount(resultMonth + monthlyGoal)}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <span>Year</span>
                <span className={`pull-right ${resultYear > 0 ? 'text-success':'text-danger'}`}>
                  ${Display.amount(Math.abs(resultYear))} {resultYear > 0 ? 'over' : 'left'}
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="progress">
                  <div className={`progress-bar ${resultYear > 0 ? 'bg-success' : 'bg-danger'}`}
                      role="progressbar" 
                      style={{width: pctYear + '%'}}>
                    ${Display.amount(resultYear + month * monthlyGoal)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-6 chart-container" style={{background: '#ccc'}}>
              <Doughnut data={dataMonth} height={255} options={options}/>
              <span className="chart-label">{Math.round(savingRateMonth * 100)}%</span>
            </div>
            <div className="col-6 chart-container" style={{background: '#ddd'}}>
              <Doughnut data={dataYear} height={175} options={options}/>
              <span className="chart-label">{Math.round(savingRateYear * 100)}%</span>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MonthChart;
