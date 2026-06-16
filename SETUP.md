# Setup Guide

## Prerequisites

- Node.js v16+
- npm or yarn
- MetaMask browser extension
- MongoDB (local or cloud)
- Ganache CLI (for local blockchain)

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/charity-blockchain.git
cd charity-donation-tracker
```

### 2. Install All Dependencies

```bash
npm run install:all
```

Or install individually:

```bash
# Smart Contracts
cd smart-contracts && npm install

# Backend
cd ../backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env` in each directory and fill in values:

**smart-contracts/.env**
- Get PRIVATE_KEY from MetaMask
- Get INFURA_API_KEY from Infura.io

**backend/.env**
- MONGODB_URI: MongoDB connection string
- PORT: Server port (default 5000)
- JWT_SECRET: Secret key for JWT tokens

**frontend/.env**
- REACT_APP_API_URL: Backend URL (http://localhost:5000)
- REACT_APP_CONTRACT_ADDRESS: Deployed contract address

### 4. Start MongoDB

**Using Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

**Or locally:**
```bash
mongod
```

### 5. Start Smart Contracts (Ganache)

```bash
cd smart-contracts
npm run ganache
```

This starts a local Ethereum network on port 7545.

### 6. Deploy Smart Contracts

In a new terminal:
```bash
cd smart-contracts
npm run migrate
```

Note the deployed contract address and update `REACT_APP_CONTRACT_ADDRESS`.

### 7. Start Backend

In a new terminal:
```bash
cd backend
npm run dev
```

Server runs on http://localhost:5000

### 8. Start Frontend

In a new terminal:
```bash
cd frontend
npm start
```

App runs on http://localhost:3000

## Verify Installation

1. Visit http://localhost:3000
2. Connect MetaMask wallet
3. Should see "Registered Charities" section
4. No errors in browser console

## Common Issues

### MetaMask Connection Issues
- Make sure Ganache network is added to MetaMask
- Network: http://127.0.0.1:7545
- Chain ID: 1337

### MongoDB Connection Error
- Verify MongoDB is running
- Check connection string in .env
- Ensure database exists or auto-creates

### Contract Deployment Error
- Ensure Ganache is running
- Check PRIVATE_KEY is valid
- Verify Ganache port is 7545

## Next Steps

1. Explore the code structure
2. Read smart contract documentation
3. Test donation flow
4. Deploy to testnet (Sepolia)

## Testing

```bash
# Smart Contracts
cd smart-contracts && npm test

# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Deployment

### Smart Contracts - Sepolia Testnet
```bash
cd smart-contracts
# Update .env with testnet credentials
npm run migrate --network sepolia
```

### Backend - Production
```bash
cd backend
npm start
```

### Frontend - Production Build
```bash
cd frontend
npm run build
```

## Support

For issues, check GitHub issues or create new one.
