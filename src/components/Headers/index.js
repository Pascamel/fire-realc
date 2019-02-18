import React, { Component } from 'react';
import { compose } from 'recompose';
import _ from 'lodash';

import { withAuthorization } from '../UserSession/Session';
import { withFirebase } from '../Firebase';

import LoadingPanel from '../UI/LoadingPanel';
import SavePanel from '../UI/SavePanel';
import StartingPoint from './startingPoint';
import SavingsHeaders from './savingsHeaders';
import IncomeHeaders from './incomeHeaders';

class HeadersPage extends Component {
  constructor(props) {
    super(props);

    this.newHeaderLabel = '';
    this.newHeaderSublabel = '';
    this.newHeaderIcon = '';
    this.newIncomeLabel = '';
    this.newIncomePretax = false;
    this.newIncomeCount = 1;

    this.state = {
      loading: true,
      updated: false,
      headers: {
        headers: [],
        incomes: [],
        startingCapital: 0
      }
    };
  }

  default_headers = {
    savings: [],
    incomes: [],
    startingCapital: 0
  }

  componentDidMount () {
    this.props.firebase.getHeaders().then((snapshotHeaders) => {
      let headers = snapshotHeaders.data() || this.default_headers;
      this.setState({
        loading: false, 
        updated: false, 
        headers: headers,
      });
    });
  }

  saveHeaders = () => {
    this.setState({last_update: (new Date()).getTime()});
    this.props.firebase.setHeaders(this.state.headers).then(() => {
      this.setState({updated: false});
    });
  }

  updateCallback = (indexes, value) => {
    let head = indexes.shift();
    let update = JSON.parse(JSON.stringify(this.state[head]));

    _.set(update, indexes, value);
    let state_update = {updated: true}
    state_update[head] = update;
    
    this.setState(state_update);
  }

  addHeaderCallback = (type) => {
    let new_headers = JSON.parse(JSON.stringify(this.state.headers));
    new_headers[type].push({$edit: true});

    this.setState({updated: true, headers: new_headers});
  }

  callbacks = () => {
    return {
      updateCallback: (indexes, value) => {
        let head = indexes.shift();
        let update = JSON.parse(JSON.stringify(this.state[head]));
    
        _.set(update, indexes, value);
        let state_update = {updated: true}
        state_update[head] = update;
        
        this.setState(state_update);
      },
    
      addHeaderCallback: (type) => {
        console.log('addHeaderCallback', type);
      }
    }
  }

  render () {
    const {loading} = this.state;

    return (
      <div className={'container'}>
        {loading && <LoadingPanel />}
        {!loading && <SavePanel label={'Savings'} saveClick={this.saveHeaders} updated={this.state.updated} />}
        {!loading && <StartingPoint {...this.state} updateCallback={this.updateCallback} />}
        {!loading && <SavingsHeaders {...this.state} 
                                     updateCallback={this.updateCallback} 
                                     addCallback={this.addHeaderCallback} 
                                     /> }
        {!loading && <IncomeHeaders {...this.state} 
                                    updateCallback={this.updateCallback}
                                    addCallback={this.addHeaderCallback} 
                                    /> }
      </div>        
    );
  }
}

export default compose(
  withAuthorization((authUser) => !!authUser),
  withFirebase,
)(HeadersPage);
