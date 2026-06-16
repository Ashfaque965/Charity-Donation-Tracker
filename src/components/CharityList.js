import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BlockchainContext } from '../context/BlockchainContext';

const CharityList = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { contract } = useContext(BlockchainContext);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/charities/all`
        );
        setCharities(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharities();
  }, []);

  if (loading) return <div>Loading charities...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="charity-list">
      <h2>Registered Charities</h2>
      <div className="charities-grid">
        {charities.map((charity) => (
          <div key={charity._id} className="charity-card">
            <h3>{charity.name}</h3>
            <p>{charity.description}</p>
            <div className="charity-stats">
              <p>
                <strong>Total Funds Received:</strong> {charity.totalFundsReceived} ETH
              </p>
              <p>
                <strong>Funds Allocated:</strong> {charity.fundsAllocated} ETH
              </p>
              <p>
                <strong>Funds Distributed:</strong> {charity.fundsDistributed} ETH
              </p>
              <p>
                <strong>Status:</strong> {charity.isVerified ? 'Verified' : 'Pending'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharityList;
