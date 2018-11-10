import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import { graphql, compose, Query } from 'react-apollo';
import {
  getReviewReadyItems, updateMultiplier, getUser, approveBookRead, getReadingLogQuery, getUsedTimeFromContributionsById
} from '../../queries/queries';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import cellEditFactory from 'react-bootstrap-table2-editor';

import ReaderList from './ReaderList';

import approve from '../../assets/icons/approve.png';
import GetMyRedeemedMinutes from '../Utils/GetMyRedeemedMinutes';
import GetMyUsedMinutes from '../Utils/GetMyUsedMinutes';

class ReviewPage extends Component {
  constructor() {
    super();
    this.state = {
      readerId: "",
      readerName: "",
      readerUserName: "",
      showAll: false
    };

  }

  titleFormatter(cell, row) {
    return (
      <a href={row.href} bookid={row.id} className="review-book-title"
        target="popup">
        {cell}
      </a>
    )
  }

  handleOnSubmit = (evt) => {
    evt.preventDefault();
  }

  displayBooks(data) {
    let books = [];

    if (books) {
      books = data.getReviewReadyItems;
    }

    const headerSortingStyle = { backgroundColor: '#c8e6c9' };

    const defaultSorted = [{
      dataField: 'book.title',
      order: 'asc'
    }];

    const customTotal = (from, to, size) => (
      <span className="react-bootstrap-table-pagination-total">
        Showing {from} to {to} of {size} Results</span>
    );

    const options = {
      paginationSize: 4,
      pageStartIndex: 0,
      alwaysShowAllBtns: true, // Always show next and previous button
      withFirstAndLast: false, // Hide the going to First and Last page button
      hideSizePerPage: true, // Hide the sizePerPage dropdown always
      hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
      firstPageText: 'First',
      prePageText: 'Back',
      nextPageText: 'Next',
      lastPageText: 'Last',
      nextPageTitle: 'First page',
      prePageTitle: 'Pre page',
      firstPageTitle: 'Next page',
      lastPageTitle: 'Last page',
      showTotal: true,
      paginationPosition: 'top',
      paginationTotalRenderer: customTotal,
      sizePerPageList: [{
        text: '10', value: 10
      }, {
        text: '20', value: 20
      }] // A numeric array is also available. the purpose of above example is custom the text
    };

    const columns = [
      {
        dataField: 'imageLink',
        text: '',
        sort: false,
        headerSortingStyle,
        formatter: this.imageLinkFormatter,
        headerStyle: (colum, colIndex) => {
          return { width: '5%', textAlign: 'left' };
        },
        editable: false
      }, {
        dataField: 'title',
        text: 'Title',
        sort: true,
        headerSortingStyle,
        formatter: this.titleFormatter,
        headerStyle: (colum, colIndex) => {
          return { width: '20%', textAlign: 'left', fontSize: '18px' };
        },
        editable: false
      }, {
        dataField: 'author',
        text: 'Author',
        sort: true,
        headerSortingStyle,
        headerStyle: (colum, colIndex) => {
          return { width: '10%', textAlign: 'left', fontSize: '18px' };
        },
        editable: false
      }, {
        dataField: 'pagesRead',
        text: 'Read',
        headerSortingStyle,
        headerStyle: (colum, colIndex) => {
          return { width: '5%', textAlign: 'left', fontSize: '18px' };
        },
        editable: false
      }, {
        dataField: 'pageCount',
        text: 'Pages',
        headerSortingStyle,
        headerStyle: (colum, colIndex) => {
          return { width: '5%', textAlign: 'left', fontSize: '18px' };
        },
        editable: false
      }, {
        dataField: 'createdDt',
        text: 'Added',
        sort: false,
        headerSortingStyle,
        formatter: this.dateFormatter.bind(this),
        headerStyle: (colum, colIndex) => {
          return { width: '8%', textAlign: 'left', fontSize: '18px' };
        },
        editable: false
      }, {
        dataField: 'review',
        text: 'Review',
        sort: false,
        headerSortingStyle,
        headerStyle: (colum, colIndex) => {
          return { width: '40%', textAlign: 'left', fontSize: '18px' };
        },
        editable: false
      }, {
        dataField: 'multiplier',
        text: 'Extra',
        sort: false,
        headerSortingStyle,
        headerStyle: (colum, colIndex) => {
          return { width: '5%', textAlign: 'left', fontSize: '18px' };
        },
        editable: true,
        validator: (newValue, row, column) => {
          if (isNaN(newValue)) {
            return {
              valid: false,
              message: 'Multiplier should be numeric'
            };
          }
          if (parseInt(newValue, 10) < 0 || parseInt(newValue, 10) > 5) {
            return {
              valid: false,
              message: "Multiplier should be between 0 and 5"
            }
          }
        }
      }, {
        dataField: '',
        text: '',
        formatter: this.buttonFormatter.bind(this),
        headerStyle: (colum, colIndex) => {
          return { width: '9%', textAlign: 'center' };
        },
        editable: false
      }];

    return (
      <BootstrapTable keyField='id' data={books} columns={columns} defaultSorted={defaultSorted}
        pagination={paginationFactory(options)} filter={filterFactory()}
        rowStyle={{ fontSize: '12px' }}
        cellEdit={cellEditFactory({
          mode: 'click',
          blurToSave: true,
          autoSelectText: true,
          afterSaveCell: (oldValue, newValue, row, column) => { this.updateMultiplier(oldValue, newValue, row, column); }
        })}
      />
    );

  }

