import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getTaskQuery } from '../../queries/queries';

class TaskDetails extends Component {
  displayTaskDetails() {
    let task = this.props.data.getTaskQuery;
    if (task) {
      return (
        <div>
          <h2>{task.taskName}</h2>
          <p>This task is worth {task.points} points</p>
        </div>
      );
    } else {
      return (<div>No task selected...</div>);
    }
  }
  render() {
    return (
      <div id="task-details">
        {this.displayTaskDetails()}
      </div>
    );
  }
}

export default graphql(getTaskQuery, {
  options: (props) => {
    return {
      variables: {
        taskId: props.taskId
      }
    }
  }
})(TaskDetails);
