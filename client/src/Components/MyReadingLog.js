import React, { Component } from 'react';
import { Button, Image } from 'react-bootstrap';
import SearchResults from './SearchResults';
import { graphql, compose } from 'react-apollo';
import {
  getReadingLogQuery, updatePagesRead, removeBookFromMyReadingLog, updateMultiplier, getUser,
  getRedeemedBooksQuery, saveReview, redeemBookRead
} from '../queries/queries';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import cellEditFactory from 'react-bootstrap-table2-editor';


import Modal from 'react-modal';

import review from '../assets/icons/review.png';
import redeem from '../assets/icons/redeem.png';
import disredeem from '../assets/icons/disredeem.png';
import remove from '../assets/icons/remove.png';


const customStyles = {
  content: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    fontFamily: 'Trebuchet MS',
    fontVariant: 'small-caps',
    backgroundSize: 'contain',
    height: '60%',
    width: '50%',
    bottom: 'auto',
    transform: 'translate(60%, 10%, 10%, 10%)'
  }
};


Modal.setAppElement('body');

class MyReadingLog extends Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      bookId: null,
      bookReview: ""
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);

  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  titleFormatter(cell, row) {
    return (
      <a href={row.href} bookid={row.id}
        target="popup">
        {cell}
      </a>
    )
  }

  handleOnSubmit = (evt) => {
    evt.preventDefault();
  }

  render() {
    //const { currentUserEmail, currentUserName } = this.state;
    let data = this.props.getReadingLogQuery;
    if (data.loading) {
      return (
        <div>Loading books...</div>
      )
    } else {
      let books = [];

      if (data.user && data.user.books.length > 0) {
        books = [...data.user.books];
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
          editable: true,
          validator: (newValue, row, column) => {
            if (isNaN(newValue)) {
              return {
                valid: false,
                message: 'Page read should be numeric'
              };
            }
            if (parseInt(newValue, 10) > parseInt(row.pageCount, 10) || parseInt(newValue, 10) < 0) {
              return {
                valid: false,
                message: "Page read is not valid"
              }
            }
          },
        }, {
          dataField: 'pageCount',
          text: 'Pages',
          headerSortingStyle,
          formatter: this.pagesReadFormatter.bind(this),
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
          hidden: ((this.props.getUser.user) && (this.props.getUser.user.roleName === "Child")),
          editable: this.checkUserRole.bind(this),
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
        <div className="content-pane">
          <h2>Here is your reading log</h2><br />
          <div>
            <form onSubmit={this.handleOnSubmit.bind(this)} >

              <BootstrapTable keyField='id' data={books} columns={columns} defaultSorted={defaultSorted}
                pagination={paginationFactory(options)} filter={filterFactory()}
                rowStyle={{ fontSize: '16px', fontFamily: 'Trebuchet MS', fontVariant: 'small-caps' }}
                cellEdit={cellEditFactory({
                  mode: 'click',
                  blurToSave: true,
                  autoSelectText: true,
                  afterSaveCell: (oldValue, newValue, row, column) => { this.updateColumn(oldValue, newValue, row, column); }
                })}
              />

              <div id="div_modal_dialog">
                <Modal
                  id="modal_dialog"
                  isOpen={this.state.showModal}
                  contentLabel="Write Review"
                  style={customStyles}
                >
                  <label className="label-popup">You can write your book review here:</label><br /><br />
                  <textarea key="review_textarea" rows="15" cols="100" id="review_textarea" value={this.state.bookReview} onChange={this.handleChange.bind(this)} ref={this.setWrapperRef} /><br /><br />
                  <Button className="review-popup-button" onClick={this.handelOnSaveReviewClick.bind(this)} >Save Review</Button>
                  <Button className="review-popup-button" onClick={this.handleOnCloseClick.bind(this)}>Cancel</Button>
                </Modal>
              </div>
            </form>

          </div>
          <br /><br />
          <div><SearchResults /></div>
        </div>
      )
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showModal !== this.state.showModal && this.state.showModal === true) {
      setTimeout(function () {
        this.wrapperRef.focus();
      }.bind(this), 0);
    }
  }

  componentDidMount() {
    let elem = document.getElementById("review_textarea");
    if (elem) {
      elem.focus();
    }
  }

  isParent() {
    return (this.props.getUser.user.roleName === "Child");
  }

  dateFormatter(cell, row, enumObject, rowIndex) {
    return new Date(cell).toDateString();
  }

  updateColumn(oldValue, newValue, row, column) {
    if (parseInt(oldValue, 10) === parseInt(newValue, 10)) return newValue;
    let bookId = row.id;
    //let userId = row.userId;
    if (column.dataField === "multiplier") {
      this.props.updateMultiplier({
        variables: {
          bookId: bookId,
          multiplier: parseInt(newValue, 10)
        },
        refetchQueries: [{ query: getReadingLogQuery, variables: { userName: this.props.userName } }]
      });
    } else {
      this.props.updatePagesRead({
        variables: {
          bookId: bookId,
          pagesRead: parseInt(newValue, 10),
          familyGroupId: this.props.getUser.user.familyGroupId
        },
        refetchQueries: [{ query: getReadingLogQuery, variables: { userName: this.props.userName } }]
      });
    }
    return newValue;

  }

  handleChange(event) {
    this.setState({ bookReview: event.target.value });
  }

  checkUserRole(cell, row, enumObject, rowIndex) {
    return (this.props.getUser.user) && (this.props.getUser.user.roleName.split(",").includes("Parent"));
  }

  contentFormatter(cell, row, enumObject, rowIndex) {
    return (
      <Button id={row.id} onClick={this.handleOpenModal.bind(this)} type="submit" bsStyle="link" >{row.review}</Button>
    )
  }

  pagesReadFormatter(cell, row, enumObject, rowIndex) {
    let pageCount = parseInt(row.pageCount, 10);
    let multiplier = parseInt(row.multiplier, 10);
    let totalPts = pageCount * multiplier;
    let earnedTime = Math.ceil(pageCount * multiplier / 100);
    let potentialEarnTime = Math.ceil(pageCount * 5 / 100);

    let message = '';
    if (multiplier === 5) {
      message = "You have earned the maxmimum allowed time. Great job!!";
    } else {
      message = "This is worth " + earnedTime + " token(s) but it could be worth up to " + potentialEarnTime + " token(s) if you are able to do a review on it."
    }

    return (
      <div>
        <label value={totalPts} title={message}>{cell}</label>
      </div>
    )
  }

  roundUp(val) {
    let roundedUp = '';
    let arr = val.toString().split("");
    arr.forEach(function (num, index) {
      if (index === 0) {
        roundedUp += (parseInt(num, 10) + 1);
      } else {
        roundedUp += "0";
      }
    });

    return roundedUp;

  }


  imageLinkFormatter(cell, row, enumObject, rowIndex) {
    return (
      <div className="book-image-zoom"><Image src={cell} className="book-image" /></div>
    )
  }

  buttonFormatter(cell, row, enumObject, rowIndex) {

    const toggleButton = row.approved ?
      (<input id={row.id + "_redeem"} type="image" src={redeem} onClick={() => this.redeem(row)} title="Redeem Points" alt="Redeem Points" className="image-action-button" />) :
      (<input id={row.id + "_redeem"} type="image" src={disredeem} title="Need Approval" alt="Redeem Points" className="image-action-button" disabled />)



    return (

      <div className="action-buttons" >
        <input id={row.id + " _review"} type="image" src={review} onClick={() => this.writeReview(row)} title="Review Book" alt="Review Book" className="image-action-button" />
        {toggleButton}
        <input id={row.id + "_remove"} type="image" src={remove} onClick={() => this.remove(row)} title="Remove from Log" alt="Remove from Log" className="image-action-button" />
      </div >
    )
  }

  writeReview(row) {

    console.log("in writeReview");
    this.setState({
      bookId: row.id,
      bookReview: row.review,
      showModal: true
    });

  }

  redeem(row) {
    //let pages = parseInt(row.pagesRead, 10);
    let bookId = row.id;
    let pageCount = parseInt(row.pageCount, 10);
    let multiplier = parseInt(row.multiplier, 10);
    let totalPts = pageCount * multiplier;
    let answer = false;


    if (parseInt(row.pagesRead, 10) < pageCount) {
      alert("It seems that this book has been read yet. Please update the pages read from your log before proceeding");
      return;
    } else {
      let earnedTime = Math.ceil(totalPts / 100);
      answer = window.confirm("Great job! You are redeeming " + totalPts + " points from your earned time. Would you like to redeem it now?");
      if (answer) {
        alert("Great work and have fun!");

        this.props.redeemBookRead({
          variables: {
            bookId: bookId,
            redeemed: true,
            redeemedPoints: parseInt(earnedTime, 10)
          },
          refetchQueries: [{ query: getReadingLogQuery, variables: { userName: this.props.userName } },
          { query: getRedeemedBooksQuery, variables: { userName: this.props.userName } }]
        });
      }
    }
  }

  handelOnSaveReviewClick = (evt) => {
    evt.preventDefault();
    let bookId = this.state.bookId;
    let reviewText = this.state.bookReview;
    this.props.saveReview({
      variables: {
        bookId: bookId,
        review: reviewText
      },
      refetchQueries: [{ query: getReadingLogQuery, variables: { userName: this.props.userName } }]
    });

    this.setState({ showModal: false });
  }

  handleOnCloseClick = (evt) => {
    evt.preventDefault();

    //let answer = window.confirm("Are you sure you wnat cancel your review?");
    //if (answer) {
    this.setState({ showModal: false });
    //}
  }


  remove(row) {
    let answer = window.confirm("Are you sure you wnat to remove this book from your reading log?");
    if (answer) {
      this.removeBook(row.id);
    }
  }


  removeBook(bookId) {
    //let userId = row.userId;
    this.props.removeBookFromMyReadingLog({
      variables: {
        bookId: bookId
      },
      refetchQueries: [{ query: getReadingLogQuery, variables: { userName: this.props.userName } }]
    });

  }

  handleOpenModal(evt) {
    evt.preventDefault();
    this.setState({ showModal: true });
  }

  handleCloseModal(evt) {
    evt.preventDefault();
    this.setState({ showModal: false });
  }

}


export default compose(
  graphql(updateMultiplier, { name: "updateMultiplier" }),
  graphql(updatePagesRead, { name: "updatePagesRead" }),
  graphql(getUser, {
    name: "getUser",
    options: (props) => {
      return {
        variables: { userName: props.userName }
      }
    }
  }),
  graphql(removeBookFromMyReadingLog, { name: "removeBookFromMyReadingLog" }),
  graphql(saveReview, { name: "saveReview" }),
  graphql(getReadingLogQuery, {
    name: "getReadingLogQuery",
    options: (props) => {
      return {
        variables: { userName: props.userName }
      }
    }
  }),
  graphql(redeemBookRead, { name: "redeemBookRead" }),
  graphql(getRedeemedBooksQuery, {
    name: "getRedeemedBooksQuery",
    options: (props) => {
      return {
        variables: { userName: props.userName }
      }
    }
  })
)(MyReadingLog);