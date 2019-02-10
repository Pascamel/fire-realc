import React, { Component } from 'react';
import { compose } from 'recompose';

import ErrorPanel from '../UI/ErrorPanel';
import LoadingPanel from '../UI/LoadingPanel';
import * as ERRORS from '../../constants/errors';
import * as ROLES from '../../constants/roles';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../UserSession/Session';

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

    this.props.firebase.getUser(this.props.firebase.getCurrentUserUID()).then((userSnapshot) => {
      const data = userSnapshot.data().type;

      if (data !== ROLES.ADMIN) {
        this.setState({loading: false, error: ERRORS.NOT_AUTHORIZED});
        return;
      }

      this.props.firebase.getUsers().then(snapshot => {
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
    });
  }

  render() {
    const { users, loading, error } = this.state;

    if (error) {
      return (
        <ErrorPanel code={error} />
      );
    }

    return ( 
      <div>
        <h1>Admin</h1>
        {loading && <LoadingPanel />}
        {!loading && <p>{users.length} user(s)</p>}
        {!loading && <UserList users={users} />}
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
  withAuthorization((authUser) => !!authUser),
  withFirebase,
)(AdminPage);
