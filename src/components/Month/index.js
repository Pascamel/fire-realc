import React, {Component} from 'react';
import * as ROUTES from '../../constants/routes';
import MonthChart from './monthChart';
import MonthFinances from './monthFinances';
import LoadingPanel from '../UI/LoadingPanel';
import SavePanelMonth from './savePanelMonth';


class MonthPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updated: false
    };
  }

  componentDidMount() {
    const 
      year = parseInt(this.props.match.params.year) || 0,
      month = parseInt(this.props.match.params.month) || 0,
      currentYear = new Date().getFullYear(),
      currentMonth = new Date().getMonth() + 1,
      route = ROUTES.MONTH.replace(':year', currentYear).replace(':month', currentMonth);

    if (month < 1 || month > 12) this.props.history.push(route);
    if (year > currentYear) this.props.history.push(route);

    this.setState({
      month: month, 
      year: year
    })
  }

  saveData = () => {

  }

  render () {
    const {loading} = this.props;

    return (
      <React.Fragment>
        {loading && <LoadingPanel />}
        {!loading && <SavePanelMonth label="Revenues" saveClick={this.saveData} updated={this.state.updated} />}
        {!loading && <MonthChart />}
        {!loading && <MonthFinances />}
      </React.Fragment>
    );
  }
}

export default MonthPage;
