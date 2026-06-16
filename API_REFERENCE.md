# API Reference & Quick Start

## 🔗 API Base URL

**Development**: `http://localhost:5000/api`  
**Production**: `https://your-domain.com/api`

---

## 📌 Charity Endpoints

### 1. Register Charity
```http
POST /charities/register
Content-Type: application/json

{
  "name": "Red Cross",
  "description": "Humanitarian aid organization",
  "email": "contact@redcross.org",
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f42aE5",
  "registrationNumber": "REG-12345"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Charity registered successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "charityId": 1,
    "name": "Red Cross",
    "totalFundsReceived": 0,
    "isActive": true
  }
}
```

---

### 2. Get All Charities
```http
GET /charities/all
```

**Response (200)**:
```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

---

### 3. Get Single Charity
```http
GET /charities/{id}
```

---

### 4. Update Charity
```http
PUT /charities/{id}
Content-Type: application/json

{
  "name": "New Name",
  "description": "Updated description"
}
```

---

### 5. Get Charity Statistics
```http
GET /charities/stats/{charityId}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "charityId": 1,
    "charityName": "Red Cross",
    "totalFundsReceived": 100,
    "fundsAllocated": 60,
    "fundsDistributed": 40,
    "donationCount": 25,
    "verifiedDonations": 24,
    "allocationCount": 3,
    "completedAllocations": 1
  }
}
```

---

## 💰 Donation Endpoints

### 1. Record Donation
```http
POST /donations/record
Content-Type: application/json

{
  "donationId": 1,
  "charityId": 1,
  "donorWallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f42aE5",
  "charityName": "Red Cross",
  "amount": 1.5,
  "transactionHash": "0x1234567890...",
  "purpose": "Emergency Relief"
}
```

---

### 2. Get All Donations
```http
GET /donations/all
```

---

### 3. Get Donations by Charity
```http
GET /donations/charity/{charityId}
```

---

### 4. Verify Donation
```http
PUT /donations/verify/{donationId}
Content-Type: application/json

{
  "verifiedBy": "admin@charity.org"
}
```

---

### 5. Get Donation Details
```http
GET /donations/{donationId}
```

---

## 🔄 Allocation Endpoints

### 1. Create Allocation
```http
POST /allocations/create
Content-Type: application/json

{
  "allocationId": 1,
  "charityId": 1,
  "allocatedFor": "Medical Supplies",
  "description": "Emergency medical supplies",
  "allocatedAmount": 50,
  "startDate": "2024-01-22T00:00:00Z",
  "endDate": "2024-02-22T00:00:00Z"
}
```

---

### 2. Get Allocations by Charity
```http
GET /allocations/charity/{charityId}
```

---

### 3. Distribute Funds
```http
POST /allocations/distribute/{allocationId}
Content-Type: application/json

{
  "distributedAmount": 20,
  "beneficiaryName": "Hospital XYZ",
  "beneficiaryAmount": 20,
  "purpose": "Medical equipment purchase"
}
```

---

### 4. Get Allocation Details
```http
GET /allocations/{allocationId}
```

---

## 🌐 Smart Contract Methods

### Query Functions (Read-Only)

```javascript
// Get charity info
await contract.methods.getCharity(charityId).call();

// Get donation info
await contract.methods.getDonation(donationId).call();

// Get allocation info
await contract.methods.getAllocation(allocationId).call();

// Get donor info
await contract.methods.getDonor(donorAddress).call();

// Get contract balance
await contract.methods.getContractBalance().call();
```

### Transaction Functions (Write)

```javascript
// Register charity
await contract.methods
  .registerCharity("Name", "Description")
  .send({ from: account });

// Make donation
await contract.methods
  .donate(charityId, "Purpose")
  .send({ from: account, value: web3.utils.toWei("1", "ether") });

// Verify donation
await contract.methods
  .verifyDonation(donationId)
  .send({ from: account });

// Allocate funds
await contract.methods
  .allocateFunds(charityId, "Purpose", amount)
  .send({ from: account });

// Distribute funds
await contract.methods
  .distributeFunds(allocationId, amount)
  .send({ from: account });
```

---

## 🚀 Frontend Integration Examples

### Connect Wallet
```javascript
import { useBlockchain } from './hooks/useBlockchain';

