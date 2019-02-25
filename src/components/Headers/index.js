import React, { Component } from 'react';
import { compose } from 'recompose';
import _ from 'lodash';
import uuid from "uuid";

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

  callbacks = {
    editHeaderCallback: (type, header) => {
      let new_headers = JSON.parse(JSON.stringify(this.state.headers));

      _.each(new_headers[type], (h) => {
        if (h.id !== header.id) return;
        h.$edit = true;
      });

      this.setState({updated: true, headers: new_headers});
    },

    confirmEditHeaderCallback: (type, header) => {
      let new_headers = JSON.parse(JSON.stringify(this.state.headers));

      _.each(new_headers[type], (h) => {
        if (h.id !== header.id) return;
        h.$edit = false;
      });

      this.setState({updated: true, headers: new_headers});
    },

    cancelEditHeaderCallback: (type, header) => {
      let new_headers = JSON.parse(JSON.stringify(this.state.headers));

      _.each(new_headers[type], (h) => {
        if (h.id !== header.id) return;
        h.$edit = false;
      });

      this.setState({updated: true, headers: new_headers});
    },

    deleteHeaderCallback: (type, header) => {
      let new_headers = JSON.parse(JSON.stringify(this.state.headers));

      _.remove(new_headers[type], (h) => h.id === header.id);

      this.setState({updated: true, headers: new_headers});
    },

    moveUpHeaderCallback: (type, index) => {
      if (index <= 0 || index >= this.state.headers[type].length) return;

      let new_headers = JSON.parse(JSON.stringify(this.state.headers));
  
      var tmp = new_headers[type][index-1];
      new_headers[type][index-1] = new_headers[type][index];
      new_headers[type][index] = tmp;

      this.setState({updated: true, headers: new_headers});
    },
  
    moveDownHeaderCallback: (type, index) => {
      if (index < 0 || index >= this.state.headers[type].length - 1) return;

      let new_headers = JSON.parse(JSON.stringify(this.state.headers));
  
      var tmp = new_headers[type][index+1];
      new_headers[type][index+1] = new_headers[type][index];
      new_headers[type][index] = tmp;

      this.setState({updated: true, headers: new_headers});
    },

    updateCallback: (indexes, value) => {
      let head = indexes.shift();
      let update = JSON.parse(JSON.stringify(this.state[head]));
  
      _.set(update, indexes, value);
      this.setState({[head]: update, updated: true});
    },
    addHeaderCallback: (type) => {
      let new_headers = JSON.parse(JSON.stringify(this.state.headers));
      new_headers[type].push({
        $edit: true,
        id: uuid.v4()
      });
  
      this.setState({updated: true, headers: new_headers});
    }
  };
  
  render () {
    const {loading} = this.state;

    return (
      <React.Fragment>
      {!loading && <SavePanel label="Settings" saveClick={this.saveHeaders} updated={this.state.updated} />}
      <div className="container">
        {loading && <LoadingPanel />}
        {!loading && <StartingPoint {...this.state} {...this.callbacks} /> }
        {!loading && <SavingsHeaders {...this.state} {...this.callbacks} /> }
        {!loading && <IncomeHeaders {...this.state} {...this.callbacks} /> }
      </div>        
      </React.Fragment>
    );
  }
}

export default compose(
  withAuthorization((authUser) => !!authUser),
  withFirebase,
)(HeadersPage);
