import React, { Component } from 'react';
import { compose } from 'recompose';
import moment from 'moment'
import _ from 'lodash';

import LoadingPanel from '../UI/LoadingPanel';
import Display from '../UI/Display';
import SavePanel from '../UI/SavePanel';
import { withAuthorization } from '../UserSession/Session';
import { withFirebase } from '../Firebase';

class HeadersPage extends Component {
  constructor(props) {
    super(props);

    this.currentYear = new Date().getFullYear();

    this.newHeaderLabel = '';
    this.newHeaderSublabel = '';
    this.newHeaderIcon = '';
    this.newIncomeLabel = '';
    this.newIncomePretax = false;
    this.newIncomeCount = 1;

    this.state = {
      loading: true,
      headers: {
        headers: [],
        incomes: [],
        startingCapital: 0
      }
    };
  }

  componentDidMount () {
    this.props.firebase.getHeaders().then((snapshotHeaders) => {
      let headers = snapshotHeaders.data().data;
      this.setState({
        loading: false, 
        updated: false, 
        headers: headers,
      });

      Object.entries(this.state.headers.headers).map((header, key) => {
        console.log('header', header);
      });

      this.state.headers.headers.map((header, key) => {
        console.log('header', header);
      });
    });
  }

  labelMonth = (m) => {
    return moment().month(m-1).format('MMMM');
  };

  newStartingCapital = (value) => {
    console.log('newStarttingCapital', value);

    const new_headers = {};
    new_headers.startingCapital = value;


    this.setState({headers: new_headers, updated: true});
  }

  saveHeaders = () => {

  }

