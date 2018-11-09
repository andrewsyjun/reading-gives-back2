import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import { Link } from 'react-router-dom';

import { graphql, compose } from 'react-apollo';
import {
  getRedeemedBooksQuery, undoRedeemBookRead, getReadingLogQuery, getRedeemedContributionList, undoRedeemContribution, getContributionList,
  useRedeemedBookTime, useRedeemedContributionTime, getUsedTimeFromBooks, getUsedTimeFromContributions
} from '../queries/queries';

import GetMyRedeemedMinutes from './Utils/GetMyRedeemedMinutes';

class Redeemed extends Component {
  displayBooks(data) {
    let books = [...data.getRedeemedBooksQuery];

    if (books && books.length > 0) {
      return (
        <table className="table-content-book-redeem">
          <thead>
            {this.displayHeader()}
          </thead>
          <tbody>
            {this.displayBody(books)}
          </tbody>
        </table>
      )
    } else {
      return (
        <h3 className="message-encourage">No book has been in your redeemed history. To get started you can click Reading Log from the top and start adding books to your log...</h3>
      )
    }

  }

  displayHeader() {
    return (
      <tr className="table-row-header">
        <th className="table-cell-title-header" width="30%">Book Title</th>
        <th className="table-cell-header" width="5%">Pages</th>
        <th className="table-cell-header" width="6%">Redeemed</th>
        <th className="table-cell-header" width="8%">On</th>
        <th className="table-cell-header" width="40%">Review</th>
        <th className="table-cell-header" width="10%"></th>
      </tr >
    )
  }

  displayBody(books) {
    return (
      books.map((book, index) => {
        return (
          <tr className="table-row-content" key={book.id + "_TR"}>
            <td className="table-cell-content-first" key={book.id + "_" + book.title + "_title"} width="25%">{book.title}</td>
            <td className="table-cell-content-pages" key={book.id + "_" + book.pageCount + "_pageCount"} width="5%">{book.pageCount}</td>
            <td className="table-cell-content-pages" key={book.id + "_" + book.multiplier + "_redeemed"} width="6%">{book.redeemedPoints} token(s)</td>
            <td className="table-cell-content-redeemedDt" key={book.id + "_redeemedDt"} width="8%">{new Date(book.redeemedDt).toLocaleDateString()}</td>
            <td className="table-cell-content-review" key={book.id + "_review"} width="40%">{book.review}</td>
            <td className="table-cell-content-button" key={book.id + "_buttonTD"} width="10%">
              <Button id={book.id} onClick={(evt) => this.handleReturnClick(evt, book.id)} type="submit" bsStyle="link" className="button-font">Return</Button>
              <Button id={book.id} onClick={(evt) => this.handleBookDoneClick(evt, book.id)} type="submit" bsStyle="link" className="button-font">Use</Button></td>
          </tr>
        )
      })
    )
  }

  showCompletedTasks(data) {
    let tasks = [...data.getRedeemedContributionList];


    if (tasks && tasks.length > 0) {
      return (
        <table className="table-content-task-redeem">
          <thead>
            {this.displayTaskHeader()}
          </thead>
          <tbody>
            {this.displayTaskBody(tasks)}
          </tbody>
        </table>
      )

    } else {
      return (
        <h3 className="message-encourage">We would love to see you contribute in any way you can...</h3>
      )
    }

  }

  displayTaskHeader() {
    return (
      <tr className="table-row-header">
        <th className="table-cell-title-header" width="30%">Task</th>
        <th className="table-cell-header" width="6%">Redeemed</th>
        <th className="table-cell-header" width="8%">On</th>
        <th className="table-cell-header" width="5%"></th>
      </tr >
    )
  }

