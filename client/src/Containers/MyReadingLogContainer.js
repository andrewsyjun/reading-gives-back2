import React, { Component } from 'react';

import MyReadingLog from '../Components/MyReadingLog';

class MyReadingLogContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.email
    }
  }

  render() {
    return (
      <div className="reading-log-container">
        <MyReadingLog userName={this.state.userName} />
      </div>
    )
  }
}


export default MyReadingLogContainer;