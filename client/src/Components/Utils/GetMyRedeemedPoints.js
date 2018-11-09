import { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { getRedeemedBooksQuery, getRedeemedContributionList } from '../../queries/queries';

class GetMyRedeemedPoints extends Component {
  render() {
    if (this.props.getRedeemedBooksQuery.loading || this.props.getRedeemedContributionList.loading) {
      return (
        "Loading data..."
      )
    } else {

      let books = [...this.props.getRedeemedBooksQuery.getRedeemedBooksQuery];
      let tasks = [...this.props.getRedeemedContributionList.getRedeemedContributionList];

      let totalBookPointsRedeemed = 0;
      let totalTaskPointsRedeemed = 0;

      books.forEach(book => {
        totalBookPointsRedeemed += parseInt(book.multiplier, 10) * parseInt(book.pageCount, 10);
      })

      tasks.forEach(task => {
        totalTaskPointsRedeemed += parseInt(task.multiplier, 10) * parseInt(task.points, 10);
      })


      return totalBookPointsRedeemed + totalTaskPointsRedeemed;
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
)(GetMyRedeemedPoints);