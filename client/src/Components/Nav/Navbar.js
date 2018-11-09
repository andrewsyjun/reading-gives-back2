import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withAuth } from '@okta/okta-react';
import { Query } from 'react-apollo';
import { getUser } from '../../queries/queries';

import GetMyPoints from '../Utils/GetMyPoints'


class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
      userName: '',
      readerName: ''
    };
  }

  checkAuthentication = async () => {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      let userName = '';
      let readerName = '';
      if (authenticated) {
        userName = JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.email;
        readerName = JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.name;

        this.setState({
          userName: userName,
          readerName: readerName,
          authenticated: authenticated
        })
      }
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
    this.props.auth.logout('/login');
  };

  display(data) {

    if (this.state.authenticated && data.user.roleName === "Parent") {
      return (
        <li className="nav-item">
          <Link className="nav-link" to="/review">
            Review
      </Link>
        </li>
      )
    } else {
      return (
        <li />
      )
    }

  }

  render() {

    if (this.state.authenticated === null) return null;

    const logoutButtonContent = this.state.authenticated ? (

      <li margin-left="10px" className="nav-item">
        <button className="btn btn-light btn-lg button-font" onClick={this.logout}>
          Sign Out
          </button>
      </li>
    ) : (
        <li></li>
      );

    const userMessage = this.state.authenticated ? (
      <div className="nav-link points-block"> {this.state.readerName}, you have <GetMyPoints userName={this.state.userName} id="go" /> redeemable points </div>

    ) : (
        <div className="nav-link"></div>
      );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-1 navbar-font">
        <div className="container-fluid align-left">
          <Link className="navbar-brand navbar-font" to="/homepage">Reading Gives Back</Link>
          <div className="collapse navbar-collapse mr-auto align-middle">{userMessage}</div>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/homepage">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/myreadinglog">
                  Reading Log
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/mycontributions">
                  Contribution
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/redeempoints">
                  Points Redeemed
                </Link>
              </li>
              <Query query={getUser}
                variables={{ userName: this.state.userName }} >
                {({ loading, error, data }) => {
                  if (loading) return <div>Fetching</div>
                  if (error) return <div>Error</div>

                  return (
                    <div>
                      {this.display(data)}
                    </div>
                  )
                }
                }
              </Query >
              {logoutButtonContent}
            </ul>
          </div>
        </div>
      </nav >
    );
  }
};


export default withAuth(Navbar);