function App() {
  const { account, connectWallet } = useBlockchain();
  
  return (
    <button onClick={connectWallet}>
      {account ? `Connected: ${account.slice(0, 6)}...` : 'Connect'}
    </button>
  );
}
```

### Make Donation (Frontend)
```javascript
import { charityAPI } from './utils/api';
import { useBlockchain } from './hooks/useBlockchain';

function DonationForm() {
  const { web3, account, contract } = useBlockchain();
  
  const handleDonate = async (charityId, amount, purpose) => {
    const amountInWei = web3.utils.toWei(amount, 'ether');
    
    // Send to blockchain
    const receipt = await contract.methods
      .donate(charityId, purpose)
      .send({ from: account, value: amountInWei });
    
    // Record in backend
    await charityAPI.recordDonation({
      donationId: receipt.events.DonationReceived.returnValues.donationId,
      charityId,
      donorWallet: account,
      amount: parseFloat(amount),
      transactionHash: receipt.transactionHash,
      purpose
    });
  };
}
```

### Fetch Charities (Frontend)
```javascript
import { charityAPI } from './utils/api';
import { useEffect, useState } from 'react';

function CharityList() {
  const [charities, setCharities] = useState([]);
  
  useEffect(() => {
    const fetchCharities = async () => {
      const response = await charityAPI.getAllCharities();
      setCharities(response.data.data);
    };
    
    fetchCharities();
  }, []);
  
  return (
    <div>
      {charities.map(charity => (
        <div key={charity._id}>
          <h3>{charity.name}</h3>
          <p>Received: {charity.totalFundsReceived} ETH</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔑 Environment Variables Checklist

### smart-contracts/.env
```env
PRIVATE_KEY=your_private_key_here
INFURA_API_KEY=your_infura_api_key
GANACHE_PORT=7545
```

### backend/.env
```env
MONGODB_URI=mongodb://localhost:27017/charity-tracker
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
```

### frontend/.env
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CONTRACT_ADDRESS=0x...deployed_address...
```

---

## 📊 Data Models

### Donor
```json
{
  "walletAddress": "0x...",
  "name": "John Doe",
  "email": "john@example.com",
  "totalDonated": 100,
  "donationCount": 5,
  "isActive": true
}
```

### Charity
```json
{
  "charityId": 1,
  "name": "Red Cross",
  "description": "Humanitarian aid",
  "walletAddress": "0x...",
  "totalFundsReceived": 500,
  "fundsAllocated": 300,
  "fundsDistributed": 200,
  "isVerified": true
}
```

### Donation
```json
{
  "donationId": 1,
  "charityId": 1,
  "donorWallet": "0x...",
  "amount": 10,
  "transactionHash": "0x...",
  "purpose": "Emergency Relief",
  "isVerified": false
}
```

---

## ⚡ Quick Commands

```bash
# Install everything
npm run install:all

# Start all services
npm run dev:all

# Smart contracts only
cd smart-contracts && npm run ganache
cd smart-contracts && npm run migrate
cd smart-contracts && npm test

# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm start

# Build for production
cd frontend && npm run build
```

---

## 🧪 Testing API with curl

```bash
# Register charity
curl -X POST http://localhost:5000/api/charities/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Charity",
    "description": "A test charity",
    "email": "test@charity.com",
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f42aE5"
  }'

# Get all charities
curl http://localhost:5000/api/charities/all

# Get charity stats
curl http://localhost:5000/api/charities/stats/1
```

---

## 🔗 Important Links

- **Localhost Frontend**: http://localhost:3000
- **Localhost Backend**: http://localhost:5000
- **Ganache RPC**: http://127.0.0.1:7545
- **Etherscan (Mainnet)**: https://etherscan.io
- **Sepolia Testnet**: https://sepolia.etherscan.io

---

## 📞 Common Issues & Solutions

### Issue: MetaMask not connecting
**Solution**: Add Ganache network to MetaMask
- Network: http://127.0.0.1:7545
- Chain ID: 1337

### Issue: MongoDB connection error
**Solution**: Ensure MongoDB is running
```bash
docker run -d -p 27017:27017 mongo
```

### Issue: Contract not found
**Solution**: Update REACT_APP_CONTRACT_ADDRESS in frontend/.env

---

**Last Updated**: January 22, 2026  
**Version**: 1.0.0
