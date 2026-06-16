import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import CharityDonationABI from '../contracts/CharityDonation.json';

export const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          setAccount(accounts[0]);

          // Load contract
          const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
          const contractInstance = new web3Instance.eth.Contract(
            CharityDonationABI.abi,
            contractAddress
          );
          setContract(contractInstance);
        } else {
          setError('Please install MetaMask');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    initWeb3();
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setWeb3(null);
    setContract(null);
  };

  const value = {
    web3,
    account,
    contract,
    loading,
    error,
    connectWallet,
    disconnectWallet,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};
