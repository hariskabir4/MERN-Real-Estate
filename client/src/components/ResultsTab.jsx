import React from 'react';
import './ResultsTab.css';

const ResultsTab = () => {
  return (
    <div className="results-container">
      <span className="results-label">Results</span>
      <div className="dropdown">
        <button className="dropdown-button">Newest</button>
        <div className="dropdown-content">
          <div className="dropdown-item">Newest</div>
          <div className="dropdown-item">Oldest</div>
          <div className="dropdown-item">Most Relevant</div>
        </div>
      </div>
    </div>
  );
};

export default ResultsTab;
