import { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { getUsedTimeFromBooks, getUsedTimeFromContributions } from '../../queries/queries';

class GetMyUsedMinutes extends Component {
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

      let totalBooktimeUsed = 0;
      let totalTaskTimeUsed = 0;

      books.forEach(book => {
        totalBooktimeUsed += parseInt(book.redeemedPoints, 10);
      })

      tasks.forEach(task => {
        totalTaskTimeUsed += parseInt(task.redeemedPoints, 10);
      })


      return totalBooktimeUsed + totalTaskTimeUsed;
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
)(GetMyUsedMinutes);