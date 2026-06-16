# Charity Donation Tracker - Architecture

## System Architecture

```
┌─────────────────┐
│   Frontend      │ (React + Web3.js)
│   (Port 3000)   │
└────────┬────────┘
         │
    ┌────┴─────┐
    │           │
    │     HTTP  │ Web3 Events
    ▼           ▼
┌──────────┐  ┌────────────────┐
│ Backend  │  │  Blockchain    │
│ (Node)   │  │  (Ethereum)    │
│ (Port    │  │                │
│  5000)   │  │ • CharityDonation
└────┬─────┘  │   Contract
     │        │ • Events
     │        │ • State
     ▼        └────────────────┘
┌──────────┐
│ MongoDB  │
│(Database)│
└──────────┘
```

## Component Hierarchy

### Frontend Components
- **App** (Root)
  - Navbar (Navigation)
  - Home Page
    - Hero Section
    - WalletConnect
    - CharityList
    - DonationForm
  - Dashboard Page
    - Statistics Display
  - Footer

### Backend Services
- **CharityController** - Charity operations
- **DonationController** - Donation recording/verification
- **AllocationController** - Fund allocation/distribution
- **Models** - Data schemas (MongoDB)
- **Routes** - API endpoints
- **Middleware** - Authentication, validation

### Smart Contracts
- **CharityDonation** - Main contract
  - Charity registration
  - Donation handling
  - Fund allocation
  - Fund distribution

## Data Flow

### Donation Flow
1. User connects MetaMask wallet
2. Frontend sends donation transaction to blockchain
3. Smart contract receives donation
4. Contract emits `DonationReceived` event
5. Frontend listens to event, gets donation ID
6. Frontend records donation in backend (MongoDB)
7. Backend updates charity and donor records

### Fund Allocation Flow
1. Charity owner allocates funds (backend API)
2. Backend creates allocation record in MongoDB
3. Charity can then distribute allocated funds
4. Each distribution updates remaining amount
5. When fully distributed, allocation marked complete

### Verification Flow
1. Admin verifies donation via backend API
2. Backend marks donation as verified
3. Frontend shows verification status
4. Blockchain also maintains verification records

## Database Schema

### Donor
```
{
  walletAddress: String (unique),
  name: String,
  email: String (unique),
  totalDonated: Number,
  donationCount: Number,
  donations: [ObjectId],
  isActive: Boolean
}
```

### Charity
```
{
  charityId: Number (unique),
  name: String,
  description: String,
  walletAddress: String (unique),
  email: String (unique),
  totalFundsReceived: Number,
  fundsAllocated: Number,
  fundsDistributed: Number,
  donations: [ObjectId],
  allocations: [ObjectId],
  isVerified: Boolean
}
```

### Donation
```
{
  donationId: Number (unique),
  charityId: Number,
  donor: ObjectId,
  donorWallet: String,
  amount: Number,
  transactionHash: String,
  purpose: String,
  isVerified: Boolean,
  verifiedBy: String,
  verifiedAt: Date
}
```

### Allocation
```
{
  allocationId: Number (unique),
  charityId: Number,
  allocatedFor: String,
  allocatedAmount: Number,
  distributedAmount: Number,
  remainingAmount: Number,
  beneficiaries: [
    {
      name: String,
      amount: Number,
      date: Date,
      purpose: String
    }
  ],
  isCompleted: Boolean,
  completionPercentage: Number
}
```

## API Request/Response Flow

### Example: Make Donation

```
Frontend
  │
  └─> Blockchain (donation tx)
       │
       ├─> Smart Contract (processes donation)
       │
       └─> Event Emission (DonationReceived)
            │
            └─> Frontend (listens to event)
                 │
                 └─> Backend (POST /donations/record)
                      │
                      ├─> MongoDB (saves donation)
                      ├─> Updates Charity record
                      ├─> Updates Donor record
                      │
                      └─> Response to Frontend
```

## Security Layers

1. **Blockchain Layer**
   - Smart contract modifiers (access control)
   - Immutable transaction records
   - Event verification

2. **Backend Layer**
   - JWT authentication
   - Input validation
   - MongoDB document validation
   - Error handling

3. **Frontend Layer**
   - MetaMask wallet authentication
   - Environment variables for sensitive data
   - HTTPS communication (production)

## State Management

### Frontend Context
- **BlockchainContext** - Web3 connection, account, contract instance

### Backend State
- **Express Sessions** - Request handling
- **MongoDB Collections** - Persistent state

### Blockchain State
- **Smart Contract Storage** - Charity, donation, allocation data

## Deployment Architecture

```
Development:
- Ganache (local blockchain)
- localhost:7545
- MongoDB local
- Backend: localhost:5000
- Frontend: localhost:3000

Production:
- Sepolia/Mainnet (public blockchain)
- MongoDB Atlas (cloud)
- Backend: Cloud provider (Heroku, AWS, etc.)
- Frontend: CDN (Vercel, Netlify, etc.)
```

## Key Technologies

| Layer | Technology |
|-------|-----------|
| Blockchain | Ethereum, Solidity, Web3.js |
| Backend | Node.js, Express, MongoDB |
| Frontend | React, Web3.js, Axios |
| Development | Truffle, Ganache, npm |

## Scalability Considerations

1. **Database Indexing** - Index charityId, walletAddress, transactionHash
2. **Pagination** - Implement for large donation lists
3. **Caching** - Cache charity statistics
4. **Batch Processing** - Process fund distributions in batches
5. **Event Listening** - Use event indexers (The Graph)
