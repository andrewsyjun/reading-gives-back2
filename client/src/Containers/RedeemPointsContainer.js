import React, { Component } from 'react';

import Redeemed from '../Components/Redeemed';

class RedeemPointsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.email
    }
  }

  render() {


    return (
      <Redeemed userName={this.state.userName} />
    )


  }
}


export default RedeemPointsContainer;