  render () {
    const{headers, loading} = this.state;

    return (
      
      <div className={'container'}>

        {loading && <LoadingPanel />}
        {!loading && <SavePanel label={'Savings'} saveClick={this.saveHeaders} updated={this.state.updated} />}

        <div className="row">
          <div className="col">
            <h3>Starting point</h3>
          </div>
        </div>

        <div className="row">
          <div className="col" fire-loading="loaded">
            <div className="form-inline">
              <label>Starting Capital</label>
              <input type="text" value={headers.startingCapital} onChange={this.newStartingCapital} className="form-control" style={{width: '80px'}} />
              <label>First month</label>
              <select value={headers.firstMonth} className="form-control">
                {_.range(1, 13).map((m, key) => (
                  <option value={m} key={key}>{this.labelMonth(m)}</option>
                ))}
              </select>
              <select value={headers.firstYear} className="form-control">
                {_.range(this.currentYear - 10, this.currentYear + 1).map((y, key) => (
                  <option value={y} key={key}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h3>Savings</h3>
          </div>
        </div>

        <div className="row">
          <div className="col" fire-loading="loaded">
            <span ng-show="!headers.headers.length">No headers</span>
            {headers.headers.map((header, key) => (
            <div className="form-inline form-headers" key={key}>
              <div className="row">
                <div className="col-2">
                  <span className="label-fake-input" ng-hide="header.$edit">
                    {header.label}
                  </span>
                  <input type="text" value={header.$editLabel} className="form-control" ng-show="header.$edit" />
                </div>
                <div className="col-2">
                  <span className="label-fake-input" ng-hide="header.$edit">
                    {header.sublabel}
                  </span>
                  <input type="text" value={header.$editSublabel} className="form-control" ng-show="header.$edit" />
                </div>
                <div className="col-3">
                  <span className="label-fake-input nowrap-ellipsis" ng-hide="header.$edit">
                    {header.icon}
                  </span>
                  <input type="text" value={header.$editIcon} className="form-control" ng-show="header.$edit" />
                </div>
                <div className="col-2">
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" value={header.interest} ng-disabled="!header.$edit" /> Yields interest
                    </label>
                  </div>
                </div>
                <div className="col-3" style={{textAlign: 'right'}}>
                  <span className="btn btn-link" ng-show="header.$edit" ng-click="editHeaderConfirm('headers', header)">
                    <i className="fa fa-lg fa-check"></i>
                  </span>
                  <span className="btn btn-link" ng-show="header.$edit" ng-click="editHeaderCancel('headers', header)">
                    <i className="fa fa-lg fa-times"></i>
                  </span>
                  <span className="btn btn-link" ng-hide="header.$edit" ng-click="editHeader('headers', header)">
                    <i className="fa fa-lg fa-pencil"></i>
                  </span>
                  <span className="btn btn-link" ng-hide="header.$edit" ng-click="removeHeader('headers', header)">
                    <i className="fa fa-lg fa-trash-o"></i>
                  </span>
                  <span className="btn btn-link" ng-hide="header.$edit" ng-click="moveUpHeader('headers', $index)" ng-disabled="!$index">
                    <i className="fa fa-lg fa-chevron-up"></i>
                  </span>
                  <span className="btn btn-link" ng-hide="header.$edit" ng-click="moveDownHeader('headers', $index)" ng-disabled="$index>=headers.headers.length-1">
                    <i className="fa fa-lg fa-chevron-down"></i>
                  </span>
                </div>
              </div>
            </div>
            ))}
            <div className="row">
              <div className="col-xs-2">
                <input type="text" ng-model="newHeaderLabel" className="form-control" />
              </div>
              <div className="col-xs-2">
                <input type="text" ng-model="newHeaderSublabel" className="form-control" />
              </div>
              <div className="col-xs-3">
                <input type="text" ng-model="newHeaderIcon" className="form-control input-block" />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h3>Income</h3>
          </div>
        </div>

        <div className="row">
          <div className="col" fire-loading="loaded">
            <span ng-show="!headers.incomes.length">No headers</span>
            {headers.incomes.map((income, key) => (
            <div className="form-inline form-headers" ng-repeat="income in headers.incomes track by income.id" key={key}>
              <div className="row">
                <div className="col-xs-7">
                  <span className="label-fake-input" ng-hide="income.$edit">
                    {income.label}
                  </span>
                  <input type="text" ng-model="income.$editLabel" className="form-control" ng-show="income.$edit" />
                </div>
                <div className="col-xs-3">
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" value={income.pretax} className={Display.hideIf(income.$edit)} disabled />
                      <input type="checkbox" value={income.$editPretax} className={Display.showIf(income.$edit)} />
                      Pre-tax
                    </label>
                  </div>
                  <div className="btn-group">
                    <label className="btn btn-default" value={income.count} uib-btn-radio="1">1</label>
                    <label className="btn btn-default" value={income.count} uib-btn-radio="2">2</label>
                  </div>
                </div>
                <div className="col-xs-2" style={{textAlign: 'right'}}>
                  <span className="btn btn-link" class={Display.hideIf(income.$edit)} ng-click="editHeaderConfirm('incomes', income)">
                    <i className="fa fa-lg fa-check"></i>
                  </span>
                  <span className="btn btn-link" class={Display.hideIf(income.$edit)} ng-click="editHeaderCancel('incomes', income)">
                    <i className="fa fa-lg fa-times"></i>
                  </span>
                  <span className="btn btn-link" class={Display.hideIf(income.$edit)} ng-click="editHeader('incomes', income)">
                    <i className="fa fa-lg fa-pencil"></i>
                  </span>
                  <span className="btn btn-link" class={Display.hideIf(income.$edit)} ng-click="removeHeader('incomes', income)">
                    <i className="fa fa-lg fa-trash-o"></i>
                  </span>
                  <span className="btn btn-link" class={Display.hideIf(income.$edit)} ng-click="moveUpHeader('incomes', $index)" ng-disabled="!$index">
                    <i className="fa fa-lg fa-chevron-up"></i>
                  </span>
                  <span className="btn btn-link" class={Display.hideIf(income.$edit)} ng-click="moveDownHeader('incomes', $index)" ng-disabled="$index>=headers.headers.length-1">
                    <i className="fa fa-lg fa-chevron-down"></i>
                  </span>
                </div>
              </div>
            </div>
            ))}
            <div className="form-inline form-headers">
              <div className="row">
                <div className="col-xs-7">
                  <input type="text" value={this.newIncomeLabel} className="form-control" />
                </div>
                <div className="col-xs-3">
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" value={this.newIncomePretax} ng-disabled="!income.$edit" /> Pre-tax
                    </label>
                  </div>
                  <div className="btn-group">
                    <label className="btn btn-default" value={this.newIncomeCount} uib-btn-radio="1">1</label>
                    <label className="btn btn-default" value={this.newIncomeCount} uib-btn-radio="2">2</label>
                  </div>
                  <button className="btn btn-default" ng-click="addHeader('headers')">Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withAuthorization((authUser) => !!authUser),
  withFirebase,
)(HeadersPage);
