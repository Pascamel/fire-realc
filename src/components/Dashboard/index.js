import React from 'react';

import { withAuthorization } from '../UserSession/Session';

const DashboardPage = () => (
  <div>
    <h1>Dashboard</h1>
    <p>The Dashboard is accessible by every signed in user.</p>
  </div>
);

export default withAuthorization((authUser) => !!authUser)(DashboardPage);
