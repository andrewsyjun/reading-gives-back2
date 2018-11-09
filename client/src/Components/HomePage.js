import React, { Component, button } from 'react';
import { Link } from 'react-router-dom';

import { withAuth } from '@okta/okta-react';

import GetMyPoints from './Utils/GetMyPoints'

import fortnitelogo from '../assets/fortnite.jpg';
import arrow from '../assets/submit.gif';

import GetMyRedeemedMinutes from './Utils/GetMyRedeemedMinutes';
import GetMyUsedMinutes from './Utils/GetMyUsedMinutes';

class Homepage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: null
    };
  }


  checkAuthentication = async () => {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  };


  async componentDidMount() {
    this.checkAuthentication();
  }

  async componentDidUpdate() {
    this.checkAuthentication();
  }

  login = async () => {
    this.props.auth.login('/');
  };

  logout = async () => {
    this.props.auth.logout('/');
  };


  render() {
    if (this.state.authenticated === null) {
      return null;
    }

      const mainContent = this.state.authenticated ? (
        <div className="content-pane-welcome">
          <h1>Reading Nook</h1><br />
          Welcome {JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.name}! Are you ready to start earning more points? <br />

          Your redeemable points to date is <GetMyPoints userName={JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.email} /> points!
        <br /> <br />
          To keep you up to current here is your personal usage information:<br />
          You have redeemed <GetMyRedeemedMinutes userName={JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.email} /> token(s) and have used <GetMyUsedMinutes userName={JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.email} /> token(s) to date.
  
      <br /> <br />
          <Link to="/myreadinglog">
            <div className="lets-go">
              <label htmlFor="arrow-image-button">Let's Get Started</label>
              <input id="arrow-image-button" type="image" src={arrow} alt="Submit" className="image-button" />
            </div>
          </Link>
        </div >
      ) : (

          <div className="content-pane-welcome">
            <p className="lead">
              If you would like to get started, please ask your mom or dad for an account.
        </p>
            <button className="btn btn-dark btn-lg" onClick={this.login}>
              Sign In
        </button>
          </div>
        );

      return (
        <div>
          <header>
            <img src={fortnitelogo} alt="fortnitelogo" className="banner-image" />
          </header>
          {mainContent}
        </div>
      )
    }
  };

  export default withAuth(Homepage);
