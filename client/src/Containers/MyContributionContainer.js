import React, { Component } from 'react';

import MyContribution from './../Components/Contribution/MyContribution';
import TaskList from './../Components/Tasks/TaskList';

class MyContributionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.email
    }
  }

  render() {
    return (
      <div className="tast-list-container">
        <TaskList userName={this.state.userName} />
        <MyContribution userName={this.state.userName} />
      </div>
    )
  }
}

export default MyContributionContainer;