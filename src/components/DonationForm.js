import React, { useState, useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';
import axios from 'axios';

const DonationForm = () => {
  const { web3, account, contract, loading } = useContext(BlockchainContext);
  const [formData, setFormData] = useState({
    charityId: '',
    purpose: '',
    amount: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account) {
      setMessage('Please connect your wallet first');
      return;
    }

    try {
      setIsSubmitting(true);

      const amountInWei = web3.utils.toWei(formData.amount, 'ether');

      // Send transaction to blockchain
      const receipt = await contract.methods
        .donate(parseInt(formData.charityId), formData.purpose)
        .send({ from: account, value: amountInWei });

      // Record donation in backend
      const donationData = {
        donationId: receipt.events.DonationReceived.returnValues.donationId,
        charityId: receipt.events.DonationReceived.returnValues.charityId,
        donorWallet: account,
        charityName: formData.charityName,
        amount: parseFloat(formData.amount),
        transactionHash: receipt.transactionHash,
        purpose: formData.purpose,
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/donations/record`,
        donationData
      );

      setMessage('Donation successful!');
      setFormData({ charityId: '', purpose: '', amount: '' });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="donation-form">
      <h2>Make a Donation</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="charityId">Charity ID</label>
          <input
            type="number"
            id="charityId"
            name="charityId"
            value={formData.charityId}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount (ETH)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="purpose">Purpose</label>
          <input
            type="text"
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" disabled={isSubmitting || loading}>
          {isSubmitting ? 'Processing...' : 'Donate'}
        </button>
      </form>
    </div>
  );
};

export default DonationForm;
