import { Component } from 'react';
import { graphql } from 'react-apollo';

import { getReadingLogQuery } from '../../queries/queries';

class GetMyPoints extends Component {
  render() {
    if (!this.props.userName) {
      return '';
    } else {
      let data = this.props.getReadingLogQuery;

      if (data.loading) {
        return 'loading...';
      } else {
        let books = [];

        if (data.user && data.user.books.length > 0) {
          books = [...data.user.books];
          let total = 0;
          books.forEach(book => {
            total += (parseInt(book.pagesRead, 10) * parseInt(book.multiplier, 10));
          })
          return total;

        } else {
          return 0;
        }

      }
    }
  }
}


export default graphql(getReadingLogQuery, {
  name: "getReadingLogQuery",
  options: (props) => {
    return {
      variables: {
        userName: props.userName
      }
    }
  }
})(GetMyPoints);