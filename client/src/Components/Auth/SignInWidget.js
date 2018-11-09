import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import '@okta/okta-signin-widget/dist/css/okta-theme.css';
import OktaSignIn from '@okta/okta-signin-widget/dist/js/okta-sign-in-no-jquery';

class SignInWidget extends Component {
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    this.widget = new OktaSignIn({
      baseUrl: this.props.baseUrl,
      logo: 'logo.jpg'
    });
    this.widget.renderEl({ el }, this.props.onSuccess, this.props.onError);
  }

  componentWillUnmount() {
    if (this.widget) {
      this.widget.remove();
    }
  }

  render() {
    return <div />;
  }
}

export default SignInWidget;
