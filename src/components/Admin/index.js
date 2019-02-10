import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../UserSession/Session';
// import * as ROLES from '../../constants/roles';

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().then(snapshot => {

      let mapUsers = async (users) => {
        const result = [];

        for (const user of users) {
          const userData = await user.data();
          result.push({
            ...userData,
            uid: user.id
          });
        }

        return Promise.resolve(result);
      }
      
      mapUsers(snapshot.docs).then(users => {
        this.setState({
          users: users,
          loading: false
        });
      });
    });
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div>
        <h1>Admin</h1>
        {loading && <div>Loading ...</div>}
        {!loading && <p>{users.length} user(s)</p>}
        <UserList users={users} />
      </div>
    );
  }
};

const UserList = ({ users }) => (
  <ul>
    {users.map(user => (
      <li key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
      </li>
    ))}
  </ul>
);

export default compose(
  withAuthorization(authUser => !!authUser),
  withFirebase,
)(AdminPage);
