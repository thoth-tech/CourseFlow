import React, { useState } from 'react';
import './sidebar.css';

const Sidebar = () => {
  const [units, setUnits] = useState('');
  const [totalYears, setTotalYears] = useState('');
  const [expectedYears, setExpectedYears] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleCalculate = () => {
    // Perform calculations based on the user inputs
    // You can implement your own logic here

    setShowResult(true);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h2>University Planner</h2>
        <form className="input-form">
          <label htmlFor="units">University Units:</label>
          <input
            type="text"
            id="units"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
          />
          <label htmlFor="totalYears">Total Years to Complete:</label>
          <input
            type="text"
            id="totalYears"
            value={totalYears}
            onChange={(e) => setTotalYears(e.target.value)}
          />
          <label htmlFor="expectedYears">Expected Years to Complete:</label>
          <input
            type="text"
            id="expectedYears"
            value={expectedYears}
            onChange={(e) => setExpectedYears(e.target.value)}
          />
          <button type="button" onClick={handleCalculate}>Calculate</button>
        </form>
        {showResult && (
          <div className="result-pop-up">
            <h3>Predicted years to finish</h3>
            {/* Display the calculated result here */}
            <p>Predicted years for Bachelor of Computer Science students to graduate is: 1year  (if every units are passed)</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
