import React from 'react';
import WalletConnect from '../components/WalletConnect';
import DonationForm from '../components/DonationForm';
import CharityList from '../components/CharityList';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Charity Donation Tracker</h1>
        <p>Transparent, blockchain-powered charity donations</p>
        <WalletConnect />
      </div>

      <div className="content-section">
        <div className="left-column">
          <CharityList />
        </div>
        <div className="right-column">
          <DonationForm />
        </div>
      </div>
    </div>
  );
};

export default Home;
