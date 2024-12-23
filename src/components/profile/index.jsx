// pages/index.js (Next.js) or App.js (React.js)

import React, { Component } from 'react';

class a extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchQuery: '',
      filteredMatches: [],
    };
  }

  componentDidMount() {
    // Simulating fetching the uploaded JSON file data
    fetch('/data.json') // Replace with your JSON file path
      .then((response) => response.json())
      .then((jsonData) => {
        this.setState({ data: jsonData.data, filteredMatches: jsonData.data });
      })
      .catch((error) => console.error('Error fetching data:', error));
  }

  handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    const filteredMatches = this.state.data.filter((match) =>
      match.matches?.match?.id?.toLowerCase().includes(query)
    );
    this.setState({ searchQuery: query, filteredMatches });
  };

  renderTableHeaders() {
    return (
      <tr>
        <th>Match ID</th>
        <th>Bookmaker ID</th>
        <th>Bookmaker Name</th>
        <th>Odds</th>
      </tr>
    );
  }

  renderTableRows() {
    const { filteredMatches } = this.state;

    return filteredMatches.map((match) => {
      const { id, localteam, awayteam, odds } = match.matches?.match || {};
      const bookmakers = odds?.type?.flatMap((type) =>
        Array.isArray(type.bookmaker) ? type.bookmaker : []
      ) || [];

      return bookmakers.map((bm, bmIndex) => (
        <tr key={`${id}-${bmIndex}`}>
          <td>{id}</td>
          <td>{bm.id}</td>
          <td>{bm.name}</td>
          <td>{(bm.odd || []).map((o) => `${o.name} - ${o.value}`).join(', ')}</td>
        </tr>
      ));
    });
  }

  render() {
    return (
      <div>
       <div className="container">
       <h1>Match Odds Table</h1>
        <input
          type="text"
          placeholder="Search by Match ID"
          value={this.state.searchQuery}
          onChange={this.handleSearch}
        />
        <table className="table table-bordered table-hover table-striped">
          <thead>{this.renderTableHeaders()}</thead>
          <tbody>{this.renderTableRows()}</tbody>
        </table>
       </div>
      </div>
    );
  }
}

export default a;
