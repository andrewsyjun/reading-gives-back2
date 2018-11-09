import React, { Component } from 'react';

import ReviewPage from '../Components/ParentSection/ReviewPage';

class ParentSectionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.email
    }
  }

  render() {
    return (
      <div className="apoproval-container">
        <ReviewPage userName={this.state.userName} />
      </div>
    )
  }
}


export default ParentSectionContainer;