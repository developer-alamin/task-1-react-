import React, { useState, useEffect } from 'react';

const App = () => {
  const [data, setData] = useState([]); // Store all matches
  const [searchQuery, setSearchQuery] = useState(''); // Search query for bookmaker ID
  const [filteredMatches, setFilteredMatches] = useState([]); // Filtered results

  // Simulate fetching the uploaded JSON file data
  useEffect(() => {
    fetch('/data.json') // Ensure the correct path to your data file
      .then((response) => response.json())
      .then((jsonData) => {// Debug: log fetched data
        setData(jsonData.data);
        setFilteredMatches(jsonData.data); // Initially show all matches
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const handleSearch = (event) => {
    
    const query = event.target.value.trim().toLowerCase(); // Trim spaces and convert to lowercase
    setSearchQuery(query);

    if (query === '') {
      setFilteredMatches(data); // If search is empty, show all data
      return;
    }

    // Filter the matches based on the bookmaker ID
    const filtered = data.filter((match) => {
      const bookmakers = match?.matches?.match?.odds?.type?.flatMap((type) =>
        Array.isArray(type.bookmaker) ? type.bookmaker : []
      ) || [];

      // Check if any bookmaker's ID matches the search query exactly
      return bookmakers.some((bm) => {
        const bookmakerId = bm.id?.toString().toLowerCase();
        return bookmakerId === query;
      });
    });

    // Debug: log filtered matches
    setFilteredMatches(filtered);  // Update state with filtered results
  };

  const renderTableHeaders = () => {
    return (
      <tr>
        <th>Match ID</th>
        <th>Bookmaker ID</th>
        <th>Bookmaker Name</th>
        <th>Odds</th>
      </tr>
    );
  };

  const renderTableRows = () => {
    return filteredMatches.map((match) => {
      const { id, odds } = match.matches?.match || {};
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
  };

  return (
    <div>
      <div className="container">
        <h1>Match Odds Table</h1>
        <input
          type="text"
          placeholder="Search by Bookmaker ID"
          value={searchQuery}
          onChange={handleSearch}
        />
        <table className="table table-bordered table-hover table-striped">
          <thead>{renderTableHeaders()}</thead>
          <tbody>{renderTableRows()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
