/* eslint-disable linebreak-style */


import React from 'react';
import SelectAsync from 'react-select/lib/Async'; // eslint-disable-line
import { withRouter } from 'react-router-dom';
import graphQLFetch from './graphQLFetch.js';
import Toast from './Toast.jsx';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toastVisible: false,
      toastMessage: '',
      toastType: 'info',
    };
    this.onChangeSelection = this.onChangeSelection.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
  }

  onChangeSelection({ value }) {
    const { history } = this.props;
    history.push(`/edit/${value}`);
  }

  async loadOptions(term) {
    if (term.length < 3) return [];
    const query = `query issueList($search: String) {
      issueList(search: $search) {
        issues {id title}
      }
    }`;
    const data = await graphQLFetch(query, { search: term }, this.showError);
    return data.issueList.issues.map(issue => ({
      label: `#${issue.id}: ${issue.title}`, value: issue.id,
    }));
  }

  showSuccess(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'success',
    });
  }

  showError(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'danger',
    });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  render() {
    const { toastVisible, toastType, toastMessage } = this.state;
    return (
      <>
        <SelectAsync
          instanceId="search-select"
          value=""
          loadOptions={this.loadOptions}
          filterOption={() => true}
          onChange={this.onChangeSelection}
          components={{ DropdownIndicator: null }}
        />
        <Toast
          showing={toastVisible}
          onDismiss={this.dismissToast}
          bsStyle={toastType}
        >
          {toastMessage}
        </Toast>
      </>
    );
  }
}
// withRouter takes in a component class as an argument and returns a new
// component class that has history, location, and match available as part of props.
export default withRouter(Search);
