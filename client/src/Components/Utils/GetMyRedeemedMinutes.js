import { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { getRedeemedBooksQuery, getRedeemedContributionList } from '../../queries/queries';

class GetMyRedeemedMinutes extends Component {
  render() {
    if (this.props.getRedeemedBooksQuery.loading || this.props.getRedeemedContributionList.loading) {
      return (
        "Loading data..."
      )
    } else {

      let books = [...this.props.getRedeemedBooksQuery.getRedeemedBooksQuery];
      let tasks = [...this.props.getRedeemedContributionList.getRedeemedContributionList];

      let totalBooksRedeemed = 0;
      let totalTaskRedeemed = 0;

      books.forEach(book => {
        totalBooksRedeemed += parseInt(book.redeemedPoints, 10);
      })

      tasks.forEach(task => {
        totalTaskRedeemed += parseInt(task.redeemedPoints, 10);
      })


      return totalBooksRedeemed + totalTaskRedeemed;
    }

  }
};



export default compose(
  graphql(getRedeemedBooksQuery, {
    name: "getRedeemedBooksQuery",
    options: (props) => {
      return {
        variables: {
          userName: props.userName
        }
      }
    }
  }),
  graphql(getRedeemedContributionList, {
    name: "getRedeemedContributionList",
    options: (props) => {
      return {
        variables: {
          userName: props.userName
        }
      }
    }
  })
)(GetMyRedeemedMinutes);