  displayTasks(data) {
    let tasks = [...data.getUsedTimeFromContributionsById];

    if (tasks && tasks.length > 0) {
      return (
        tasks.map((task, index) => {
          return (
            <div key={task.id} className="history-content">{index + 1}. {task.title}, {task.redeemedPoints} token(s), redeemed on {new Date(task.redeemedDt).toLocaleDateString()} {(task.usedDt) ? " and used on " + new Date(task.usedDt).toLocaleDateString() : ""}</div>
          )
        })
      )
    } else {
      return (
        <React.Fragment />
      )
    }
  }

  showSummary() {
    if (this.state.readerId && this.state.readerId !== "") {
      return (
        <div><h4>{this.state.readerName} has redeemed <GetMyRedeemedMinutes userName={this.state.readerUserName} /> token(s) and has used <GetMyUsedMinutes userName={this.state.readerUserName} /> token(s) to date</h4></div>
      )
    } else {
      return (
        <div />
      )
    }
  }

  render() {

    if (this.props.getUser.loading) {
      return <div>Loading...</div>
    }


    if (!this.props.getUser.user.roleName.split(",").includes("Parent")) {
      return <div>You don't have access to this page</div>
    }

    const taskTitle = (this.state.readerId && this.state.readerId !== "") ?
      (
        <h3>Here are the contributions from: {this.state.readerName}</h3>
      ) : (
        <h3>You can select a child to see all his/her contributions</h3>
      );

    return (
      <div className="review-content-pane">
        <h2>You can select your child's completed reading list to review and approve: <ReaderList userName={this.props.userName} familyGroupId={this.props.getUser.user.familyGroupId} class onChangeHandle={(evt) => this.onChangeHandle(evt)} />
        </h2>
        <div>
          <input type="checkbox" id="show-approved" name="show-approved-cb"
            value="show-approved" className="show-approved" onChange={(evt) => this.setState({ showAll: evt.target.checked })} />
          <label htmlFor="show-approved" className="show-approved">Show Approved</label>
        </div>
        <br />
        <form onSubmit={this.handleOnSubmit.bind(this)} >

          {this.showSummary()}
          <Query query={getReviewReadyItems}
            variables={{
              readerId: (this.state.readerId) ? this.state.readerId : "",
              showAll: this.state.showAll
            }
            }>
            {({ loading, error, data }) => {
              if (loading) return <div>Fetching</div>
              if (error) return <div>Error</div>


              return (
                <React.Fragment>
                  {this.displayBooks(data)}
                </React.Fragment>
              )
            }}
          </Query>
          <Query query={getUsedTimeFromContributionsById}
            variables={{ readerId: this.state.readerId }} >
            {({ loading, error, data }) => {
              if (loading) return <div>Fetching</div>
              if (error) return <div>Error</div>

              return (
                <div>
                  <br /><br />
                  {taskTitle}
                  {this.displayTasks(data)}
                  <br />
                  <br />
                  <label>:)</label>
                </div>
              )
            }
            }
          </Query >
        </form>

      </div >
    )

  }

  onChangeHandle = (evt) => {
    this.setState(
      {
        readerId: evt.target.value,
        readerName: evt.target.options[evt.target.selectedIndex].text,
        readerUserName: evt.target.options[evt.target.selectedIndex].id
      }
    );
  }

  isParent() {
    return (this.props.getUser.user.roleName.split(",").includes("Parent"));
  }

  dateFormatter(cell, row, enumObject, rowIndex) {
    return new Date(cell).toDateString();
  }

  updateMultiplier(oldValue, newValue, row, column) {
    if (parseInt(oldValue, 10) === parseInt(newValue, 10)) return newValue;
    let bookId = row.id;
    //let userId = row.userId;
    this.props.updateMultiplier({
      variables: {
        bookId: bookId,
        multiplier: parseInt(newValue, 10)
      },
      refetchQueries: [{ query: getReviewReadyItems, variables: { reader: this.state.readerId, showAll: this.state.showAll } },
      { query: getReadingLogQuery, variables: { userName: this.props.userName } }]
    });

    return newValue;

  }

  checkUserRole(cell, row, enumObject, rowIndex) {
    return (this.props.getUser.user.roleName.split(",").includes("Parent"));
  }


  imageLinkFormatter(cell, row, enumObject, rowIndex) {
    return (
      <div className="book-image-zoom"><Image src={cell} className="book-image" /></div>
    )
  }

  buttonFormatter(cell, row, enumObject, rowIndex) {
    if (row.pagesRead < row.pageCount) {
      return (
        <div key={row.id + " _in_progress"}><p>In progress...</p></div>
      )
    }

    if (row.used) {
      return (
        <div key={row.id + " _used_div"}><p>This was used on {new Date(row.usedDt).toLocaleDateString()}</p></div>
      )
    }

    if (row.redeemed) {
      return (
        <div key={row.id + " _redeemed_div"}><p>This was redeemed on {new Date(row.redeemedDt).toLocaleDateString()}</p></div>
      )
    }

    if (row.approved) {
      return (
        <div key={row.id + " _approved_div"}><p>This was approved on {new Date(row.approvedDt).toLocaleDateString()}</p></div>
      )
    }

    return (
      <div className="action-buttons" key={row.id + " _approve_div_input"}>
        <input id={row.id + " _approve"} type="image" src={approve} onClick={() => this.approve(row)} title="Approve Book" alt="Approve Book" className="image-action-button" />
      </div>
    )

  }


  approve(row) {
    //let pages = parseInt(row.pagesRead, 10);
    let bookId = row.id;

    this.props.approveBookRead({
      variables: {
        bookId: bookId
      },
      refetchQueries: [{ query: getReviewReadyItems, variables: { readerId: this.state.readerId, showAll: this.state.showAll } },
      { query: getReadingLogQuery, variables: { userName: this.props.userName } }]
    });
  }
}


export default compose(
  graphql(updateMultiplier, { name: "updateMultiplier" }),
  graphql(approveBookRead, { name: "approveBookRead" }),
  graphql(getUser, {
    name: "getUser",
    options: (props) => {
      return {
        variables: { userName: props.userName }
      }
    }
  }),
  graphql(getReadingLogQuery, {
    name: "getReadingLogQuery",
    options: (props) => {
      return {
        variables: { userName: props.userName }
      }
    }
  })
)(ReviewPage);