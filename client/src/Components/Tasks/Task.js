import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo';
import { getActiveTasksQuery, deleteTaskMutation, getContributionList, addContributionMutation } from '../../queries/queries';

class Task extends Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleAcceptTask(evt) {
    evt.preventDefault();

    let time, multiplier, redeemedPoints;
    if (this.props.taskName === "Go to grocery store with mom or dad") {
      time = prompt("Please enter your time (in minute(s)) you were out with mom and/or dad");
      if (isNaN(time)) {
        alert("Please enter a number")
        return;
      } else {
        multiplier = Math.ceil(parseInt(time, 10) / 5);
        redeemedPoints = Math.ceil(parseInt(this.props.taskPoints, 10) * multiplier / 100)

      }
    } else {
      multiplier = 1;
      redeemedPoints = Math.ceil(parseInt(this.props.taskPoints, 10) * multiplier / 100)

    }



    this.props.addContributionMutation({
      variables: {
        title: this.props.taskName,
        userId: this.props.userId,
        multiplier: multiplier,
        points: parseInt(this.props.taskPoints, 10),
        redeemedPoints: redeemedPoints,
        taskId: this.props.taskId

      },
      refetchQueries: [{ query: getContributionList, variables: { userName: this.props.userName } }]
    });


  }

  handleDeleteTask(evt) {
    evt.preventDefault();

    this.props.deleteTaskMutation({
      variables: { taskId: this.props.taskId },
      refetchQueries: [{ query: getActiveTasksQuery, variables: { userName: this.props.userName, familyGroupId: this.props.familyGroupId } }]
    });

  }

  handleClickOutside(evt) {
    if (this.wrapperRef && !this.wrapperRef.contains(evt.target)) {

      document.getElementById(this.props.taskId + "_dropdown").classList.remove("show");
      /*
      let dropdowns = document.getElementsByClassName(this.props.taskId + "_dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
      */
    }
  }

  handleOnClickEvent = (evt) => {
    if (this.wrapperRef.contains(evt.target)) {
      document.getElementById(this.props.taskId + "_dropdown").classList.toggle("show");

      return;
    }

    //this.handleClickOutside(evt);
  }

  render() {
    return (
      <div id={this.props.taskId + "_task-item"} ref={this.setWrapperRef} onClick={(evt) => this.handleOnClickEvent(evt)}>
        {this.props.taskName}, ({this.props.taskPoints} pts!!)
          <div id={this.props.taskId + "_dropdown"} className="dropdown-content" >
          <a id={this.props.taskId + "_contribute_accept"} onClick={(evt) => this.handleAcceptTask(evt)}>Accept</a>
          <a id={this.props.taskId + "_task_delete"} onClick={(evt) => this.handleDeleteTask(evt)}>Delete</a>
        </div>
      </div>
    )

  }
}

export default compose(
  graphql(getActiveTasksQuery, {
    name: "getActiveTasksQuery",
    options: (props) => {
      return {
        variables: { userName: props.userName, familyGroupId: props.familyGroupId }
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
  graphql(addContributionMutation, { name: "addContributionMutation" }),
  graphql(deleteTaskMutation, { name: "deleteTaskMutation" })
)(Task);