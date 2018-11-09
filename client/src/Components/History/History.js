import React, { Component } from 'react';

import { graphql, compose } from 'react-apollo';
import GetMyUseddMinutes from './../Utils/GetMyUsedMinutes';

import { Link } from 'react-router-dom';

import { getUsedTimeFromBooks, getUsedTimeFromContributions } from '../../queries/queries';

class History extends Component {


  displayBooks(data) {
    let books = [];
    if (this.props.getUsedTimeFromBooks) {
      books = [...this.props.getUsedTimeFromBooks.getUsedTimeFromBooks];
    }


    if (books && books.length > 0) {
      return (
        books.map((book, index) => {
          return (
            <div key={book.id} className="history-content">{index + 1}. {book.title}, {book.pageCount}, {book.redeemedPoints} token(s),
          {new Date(book.usedDt).toLocaleDateString()}</div >
          )
        })
      )
    } else {
      return (
        <h3 className="message-encourage">No times from reading used so far..</h3>
      )
    }
  }


  showCompletedTasks(data) {
    let tasks = [];

    if (this.props.getUsedTimeFromContributions) {
      tasks = [...this.props.getUsedTimeFromContributions.getUsedTimeFromContributions];
    }

    if (tasks && tasks.length > 0) {
      return (
        tasks.map((task, index) => {
          return (
            <div key={task.id} className="history-content">{index + 1}. {task.title}, {task.redeemedPoints} token(s),
            {new Date(task.usedDt).toLocaleDateString()}</div>
          )
        })
      )
    } else {
      return (
        <h3 className="message-encourage">No contribution times used..</h3>
      )
    }
  }

  render() {
    let books = this.props.getUsedTimeFromBooks;
    let tasks = this.props.getUsedTimeFromContributions;

    if (books.loading || tasks.loading) {
      return 'loading...';
    } else {
      return (
        <React.Fragment>
          <div className="content-pane-history">
            <div>
              <Link className="history-link" to="/redeempoints">
                Back
              </Link>
            </div>
            <h3 className="redeem-title">You have used total of <GetMyUseddMinutes userName={this.props.userName} /> toekens to date.</h3>

            <p className="history-title">Books</p>
            {this.displayBooks(books)}
            <br /> <br />
            <p className="history-title">Tasks</p>
            {this.showCompletedTasks(tasks)}
          </div >
        </React.Fragment >
      )

    }
  }
};



export default compose(
  graphql(getUsedTimeFromBooks, {
    name: "getUsedTimeFromBooks",
    options: (props) => {
      return {
        variables: {
          userName: props.userName
        }
      }
    }
  }),
  graphql(getUsedTimeFromContributions, {
    name: "getUsedTimeFromContributions",
    options: (props) => {
      return {
        variables: {
          userName: props.userName
        }
      }
    }
  })
)(History);