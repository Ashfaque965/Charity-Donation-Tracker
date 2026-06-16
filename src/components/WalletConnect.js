import React, { useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';

const WalletConnect = () => {
  const { account, loading, error, connectWallet, disconnectWallet } =
    useContext(BlockchainContext);

  return (
    <div className="wallet-connect">
      {error && <div className="error-message">{error}</div>}
      {account ? (
        <div className="wallet-connected">
          <span className="wallet-address">
            {account.substring(0, 6)}...{account.substring(account.length - 4)}
          </span>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWallet} disabled={loading}>
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
