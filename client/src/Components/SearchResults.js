import React, { Component, button } from "react";
import { Button, Label } from 'react-bootstrap';
import BookList from './BookList';
import $ from 'jquery';


class SearchResults extends Component {
  constructor() {
    super();
    this.state = ({
      books: [],
      totalCount: 0,
      startIndex: 0,
      maxIndex: 20,
      searchText: '',
      authorText: '',
      userName: JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.email
    });
  }


  getBooks() {
    this.setState((prevState) => {
      let url = null;
      if (prevState.searchText.length > 0 && prevState.authorText.length === 0) {
        url = "https://www.googleapis.com/books/v1/volumes?q=+intitle:" + prevState.searchText + "&printType=books&projection=full&orderBy=relevance&startIndex=" +
          prevState.startIndex + "&maxResults=" + prevState.maxIndex + "&maxAllowedMaturityRating=not-mature&projection=full&langRestrict=en&orderBy=relevance";
      } else if (prevState.searchText.length === 0 && prevState.authorText.length > 0) {
        url = "https://www.googleapis.com/books/v1/volumes?q=+inauthor:" + prevState.authorText + " & printType=books & projection=full & orderBy=relevance & startIndex=" +
          prevState.startIndex + "&maxResults=" + prevState.maxIndex + "&maxAllowedMaturityRating=not-mature&projection=full&langRestrict=en&orderBy=relevance";
      } else if (prevState.searchText.length > 0 && prevState.authorText.length > 0) {
        url = "https://www.googleapis.com/books/v1/volumes?q=+intitle:" + prevState.searchText + "+inauthor:" + prevState.authorText + " & printType=books & projection=full & orderBy=relevance & startIndex=" +
          prevState.startIndex + "&maxResults=" + prevState.maxIndex + "&maxAllowedMaturityRating=not-mature&projection=full&langRestrict=en&orderBy=relevance";
      }
      $.ajax({
        url: url,
        dataType: "json",
        cache: false,
        success: function (data) {
          this.setState({
            books: data,
            totalCount: data.totalItems
          });
        }.bind(this),
        error: function (xhr, status, err) {
          console.log(err);
        }
      });
    });

  }

  displayMatchingBooks() {
    if (this.state.books.length === 0) {
      return (
        <div />
      )
    } else {
      return (
        <div className="matching-book-list">
          <BookList userName={this.state.userName} books={this.state.books} />
        </div>
      )
    }

  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    this.getBooks(evt.target[0].value, evt.target[1].value);
  }

  handleOnClickPrevious = (evt) => {
    evt.preventDefault();
    this.setState((prevState) => {
      let prevStartIndex = parseInt(prevState.startIndex, 10);
      let newStartIndex = prevStartIndex - parseInt(prevState.maxIndex, 10);
      if (newStartIndex >= 0) {
        return {
          startIndex: newStartIndex
        }
      }
    });

    this.getBooks();

  }

  handleOnClickNext = (evt) => {
    evt.preventDefault();
    this.setState((prevState) => {
      let prevStartIndex = prevState.startIndex;
      let totalCount = parseInt(prevState.totalCount, 10);
      let newStartIndex = prevStartIndex + parseInt(prevState.maxIndex, 10);
      if (newStartIndex < totalCount) {
        return {
          startIndex: newStartIndex
        }
      }
    });


    this.getBooks();


  }

  render() {
    return (
      <div className="search-content">
        <form onSubmit={this.handleSubmit.bind(this)} className="search-form">
          <label className="search-label">
            Search for books to read:
          </label>
          <input type="text" className="search-text" onChange={(e) => this.setState({ searchText: e.target.value })} />
          <input type="text" className="author-text" onChange={(e) => this.setState({ authorText: e.target.value })} /> <button type="submit">Search</button>

          {this.displayMatchingBooks()}
          <Button onClick={this.handleOnClickPrevious.bind(this)} type="submit" bsStyle="link" hidden={parseInt(this.state.startIndex, 10) === 0}>Previous</Button>
          <Button onClick={this.handleOnClickNext.bind(this)} type="submit" bsStyle="link" hidden={parseInt(this.state.startIndex, 10) > parseInt(this.state.totalCount, 10)} > Next</Button>
          <Label>Guestimate of total # of matching books found: {this.state.totalCount}</Label>
        </form>
      </div >
    );
  }
}

export default SearchResults;