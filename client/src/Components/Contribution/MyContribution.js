import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { getContributionList, redeemContribution, getRedeemedContributionList, removeContributionFromList } from '../../queries/queries';


import deleteButton from '../../assets/icons/remove.png';

class MyContribution extends Component {
  displayContributions() {
    let data = this.props.getContributionList;
    if (data.loading) {
      return (
        <tr><td> Loading data ... </td></tr>
      )
    } else {
      let contributions = [...data.getContributionList];
      if (contributions.length === 0) {
        return <tr><td> ... </td></tr>
      } else {
        return contributions.map(contribution => {
          return (
            <tr key={contribution.id + "tr"}>
              <td className="task-done-checkbox">
                <input
                  name={contribution.id + "_cb_ name"}
                  type="checkbox"
                  onChange={(evt) => this.handleRedeemed(evt, contribution.id, contribution.redeemedPoints)}
                  id={contribution.id + "_cb_id"} />
              </td >
              <td className="task-title">
                <div key={contribution.id}> {contribution.title}, ({contribution.points} pts or {contribution.redeemedPoints} token(s))</div>
              </td>
              <td className="task-delete-button">
                <div>
                  <input id={contribution.id + "_delete_button"} type="image" className="image-action-button" src={deleteButton} title="Delete selected task" alt="Delete selected task"
                    onClick={(evt) => this.handleDeleteTask(evt, contribution.id)} /></div>
              </td>
            </tr >
          );
        });
      }
    }
  }

  handleRedeemed(evt, contributionId, points) {
    evt.preventDefault();

    let answer = window.confirm("Great job! You are redeeming " + points + " token(s)");
    if (answer) {
      evt.target.checked = "checked";
      this.props.redeemContribution({
        variables: {
          contributionId: contributionId,
          redeemedPoints: points
        },
        refetchQueries: [{ query: getContributionList, variables: { userName: this.props.userName } },
        { query: getRedeemedContributionList, variables: { userName: this.props.userName } }]
      });
    } else {
      evt.target.checked = false;
    }


  }

  handleDeleteTask(evt, contributionId) {
    evt.preventDefault();

    let answer = window.confirm("Are you sure you want to delete this contribution from your to-do list?");
    if (answer) {
      this.props.removeContributionFromList({
        variables: {
          contributionId: contributionId
        },
        refetchQueries: [{ query: getContributionList, variables: { userName: this.props.userName } },
        { query: getRedeemedContributionList, variables: { userName: this.props.userName } }]
      });
    }

  }


  render() {
    return (
      <div id="contribution-list" className="content-pane">
        <h1>It's my pleasure to contribute around the house</h1>
        <form>
          <table className="table-contributions">
            <tbody>
              {this.displayContributions()}
            </tbody>
          </table>
        </form>
      </div>
    )
  }
}

export default compose(
  graphql(getContributionList, {
    name: "getContributionList",
    options: (props) => {
      return {
        variables: { userName: props.userName }
      }
    }
  }),
  graphql(getRedeemedContributionList, {
    name: "getRedeemedContributionList",
    options: (props) => {
      return {
        variables: { userName: props.userName }
      }
    }
  }),
  graphql(redeemContribution, { name: "redeemContribution" }),
  graphql(removeContributionFromList, { name: "removeContributionFromList" })
)(MyContribution);