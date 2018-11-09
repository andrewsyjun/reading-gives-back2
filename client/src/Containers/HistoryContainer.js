import React, { Component } from 'react';

import History from '../Components/History/History';

class HistoryContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.email
    }
  }

  render() {
    return (
      <div className="history-container">
        <History userName={this.state.userName} />
      </div>
    )
  }
}

export default HistoryContainer;