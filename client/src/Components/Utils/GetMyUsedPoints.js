import { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { getUsedTimeFromBooks, getUsedTimeFromContributions } from '../../queries/queries';

class GetMyUsedPoints extends Component {
  render() {
    if (this.props.getUsedTimeFromBooks.loading || this.props.getUsedTimeFromContributions.loading) {
      return (
        "Loading data..."
      )
    } else {

      let books = [];
      let tasks = [];
      if (this.props.getUsedTimeFromBooks) {
        books = [...this.props.getUsedTimeFromBooks.getUsedTimeFromBooks];
      }

      if (this.props.getUsedTimeFromContributions) {
        tasks = [...this.props.getUsedTimeFromContributions.getUsedTimeFromContributions];
      }

      let totalBookPointsUsed = 0;
      let totalTaskPointsUsed = 0;

      books.forEach(book => {
        totalBookPointsUsed += parseInt(book.multiplier, 10) * parseInt(book.pageCount, 10);
      })

      tasks.forEach(task => {
        totalTaskPointsUsed += parseInt(task.multiplier, 10) * parseInt(task.points, 10);
      })


      return totalBookPointsUsed + totalTaskPointsUsed;
    }

  }
};



export default compose(
  graphql(getUsedTimeFromContributions, {
    name: "getUsedTimeFromContributions",
    options: (props) => {
      return {
        variables: {
          userName: props.userName
        }
      }
    }
  }),
  graphql(getUsedTimeFromBooks, {
    name: "getUsedTimeFromBooks",
    options: (props) => {
      return {
        variables: {
          userName: props.userName
        }
      }
    }
  })
)(GetMyUsedPoints);