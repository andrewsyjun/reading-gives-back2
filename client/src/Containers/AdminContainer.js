import React, { Component } from 'react';

import User from '../Components/Admin/User';
import Family from './../Components/Admin/Family';

class MyContributionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.email
    }
  }

  render() {
    return (
      <div className="admin-container">
        <h2>Users</h2>
        <User userName={this.state.userName} />
        <br />
        <br />
        <h2>Families</h2>
        <Family userName={this.state.userName} />
      </div>
    )
  }
}

export default MyContributionContainer;