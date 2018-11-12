import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';

import {
  getUserList, getUser, addUserMutation, getFamilyGroups
} from '../../queries/queries';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberName: "",
      email: "",
      dob: "",
      familyGroupId: "",
      roleName: "",
      formErrors: { memberName: "", email: "", dob: "", roleName: "", familyGroupId: "" },
      memberNameeValid: false,
      emailValid: false,
      dobValid: false,
      roleNameValid: false,
      familyGroupIdValid: false,
      formValid: false
    };
  }

  displayUsers() {
    if (this.props.getUserList.loading) {
      return <div>Loading...</div>
    } else {

      let users = this.props.getUserList.users;
      if (users) {
        return (
          <table className="user-content">
            <thead>
              {this.displayHeader()}
            </thead>
            <tbody>
              {this.displayBody(users)}
            </tbody>
          </table>
        )
      } else {
        return (
          <div>Empty</div>
        )
      }
    }

  }

  /*
  name
userName
roleName
bod
familyGroup
*/
  displayHeader() {
    return (
      <tr>
        <th width="20%">Name</th>
        <th width="20%">User Name</th>
        <th width="20%">Birthday</th>
        <th width="20%">Roles</th>
        <th width="20%">Family</th>
      </tr >
    )
  }

  displayBody(users) {

    return (
      users.map((user, index) => {
        return (
          <React.Fragment key={user.id + "_fragment"}>
            <tr>
              <td id={user.id + "_memberName"} width="20%" key={user.id + "_memberName"} >{user.name}</td>
              <td id={user.id + "_email"} width="20%" key={user.id + "_email"} >{user.userName}</td>
              <td id={user.id + "_dob"} width="20%" key={user.id + "_dob"} >{user.dob}</td>
              <td id={user.id + "_roleName"} width="20%" key={user.id + "_roleName"} >{user.roleName}</td>
              <td id={user.id + "_familyGroupId"} width="20%" key={user.id + "_familyGroupId"} >{user.familyGroup[0].name}</td>
            </tr>
          </React.Fragment >
        )
      })
    )
  }

  handleAddUser(evt) {
    evt.preventDefault();
    this.props.addUserMutation({
      variables: {
        name: this.state.memberName,
        userName: this.state.email,
        roleName: this.state.roleName,
        dob: this.state.dob,
        familyGroupId: this.state.familyGroupId
      },
      refetchQueries: [{ query: getUserList }]
    });
  }

  render() {

    if (this.props.getUser.loading) {
      return <div>Loading...</div>
    }

    if (!this.props.getUser.user.roleName.split(",").includes("Admin")) {
      return <div>You don't have access to this page</div>
    }

    return (
      <form onSubmit={this.handleOnSubmit.bind(this)} className="admin-container">
        <div>
          {this.displayUsers()}
        </div>
        <br />
        <div className={`form-group ${this.errorClass(this.state.formErrors.memberName)}`}>
          <label className="admin-task-field">Name:</label><input id="memberName" value={this.state.memberName} onChange={(evt) => this.handleUserInput(evt)} className="admin-input-field" />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
          <label className="admin-task-field">Email:</label><input id="email" value={this.state.email} onChange={(evt) => this.handleUserInput(evt)} className="admin-input-field" />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.dob)}`}>
          <label className="admin-task-field">Date of Birth:</label><input id="dob" type="date" value={this.state.dob} onChange={(evt) => this.handleUserInput(evt)} className="admin-input-field" />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.familyGroupId)}`}>
          <label className="admin-task-field">Family:</label>
          <select id="familyGroupId" value={this.state.familyGroupId} onChange={(evt) => this.handleUserInput(evt)} className="admin-input-field">
            <option value="-1">--Select--</option>
            {this.displayFamilyGroupOptions()}
          </select>
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.roleName)}`}>
          <label className="admin-task-field">Role:</label>
          <select id="roleName" value={this.state.roleName} onChange={(evt) => this.handleUserInput(evt)} className="admin-input-field">
            <option value="-1">--Select--</option>
            {this.displayRoleOptions()}
          </select>
        </div>
        <div>
          <button onClick={(evt) => this.handleAddUser(evt)} type="submit" className="btn btn-primary" disabled={!this.state.formValid}>Add User</button>
        </div>
      </form >

    )
  }

  handleUserInput(evt) {
    let name = evt.target.id;
    let value = evt.target.value;
    this.setState({ [name]: value },
      () => { this.validateField(name, value) });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let memberNameValid = this.state.memberNameValid;
    let emailValid = this.state.emailValid;
    let dobValid = this.state.dobValid;
    let roleNameValid = this.state.roleNameValid;
    let familyGroupIdValid = this.state.familyGroupIdValid;

    switch (fieldName) {
      case "memberName":
        memberNameValid = value.length > 0;
        fieldValidationErrors.memberName = memberNameValid ? "" : " cannot be empty";
        break;
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);;
        fieldValidationErrors.email = emailValid ? "" : " cannot be empty";
        break;
      case "dob":
        dobValid = value.length > 0;
        fieldValidationErrors.dob = dobValid ? "" : " cannot be empty";
        break;
      case "roleName":
        roleNameValid = value.length > 0;
        fieldValidationErrors.roleName = roleNameValid ? "" : " cannot be empty";
        break;
      case "familyGroupId":
        familyGroupIdValid = value.length > 0;
        fieldValidationErrors.familyGroupId = familyGroupIdValid ? "" : " cannot be empty";
        break;
      default:
        break;
    }
    this.setState({
      formErrors: fieldValidationErrors,
      memberNameValid: memberNameValid,
      emailValid: emailValid,
      dobValid: dobValid,
      roleNameValid: roleNameValid,
      familyGroupIdValid: familyGroupIdValid
    }, this.validateForm);
  }

  errorClass(error) {
    return (error.length === 0 ? "" : "has-error");
  }

  validateForm() {
    this.setState({ formValid: this.state.memberNameValid && this.state.emailValid && this.state.dobValid && this.state.roleNameValid && this.state.familyGroupIdValid });
  }

  displayFamilyGroupOptions() {

    let data = this.props.getFamilyGroups;
    if (data.loading) {
      return (
        <option>Loading options...</option>
      )
    } else {

      return (
        data.familyGroups.map(group => {
          return (
            <option key={group.id} value={group.id}> {group.name}</option>
          )
        })
      )
    }
  }

  displayRoleOptions() {
    return (
      <React.Fragment>
        <option key="Child" value="Child"> Child</option>
        <option key="Parent" value="Parent"> Parent</option>
        <option key="Admin" value="Admin"> Admin</option>
      </React.Fragment>
    )
  }

  handleOnSubmit = (evt) => {
    evt.preventDefault();
  }
}

export default compose(
  graphql(getUser, {
    name: "getUser",
    options: (props) => {
      return {
        variables: { userName: props.userName }
      }
    }
  }),
  graphql(getUserList, { name: "getUserList" }),
  graphql(getFamilyGroups, { name: "getFamilyGroups" }),
  graphql(addUserMutation, { name: "addUserMutation" })
)(User);