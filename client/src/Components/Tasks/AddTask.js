import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { addTaskMutation, getActiveTasksQuery, getAgeGroups } from '../../queries/queries';

class AddTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskName: "",
      points: "",
      ageGroupId: ""
    };
  }

  displayAgeGroupOptions() {

    let data = this.props.getAgeGroups;
    if (data.loading) {
      return (
        <option>Loading options...</option>
      )
    } else {

      return (
        data.ageGroups.map(group => {
          return (
            <option key={group.id} value={group.id}> {group.name}</option>
          )
        })
      )
    }
  }


  submitForm(e) {
    e.preventDefault()
    // use the addTaskMutation
    this.props.addTaskMutation({
      variables: {
        taskName: this.state.taskName,
        points: parseInt(this.state.points, 10),
        userId: this.props.userId,
        ageGroupId: this.state.ageGroupId,
        familyGroupId: this.props.familyGroupId
      },
      refetchQueries: [{ query: getActiveTasksQuery, variables: { userName: this.props.userName, familyGroupId: this.props.familyGroupId } }]
    });
  }

  render() {

    return (
      <form className="add-task-form" id="add-task" onSubmit={this.submitForm.bind(this)} >
        <div className="task-field">
          <label className="task-field">Task:</label>
          <input className="task-field" type="text" onChange={(evt) => this.setState({ taskName: evt.target.value })} />
        </div>
        <div className="task-field">
          <label className="task-field">Points:</label>
          <input className="task-field" type="text" onChange={(evt) => this.handelOnChange(evt)} />
        </div>
        <div className="task-field">
          <label className="task-field">Age Group:</label>
          <select className="task-field" type="text" onChange={(evt) => this.setState({ ageGroupId: evt.target.value })}>
            {this.displayAgeGroupOptions()}
          </select>
        </div>
        <div className="add-button" >
          <input type="submit" title="Add selected task" alt="Add selected task" value="Add Task" />
        </div>
      </form >
    );
  }


  handelOnChange(evt) {

    if (isNaN(evt.target.value)) {
      alert("Point value should be a number");
      this.setState({ points: '' })
      return;
    } else {
      this.setState({ points: evt.target.value })
    }

  }
}


export default compose(
  graphql(getAgeGroups, { name: "getAgeGroups" }),
  graphql(addTaskMutation, { name: "addTaskMutation" })
)(AddTask);
