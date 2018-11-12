import React, { Component } from 'react';
import { graphql, compose, Query } from 'react-apollo';
import { getActiveTasksQuery, getUser, getContributionList, deleteTaskMutation } from '../../queries/queries';
import Task from './Task';
import AddTask from './AddTask';

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    }
  }

  displayTasks(data) {
    let tasks = [...data.getActiveTasksQuery];
    return tasks.map(task => {
      return (
        <li key={task.id + "li"}><Task taskId={task.id} taskName={task.taskName} taskPoints={task.points} userName={this.props.userName} userId={this.props.getUser.user.id} familyGroupId={this.props.getUser.user.familyGroupId} /></li>
      );
    })
  }

  handleOnClickEvent(evt, taskId, taskName, points) {
    evt.preventDefault()

    this.setState({ selected: taskId });

    if (evt.target.childNodes[5]) {
      evt.target.childNodes[5].classList.toggle("show");
    }
  }

  handleAcceptTask(evt, taskId, taskName, points) {
    evt.preventDefault()

    console.log("handleContributeTask");

  }

  handleModifyTask(evt, taskId, taskName, points) {
    evt.preventDefault();


    let dropdowns = document.getElementsByClassName(taskId + "_dropdown-content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }

  handleDeleteask(evt, taskId, taskName, points) {
    evt.preventDefault();
  }

  render() {

    let taskListPane = null;
    let addTaskPane = null;

    if (this.props.getUser.loading) {
      taskListPane = <div />;
    } else {
      taskListPane = (
        <Query query={getActiveTasksQuery}
          variables={{
            userName: this.props.userName,
            familyGroupId: this.props.getUser.user.familyGroupId
          }
          }>
          {({ loading, error, data }) => {
            if (loading) return <div>Fetching</div>
            if (error) return <div>Error</div>


            return (
              <React.Fragment>
                {this.displayTasks(data)}
              </React.Fragment>
            )
          }}
        </Query>
      );
    }

    if (this.props.getUser.loading) {
      addTaskPane = <div />;
    } else {
      addTaskPane = (this.props.getUser.user.roleName.split(",").includes("Parent")) ?
        (
          <AddTask taskId={this.state.selected} userId={this.props.getUser.user.id} userName={this.props.userName} familyGroupId={this.props.getUser.user.familyGroupId} />
        ) : (
          <div className="add-button-div" />
        );
    }

    return (
      <div id="task-pane" className="task-list">
        <form>
          <ul id="task-list" >
            {taskListPane}
          </ul>
        </form>
        {addTaskPane}
      </div>
    );
  }
};

export default compose(
  graphql(getUser, {
    name: "getUser",
    options: (props) => {
      return {
        variables: { userName: props.userName }
      }
    }
  }),
  graphql(getContributionList, {
    name: "getContributionList",
    options: (props) => {
      return {
        variables: { userName: props.userName }
      }
    }
  }),
  graphql(deleteTaskMutation, { name: "deleteTaskMutation" })
)(TaskList);
