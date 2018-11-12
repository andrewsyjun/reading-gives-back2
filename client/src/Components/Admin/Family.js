import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import {
  getFamilyGroups, getUser, addFamilyGroupMutation
} from '../../queries/queries';

import FormErrors from '../Error/FormErrors';

class Family extends Component {
  constructor(props) {
    super(props);
    this.state = {
      familyName: "",
      lastName: "",
      address: "",
      contactNumber: "",
      formErrors: { familyName: "", lastName: "", address: "", contactNumber: "" },
      familyNameValid: false,
      lastNameValid: false,
      addressValid: false,
      contactNumberValid: false,
      formValid: false
    };
  }

  displayFamilyGroups() {
    if (this.props.getFamilyGroups.loading) {
      return <div>Loading...</div>
    } else {

      let groups = this.props.getFamilyGroups.familyGroups;
      if (groups) {
        return (
          <table className="family-content">
            <thead>
              {this.displayHeader()}
            </thead>
            <tbody>
              {this.displayBody(groups)}
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
              <td id={group.id + "_familyName"} width="15%" key={group.id + "_familyName"} >{group.name}</td>
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
        name: this.state.familyName,
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
      <form onSubmit={this.handleOnSubmit.bind(this)} className="admin-container">
        <div className="panel panel-default">
          <FormErrors formErrors={this.state.formErrors} />
        </div>
        {this.displayFamilyGroups()}
        <br />
        <div className="admin-container">
          <div>
            <label className="admin-task-field" htmlFor="familyName">Name:</label><input id="familyName" value={this.state.familyName} onChange={(evt) => this.handleUserInput(evt)} className="admin-input-field" />
          </div>
          <div>
            <label className="admin-task-field" htmlFor="lastName">Last Name:</label><input id="lastName" value={this.state.lastName} onChange={(evt) => this.handleUserInput(evt)} className="admin-input-field" />
          </div>
          <div>
            <label className="admin-task-field" htmlFor="address">Address:</label><input id="address" value={this.state.address} onChange={(evt) => this.handleUserInput(evt)} className="admin-input-field" />
          </div>
          <div>
            <label className="admin-task-field" htmlFor="contactNumber">Contact Number:</label><input id="contactNumber" value={this.state.contactNumber} onChange={(evt) => this.handleUserInput(evt)} className="admin-input-field" />
          </div>
          <div>
            <button onClick={(evt) => this.handleAddFamily(evt)} type="submit" className="admin-add-button" disabled={!this.state.formValid}>Add Family</button>
          </div>
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
    let familyNameValid = this.state.familyNameValid;
    let lastNameValid = this.state.lastNameValid;
    let addressValid = this.state.addressValid;
    let contactNumberValid = this.state.contactNumberValid;

    switch (fieldName) {
      case "familyName":
        familyNameValid = value.length > 0;
        fieldValidationErrors.familyName = familyNameValid ? "" : " cannot be empty";
        break;
      case "lastName":
        lastNameValid = value.length > 0;
        fieldValidationErrors.lastName = lastNameValid ? "" : " cannot be empty";
        break;
      case "address":
        addressValid = value.length > 0;
        fieldValidationErrors.address = addressValid ? "" : " cannot be empty";
        break;
      case "contactNumber":
        contactNumberValid = value.length > 0;
        fieldValidationErrors.contactNumber = contactNumberValid ? "" : " cannot be empty";
        break;
      default:
        break;
    }
    this.setState({
      formErrors: fieldValidationErrors,
      familyNameValid: familyNameValid,
      lastNameValid: lastNameValid,
      addressValid: addressValid,
      contactNumberValid: contactNumberValid
    }, this.validateForm);
  }


  handleOnSubmit = (evt) => {
    evt.preventDefault();
  }

  errorClass(error) {
    return (error.length === 0 ? "" : "has-error");
  }

  validateForm() {
    this.setState({ formValid: this.state.familyNameValid && this.state.lastNameValid && this.state.addressValid && this.state.contactNumberValid });
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