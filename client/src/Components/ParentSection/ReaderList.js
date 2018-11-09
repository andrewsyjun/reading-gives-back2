import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import {
  getReaders
} from '../../queries/queries';


class ReaderList extends Component {

  displayReaders() {
    let data = this.props.getReaders;
    if (data.loading) {
      return (
        <option disabled>Loading...</option>
      )
    } else {
      return data.getReaders.map(reader => {
        return (<option id={reader.userName} key={reader.id} value={reader.id}>{reader.name}</option>);
      });
    }
  }

  render() {
    return (
      <select className="reader-list" onChange={(evt) => this.onChangeHandle(evt, evt.target.value)} >
        <option>Select reader</option>

        {this.displayReaders()}
      </select>
    );
  }

  onChangeHandle(evt) {
    this.props.onChangeHandle(evt);
  }


}


export default compose(
  graphql(getReaders, {
    name: "getReaders",
    options: (props) => {
      return {
        variables: { familyGroupId: props.familyGroupId }
      }
    }
  })
)(ReaderList);