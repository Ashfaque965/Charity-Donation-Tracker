import { useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';

export const useBlockchain = () => {
  return useContext(BlockchainContext);
};