  displayTaskBody(tasks) {
    return (
      tasks.map((task, index) => {
        return (
          <tr className="table-row-content" key={task.id + "_TR"}>
            <td className="table-cell-content-first" key={task.id + "_" + task.title + "_name"} width="30%">{task.title}</td>
            <td className="table-cell-content-pages" key={task.id + "_" + task.redeemedPoints + "_redeemed"} width="6%">{task.redeemedPoints} token(s)</td>
            <td className="table-cell-content-redeemedDt" key={task.id + "_redeemedDt"} width="8%">{new Date(task.redeemedDt).toLocaleDateString()}</td>
            <td className="table-cell-content-button" key={task.id + "_buttonTD"} width="5%">
              <Button id={task.id} onClick={(evt) => this.handleTaskReturnClick(evt, task.id)} type="submit" bsStyle="link" className="button-font">Return</Button>
              <Button id={task.id} onClick={(evt) => this.handleTaskDoneClick(evt, task.id)} type="submit" bsStyle="link" className="button-font">Use</Button>
            </td>
          </tr >
        )
      })
    )
  }


  render() {
    let books = this.props.getRedeemedBooksQuery;
    let tasks = this.props.getRedeemedContributionList;

    if (books.loading || tasks.loading) {
      return 'loading...';
    } else {
      return (

        <div className="content-pane-redeem">
          <h3 className="redeem-title">You have redeemed <GetMyRedeemedMinutes userName={this.props.userName} /> token(s) to date.
          <div className="history-link" >
              <Link to="/history">
                See my history...
              </Link>
            </div></h3> <br /> <br />
          {this.displayBooks(books)}
          <br /> <br />
          {this.showCompletedTasks(tasks)}
        </div >
      )
    }
  }

  handleReturnClick = (evt, bookId) => {
    evt.preventDefault();

    this.props.undoRedeemBookRead({
      variables: {
        bookId: bookId,
        redeemed: false
      },
      refetchQueries: [{ query: getRedeemedBooksQuery, variables: { userName: this.props.userName } },
      { query: getReadingLogQuery, variables: { userName: this.props.userName } }]
    });
  }

  handleBookDoneClick = (evt, bookId) => {
    evt.preventDefault();

    this.props.useRedeemedBookTime({
      variables: {
        bookId: bookId
      },
      refetchQueries: [{ query: getRedeemedBooksQuery, variables: { userName: this.props.userName } },
      { query: getReadingLogQuery, variables: { userName: this.props.userName } },
      { query: getUsedTimeFromBooks, variables: { userName: this.props.userName } }]
    });
  }

  handleTaskReturnClick = (evt, contributionId) => {
    evt.preventDefault();

    this.props.undoRedeemContribution({
      variables: {
        contributionId: contributionId
      },
      refetchQueries: [{ query: getRedeemedContributionList, variables: { userName: this.props.userName } },
      { query: getContributionList, variables: { userName: this.props.userName } }]
    });
  }
  //getUsedTimeFromContributions
  handleTaskDoneClick = (evt, contributionId) => {
    evt.preventDefault();

    this.props.useRedeemedContributionTime({
      variables: {
        contributionId: contributionId
      },
      refetchQueries: [{ query: getRedeemedContributionList, variables: { userName: this.props.userName } },
      { query: getContributionList, variables: { userName: this.props.userName } },
      { query: getUsedTimeFromContributions, variables: { userName: this.props.userName } }]
    });
  }
}


export default compose(
  graphql(getReadingLogQuery, {
    name: "getReadingLogQuery",
    options: (props) => {
      return {
        variables: { userName: props.userName }

      }
    }
  }),
  graphql(undoRedeemBookRead, {
    name: "undoRedeemBookRead"
  }),
  graphql(undoRedeemContribution, { name: "undoRedeemContribution" }),
  graphql(useRedeemedBookTime, { name: "useRedeemedBookTime" }),
  graphql(useRedeemedContributionTime, { name: "useRedeemedContributionTime" }),
  graphql(getRedeemedBooksQuery, {
    name: "getRedeemedBooksQuery",
    options: (props) => {
      return {
        variables: { userName: props.userName }

      }
    }
  }),
  graphql(getContributionList, {
    name: "getContributionList",
    options: (props) => {
      return {
        variables: { userName: props.userName }
      }
    }
  }),
  graphql(getRedeemedContributionList, {
    name: "getRedeemedContributionList",
    options: (props) => {
      return {
        variables: { userName: props.userName }

      }
    }
  })
)(Redeemed);