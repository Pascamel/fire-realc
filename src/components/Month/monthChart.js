import React, { Component } from 'react';
import { Row, Col, Alert } from 'reactstrap';
import MonthChartProgress from './monthChartProgress';
import MonthChartDoughnut from './monthChartDoughnut';


class MonthChart extends Component {

  clean_pct(pct) {
    return Math.min(100, Math.max(0, 100 + 100 * pct));
  }

  render() {
    const { month, year, bank } = this.props;
    
    return (
      <React.Fragment>
        <Col>
          <Alert color="secondary">
            <MonthChartProgress label="Month"
                                result={bank.goalMonth(month, year, false)} 
                                goal={bank.monthlyGoal(year)} 
                                percentage={this.clean_pct(bank.goalMonth(month, year, false) / bank.monthlyGoal(year))} />
            <MonthChartProgress label="Year"
                                result={bank.goalYearToDate(month, year, false)} 
                                goal={month * bank.monthlyGoal(year)} 
                                percentage={this.clean_pct(bank.goalYearToDate(month, year, false) / bank.monthlyGoal(year) / month)} />
            <Row>
              <MonthChartDoughnut savingRate={bank.savingRateMonth(year, month)} />
              <MonthChartDoughnut savingRate={bank.savingRateYear(year, month, false)} />
            </Row>
            <Row className="text-center">
              <Col>Month</Col>
              <Col>Year</Col>
            </Row>
          </Alert>
        </Col>
      </React.Fragment>
    );
  }
}

export default MonthChart;
