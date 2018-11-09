import React, { Component } from 'react';

class Book extends Component {
  render() {
    return (
      <li className="Book">
        <strong>{this.props.book.title}</strong>
      </li>
    );
  }
}

export default Book;