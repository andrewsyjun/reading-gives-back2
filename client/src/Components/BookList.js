import React, { Component } from 'react';
import { Button, Image } from 'react-bootstrap';
//import Book from './Book';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { graphql, compose } from 'react-apollo';

import { getReadingLogQuery, addReadingLogMutation, getUser } from '../queries/queries';

class BookList extends Component {

    constructor(props) {
        super(props);
        this.setState = {
            userName: JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.email
        }
    }

    displayBooks() {
        let books = this.props.books.items;
        if (books) {
            return (
                <React.Fragment>
                    <thead>
                        {this.displayHeader()}
                    </thead>
                    <tbody>
                        {this.displayBody(books)}
                    </tbody>
                </React.Fragment>
            )
        } else {
            return (
                <div>Empty</div>
            )
        }
    }

    render() {
        return (
            <div>
                <h3>Here is the list of books matching your search</h3>
                <div className="book-list-form">
                    <table className="prop-table table table-striped table-bordered">
                        {this.displayBooks()}
                    </table>
                </div>
            </div >
        );
    }


    displayHeader() {
        return (
            <tr>
                <th width="15%"></th>
                <th width="25%">Title</th>
                <th width="10%">Author</th>
                <th width="10%">Pages</th>
                <th width="10%">Publisher</th>
                <th width="10%">Avg. Rating</th>
                <th width="10%"># of Ratings</th>
                <th width="10%"></th>
            </tr >
        )
    }

    displayBody(books) {

        if (books) {
            return (
                books.map((book, index) => {
                    if (book.volumeInfo.pageCount && book.volumeInfo.authors && book.volumeInfo.publisher) {
                        return (
                            <React.Fragment key={book.id + "_fragment"}>
                                <tr className="prop-table-row" key={book.id + "_TR"}>
                                    <td id={book.id + "_thumbNail"} width="15%" key={book.id + "_thumbNail"} ><a href={book.volumeInfo.infoLink} target="popup"><Image src={this.checkForThumbnail(book.volumeInfo.imageLinks)} /></a></td>
                                    <td id={book.id + "_infoLink"} width="25%" key={book.id + "_infoLink"} ><a href={book.volumeInfo.infoLink} target="popup">{book.volumeInfo.title}</a></td>
                                    <td id={book.id + "_authors"} width="10%" key={book.id + "_authors"} >{book.volumeInfo.authors}</td>
                                    <td id={book.id + "_pageCount"} width="10%" key={book.id + "_pageCount"} >{book.volumeInfo.pageCount}</td>
                                    <td id={book.id + "_publisher"} width="10%" key={book.id + "_publisher"}>{book.volumeInfo.publisher}</td>
                                    <td id={book.id + "_rating"} width="10%" key={book.id + "_rating"}>{book.volumeInfo.averageRating}</td>
                                    <td id={book.id + "_ratingsCount"} width="10%" key={book.id + "_ratingsCount"}>{book.volumeInfo.ratingsCount}</td>
                                    <td id={book.id + "_add_book_td"} width="10%" key={book.id + "_add_book_td"}><Button id={book.id + "_add_book_button"} onClick={this.handleOnClick.bind(this)} type="submit" bsStyle="link" className="button-font">Add to my log</Button></td>
                                </tr>
                                <tr className="prop-table-row" key={book.id + "_TR2"}>
                                    <td colSpan="8" key={book.id + "_book_description"}>{book.volumeInfo.description}</td>
                                </tr>
                            </React.Fragment >
                        )
                    } else {
                        return (
                            <React.Fragment key={book.id + "_fragment"} />

                        )
                    }
                })
            )
        } else {
            return (
                <h5>No books found matching your search criterion.!</h5>
            )
        }
    }

    checkForThumbnail(imageLinks) {
        if (imageLinks) {
            return imageLinks.smallThumbnail;
        } else {
            return "";
        }
    }

    handleOnClick = (evt) => {
        evt.preventDefault();
        let date = new Date().toLocaleDateString();
        let bookId = evt.target.attributes.id.nodeValue.split("_add_book_button")[0];
        let userId = this.props.getUser.user.id;
        let title = document.getElementById(bookId + "_infoLink").childNodes[0].childNodes[0].data;
        let authors = document.getElementById(bookId + "_authors").childNodes[0].data;
        let pageCount = document.getElementById(bookId + "_pageCount").childNodes[0].data;
        let publisher = document.getElementById(bookId + "_publisher").childNodes[0].data;
        let href = document.getElementById(bookId + "_thumbNail").childNodes[0].attributes.href.value;
        let thumbNail = document.getElementById(bookId + "_thumbNail").childNodes[0].childNodes[0].attributes.src.value;

        this.props.addReadingLogMutation({
            variables: {
                title: title,
                author: authors.toString(),
                pagesRead: 0,
                pageCount: parseInt(pageCount, 10),
                publisher: publisher,
                href: href,
                googleBookId: bookId,
                userId: userId,
                redeemed: false,
                review: "",
                multiplier: 1,
                redeemedPoints: 0,
                imageLink: thumbNail,
                createdDt: date,
                redeemedDt: ''
            },
            refetchQueries: [{ query: getReadingLogQuery, variables: { userName: this.props.userName } }]
        })
            .then(res => {
                if (!res.errors) {
                    this.handleOnCompleted(res, title);
                }
            });
    }

    handleOnCompleted(response, newTitle) {
        let data = response.data.addReadingLogMutation
        if (data) {
            let message = data.title + " is already in your log. It was added on " + new Date(data.createdDt).toDateString() + ". Check to see if you are adding the correct book.";
            alert(message);
        } else {
            alert(newTitle + " is now added to your reading log");
        }
    }

    handleError(message) {
        console.log("error: " + message);
    }

    handleOnSubmit = (evt) => {
        evt.preventDefault();
    }
}

export default compose(
    graphql(addReadingLogMutation, {
        name: "addReadingLogMutation"
    }),
    graphql(getUser, {
        name: "getUser",
        options: (props) => {
            return {
                variables: { userName: props.userName }
            }
        }
    })
)(BookList);