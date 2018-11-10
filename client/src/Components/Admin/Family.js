import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import {
  getFamilyGroups, getUser, addFamilyGroupMutation
} from '../../queries/queries';

class Family extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      lastName: "",
      address: "",
      contactNumber: ""
    };
  }

  displayFamilyGroups() {
    if (this.props.getFamilyGroups.loading) {
      return <div>Loading...</div>
    } else {

      let groups = this.props.getFamilyGroups.familyGroups;
      if (groups) {
        return (
          <React.Fragment>
            <thead>
              {this.displayHeader()}
            </thead>
            <tbody>
              {this.displayBody(groups)}
            </tbody>
          </React.Fragment>
        )
      } else {
        return (
          <div>Empty</div>
        )
      }
    }

  }

  displayHeader() {
    return (
      <tr>
        <th width="15%">Name</th>
        <th width="20%">Family Name</th>
        <th width="40%">Address</th>
        <th width="25%">Contact Number</th>
      </tr >
    )
  }

  displayBody(groups) {

    return (
      groups.map((group, index) => {
        return (
          <React.Fragment key={group.id + "_fragment"}>
            <tr>
              <td id={group.id + "_name"} width="15%" key={group.id + "_name"} >{group.name}</td>
              <td id={group.id + "_lastName"} width="20%" key={group.id + "_lastName"} >{group.lastName}</td>
              <td id={group.id + "_address"} width="40%" key={group.id + "_address"} >{group.address}</td>
              <td id={group.id + "_contactNumber"} width="25%" key={group.id + "_contactNumber"} >{group.contactNumber}</td>
            </tr>
          </React.Fragment >
        )
      })
    )
  }

  handleAddFamily(evt) {
    evt.preventDefault();
    this.props.addFamilyGroupMutation({
      variables: {
        name: this.state.name,
        lastName: this.state.lastName,
        address: this.state.address,
        contactNumber: this.state.contactNumber
      },
      refetchQueries: [{ query: getFamilyGroups }]
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
        <table >
          {this.displayFamilyGroups()}
        </table>
        <br />
        <br />
        <div className="family-content">
          <label className="task-field">Name:</label><input id="name" onChange={(evt) => this.setState({ name: evt.target.value })}></input><br />
          <label className="task-field">Last Name:</label><input id="lastName" onChange={(evt) => this.setState({ lastName: evt.target.value })}></input><br />
          <label className="task-field">Address:</label><input id="address" onChange={(evt) => this.setState({ address: evt.target.value })}></input><br />
          <label className="task-field">Contact Number:</label><input id="contactNumber" onChange={(evt) => this.setState({ contactNumber: evt.target.value })}></input><br />
        </div>
        <div>
          <button onClick={(evt) => this.handleAddFamily(evt)} type="submit">Add Family</button>
        </div>
      </form>

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
  graphql(getFamilyGroups, { name: "getFamilyGroups" }),
  graphql(addFamilyGroupMutation, { name: "addFamilyGroupMutation" })
)(Family);