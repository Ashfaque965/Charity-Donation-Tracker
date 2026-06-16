# Charity Donation Tracker

A blockchain-powered charity donation tracking system built with Ethereum, React, Express, and MongoDB. Ensures transparency and trust in donation verification and fund allocation tracking.

## Features

✅ **Blockchain Integration** - Ethereum smart contracts for immutable donation records  
✅ **Donation Verification** - Verify donations on-chain and off-chain  
✅ **Fund Allocation Tracking** - Track allocated and distributed funds  
✅ **Smart Contract-Based Distribution** - Automated fund distribution  
✅ **Real-time Transparency** - Complete visibility into fund flow  
✅ **Donor Dashboard** - View donation history and impact  
✅ **Charity Management** - Register and manage charities  

## Tech Stack

### Blockchain
- **Ethereum** - Smart contract platform
- **Solidity** - Smart contract language
- **Truffle** - Development framework
- **Ganache** - Local blockchain

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Web3.js** - Ethereum interaction

### Frontend
- **React** - UI library
- **Web3.js** - Blockchain interaction
- **Axios** - HTTP client
- **CSS3** - Styling

## Project Structure

```
Charity Donation Tracker/
├── smart-contracts/          # Ethereum smart contracts
│   ├── contracts/
│   │   ├── Migrations.sol
│   │   └── CharityDonation.sol
│   ├── migrations/
│   ├── test/
│   ├── package.json
│   └── truffle-config.js
├── backend/                  # Express server
│   ├── models/
│   │   ├── User.js
│   │   ├── Donor.js
│   │   ├── Charity.js
│   │   ├── Donation.js
│   │   └── Allocation.js
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── frontend/                 # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Installation & Setup

### 1. Smart Contracts Setup

```bash
cd smart-contracts
npm install

# Configure .env
cp .env.example .env
# Add your PRIVATE_KEY and INFURA_API_KEY

# Compile contracts
npm run compile

# Deploy to local Ganache
npm run migrate

# Run tests
npm test
```

### 2. Backend Setup

```bash
cd ../backend
npm install

# Configure .env
cp .env.example .env
# Add MongoDB connection string

# Start MongoDB
# (Make sure MongoDB is running)

# Start server
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Configure .env
cp .env.example .env
# Add your contract address and backend URL

# Start React app
npm start
```

## Smart Contract Details

### CharityDonation.sol

#### Key Functions

- `registerCharity(name, description)` - Register a new charity
- `donate(charityId, purpose)` - Make a donation
- `verifyDonation(donationId)` - Verify a donation
- `allocateFunds(charityId, allocatedFor, amount)` - Allocate funds
- `distributeFunds(allocationId, amount)` - Distribute allocated funds

#### Key Events

- `CharityRegistered` - New charity registered
- `DonationReceived` - New donation received
- `DonationVerified` - Donation verified
- `FundsAllocated` - Funds allocated
- `FundsDistributed` - Funds distributed

## API Endpoints

### Charities
- `POST /api/charities/register` - Register charity
- `GET /api/charities/all` - Get all charities
- `GET /api/charities/:id` - Get single charity
- `PUT /api/charities/:id` - Update charity
- `GET /api/charities/stats/:charityId` - Get charity statistics

### Donations
- `POST /api/donations/record` - Record donation
- `GET /api/donations/all` - Get all donations
- `GET /api/donations/charity/:charityId` - Get charity donations
- `PUT /api/donations/verify/:donationId` - Verify donation
- `GET /api/donations/:donationId` - Get donation details

### Allocations
- `POST /api/allocations/create` - Create allocation
- `GET /api/allocations/charity/:charityId` - Get allocations
- `POST /api/allocations/distribute/:allocationId` - Distribute funds
- `GET /api/allocations/:allocationId` - Get allocation details

## Configuration Files

### Environment Variables

**smart-contracts/.env**
```
PRIVATE_KEY=your_private_key
INFURA_API_KEY=your_infura_key
GANACHE_PORT=7545
```

**backend/.env**
```
MONGODB_URI=mongodb://localhost:27017/charity-tracker
PORT=5000
NODE_ENV=development
JWT_SECRET=charity-secret-key
```

**frontend/.env**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CONTRACT_ADDRESS=0x...
```

## Running the Application

### Terminal 1: Smart Contracts (Ganache)
```bash
cd smart-contracts
npm run ganache
```

### Terminal 2: Smart Contracts (Migrations)
```bash
cd smart-contracts
npm run migrate:reset
```

### Terminal 3: Backend Server
```bash
cd backend
npm run dev
```

### Terminal 4: Frontend App
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. **Connect Wallet** - Click "Connect Wallet" and approve MetaMask
2. **View Charities** - Browse registered charities
3. **Make Donation** - Select charity, enter amount, and donate
4. **View Dashboard** - Check donation statistics and fund allocation
5. **Verify Donations** - Admin can verify donations on-chain

## Security Considerations

- Smart contracts use modifiers for access control
- Wallet authentication via MetaMask
- MongoDB connection with environment variables
- JWT token validation for API endpoints
- Input validation for all forms

## Testing

### Smart Contracts
```bash
cd smart-contracts
npm test
```

### Backend
```bash
cd backend
npm test
```

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Open a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

## Authors

Charity Blockchain Team

## Acknowledgments

- Ethereum Foundation
- Truffle Team
- OpenZeppelin
