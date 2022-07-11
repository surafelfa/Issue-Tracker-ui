/* eslint-disable linebreak-style */


import React from 'react';
import graphQLFetch from './graphQLFetch.js';

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      about: '',
    };
  }

  async componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const data = await graphQLFetch('query {about}');
    if (data) this.setState({ about: data.about });
  }

  render() {
    const { about } = this.state;
    return (
      <div className="text-center">
        <h3>Issue Tracker version 0.9</h3>
        <h4>
          {about}
        </h4>
      </div>
    );
  }
}
