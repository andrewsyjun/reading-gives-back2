import React, { Component } from 'react';

import UserList from '../Components/UserList'

class UserListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.email
    }
  }

  render() {
    return (
      <UserList userName={this.state.userName} />
    )
  }
}


export default UserListContainer;