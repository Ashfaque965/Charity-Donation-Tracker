import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [charityId, setCharityId] = useState('');

  const fetchStats = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/charities/stats/${id}`
      );
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (charityId) {
      fetchStats(charityId);
    }
  };

  return (
    <div className="dashboard">
      <h2>Charity Dashboard</h2>

      <form onSubmit={handleSubmit} className="dashboard-search">
        <input
          type="number"
          placeholder="Enter Charity ID"
          value={charityId}
          onChange={(e) => setCharityId(e.target.value)}
          required
        />
        <button type="submit">View Stats</button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div className="error">Error: {error}</div>}

      {stats && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{stats.charityName}</h3>
            <div className="stat-item">
              <label>Total Funds Received:</label>
              <span>{stats.totalFundsReceived} ETH</span>
            </div>
            <div className="stat-item">
              <label>Funds Allocated:</label>
              <span>{stats.fundsAllocated} ETH</span>
            </div>
            <div className="stat-item">
              <label>Funds Distributed:</label>
              <span>{stats.fundsDistributed} ETH</span>
            </div>
            <div className="stat-item">
              <label>Total Donations:</label>
              <span>{stats.donationCount}</span>
            </div>
            <div className="stat-item">
              <label>Verified Donations:</label>
              <span>{stats.verifiedDonations}</span>
            </div>
            <div className="stat-item">
              <label>Allocations:</label>
              <span>{stats.allocationCount}</span>
            </div>
            <div className="stat-item">
              <label>Completed Allocations:</label>
              <span>{stats.completedAllocations}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
