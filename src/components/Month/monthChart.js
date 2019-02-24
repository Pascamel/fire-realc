import React, { Component } from 'react';
import { Row, Col, Alert } from 'reactstrap';
import MonthChartProgress from './monthChartProgress';
import MonthChartDoughnut from './monthChartDoughnut';


class MonthChart extends Component {
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
    const pctYear = Math.min(100, Math.max(0, 100 + 100 * (ry / (mg * month))));
    const savingRateMonth = this.props.bank.savingRateMonth(year, month);
    const savingRateYear = this.props.bank.savingRateYear(year, month);
    
    return (
      <React.Fragment>
        <Col>
          <Alert color="secondary">
            <MonthChartProgress result={resultMonth} 
                                goal={monthlyGoal} 
                                percentage={pctMonth} />
            <MonthChartProgress result={resultYear} 
                                goal={month * monthlyGoal} 
                                percentage={pctYear} />
            <Row>
              <MonthChartDoughnut savingRate={savingRateMonth} />
              <MonthChartDoughnut savingRate={savingRateYear} />
            </Row>
          </Alert>
        </Col>
      </React.Fragment>
    );
  }
}

export default MonthChart;
