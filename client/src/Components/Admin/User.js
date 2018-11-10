import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import {
  getUserList, getUser, addUserMutation, getFamilyGroups
} from '../../queries/queries';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      bod: "",
      familyGroupId: "",
      role: ""
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
              <td id={user.id + "_name"} width="20%" key={user.id + "_name"} >{user.name}</td>
              <td id={user.id + "_userName"} width="20%" key={user.id + "_userName"} >{user.userName}</td>
              <td id={user.id + "_bod"} width="20%" key={user.id + "_bod"} >{user.bod}</td>
              <td id={user.id + "_roles"} width="20%" key={user.id + "_roles"} >{user.roleName}</td>
              <td id={user.id + "_family"} width="20%" key={user.id + "_family"} >{user.familyGroup[0].name}</td>
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
        name: this.state.name,
        userName: this.state.email,
        roleName: this.state.role,
        bod: this.state.bod,
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
      <form onSubmit={this.handleOnSubmit.bind(this)} >
        <div>
          {this.displayUsers()}
        </div>
        <br />
        <br />
        <div>
          <label className="task-field">Name:</label><input id="name" onChange={(evt) => this.setState({ name: evt.target.value })}></input><br />
          <label className="task-field">email:</label><input id="email" onChange={(evt) => this.setState({ email: evt.target.value })}></input><br />
          <label className="task-field">BOD:</label><input id="bod" onChange={(evt) => this.setState({ bod: evt.target.value })}></input><br />

          <label className="task-field">Family:</label>
          <select id="familyGroup" onChange={(evt) => this.setState({ familyGroupId: evt.target.value })}>
            <option value="-1">--Select--</option>
            {this.displayFamilyGroupOptions()}
          </select><br />
          <label className="task-field">Role:</label>
          <select id="userRole" onChange={(evt) => this.setState({ role: evt.target.value })}>
            <option value="-1">--Select--</option>
            {this.displayRoleOptions()}
          </select><br />
        </div>
        <div>
          <button onClick={(evt) => this.handleAddUser(evt)} type="submit">Add User</button>
        </div>
      </form >

    )
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
        <option key="Admin" value="Admin"> Child</option>
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