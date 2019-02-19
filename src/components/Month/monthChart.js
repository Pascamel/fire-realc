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

    console.log('savingRateMonth', savingRateMonth);

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
      <div className="container">
        <div className="row">
          <div className="col-8 pr-5">
            <div>
              <span>Month</span>
              <span className={`pull-right ${resultMonth > 0 ? 'text-success':'text-danger'}`}>
                ${Display.amount(Math.abs(resultMonth))} {resultMonth > 0 ? 'over' : 'left'}
              </span>
            </div>
            <div className="progress mb-3">
              <div className={`progress-bar ${resultMonth > 0 ? 'bg-success' : 'bg-danger'}`}
                   role="progressbar" 
                   style={{width: pctMonth + '%'}}>
                ${Display.amount(resultMonth + monthlyGoal)}
              </div>
            </div>
            <div>
              <span>Year</span>
              <span className={`pull-right ${resultYear > 0 ? 'text-success':'text-danger'}`}>
                ${Display.amount(Math.abs(resultYear))} {resultYear > 0 ? 'over' : 'left'}
              </span>
            </div>
            <div className="progress">
              <div className={`progress-bar ${resultYear > 0 ? 'bg-success' : 'bg-danger'}`}
                   role="progressbar" 
                   style={{width: pctYear + '%'}} >
                ${Display.amount(resultYear + month * monthlyGoal)}
              </div>
            </div>
          </div>
          <div className="col-2 chart-container">
            <Doughnut data={dataMonth} height={200} options={options}/>
            <span className="chart-label">{Math.round(savingRateMonth * 100)}%</span>
          </div>
          <div className="col-2 chart-container">
            <Doughnut data={dataYear} height={200} options={options}/>
            <span className="chart-label">{Math.round(savingRateYear * 100)}%</span>
          </div>
        </div>
      </div>
    );
  }
}

export default MonthChart;
