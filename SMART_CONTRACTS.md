# Charity Donation Tracker - Smart Contracts Guide

## CharityDonation.sol Overview

### Contract Purpose
Manages transparent charity donations and fund allocation on Ethereum blockchain.

### Key Data Structures

#### Donor
```solidity
struct Donor {
    address donorAddress;
    uint totalDonated;
    uint donationCount;
    bool isActive;
}
```

#### Charity
```solidity
struct Charity {
    uint charityId;
    address charityOwner;
    string charityName;
    string description;
    uint totalFundsReceived;
    uint fundsAllocated;
    uint fundsDistributed;
    bool isActive;
    uint createdAt;
}
```

#### Donation
```solidity
struct Donation {
    uint donationId;
    uint charityId;
    address donor;
    uint amount;
    uint timestamp;
    string purpose;
    bool verified;
}
```

#### FundAllocation
```solidity
struct FundAllocation {
    uint allocationId;
    uint charityId;
    string allocatedFor;
    uint allocatedAmount;
    uint distributedAmount;
    uint timestamp;
    bool isCompleted;
}
```

## Functions

### Charity Management

#### registerCharity
```solidity
function registerCharity(
    string memory _charityName,
    string memory _description
) public
```
- Registers a new charity
- Emits `CharityRegistered` event

**Parameters:**
- `_charityName` - Name of the charity
- `_description` - Charity description

**Reverts:**
- If charity name is empty

---

### Donation Functions

#### donate
```solidity
function donate(
    uint _charityId,
    string memory _purpose
) public payable
```
- Records a donation to a charity
- Updates charity and donor records
- Emits `DonationReceived` event

**Parameters:**
- `_charityId` - ID of the target charity
- `_purpose` - Purpose of donation

**Reverts:**
- If charity doesn't exist
- If donation amount is 0

---

#### verifyDonation
```solidity
function verifyDonation(uint _donationId) public onlyOwner
```
- Owner verifies a donation
- Marks donation as verified
- Emits `DonationVerified` event

**Access:** Owner only

---

### Fund Allocation

#### allocateFunds
```solidity
function allocateFunds(
    uint _charityId,
    string memory _allocatedFor,
    uint _amount
) public onlyCharityOwner(_charityId)
```
- Charity owner allocates funds for specific purpose
- Checks sufficient funds available
- Emits `FundsAllocated` event

**Parameters:**
- `_charityId` - Target charity ID
- `_allocatedFor` - Allocation purpose
- `_amount` - Amount to allocate

**Reverts:**
- If caller is not charity owner
- If insufficient funds

---

#### distributeFunds
```solidity
function distributeFunds(
    uint _allocationId,
    uint _amount
) public
```
- Charity owner distributes allocated funds
- Transfers funds to owner
- Updates remaining amount
- Marks allocation complete when fully distributed
- Emits `FundsDistributed` event

**Parameters:**
- `_allocationId` - Allocation to distribute from
- `_amount` - Amount to distribute

**Reverts:**
- If trying to distribute more than allocated
- If caller is not charity owner

---

### Query Functions

#### getCharity
```solidity
function getCharity(uint _charityId) 
    public view returns (Charity memory)
```
- Returns complete charity information

---

#### getDonation
```solidity
function getDonation(uint _donationId) 
    public view returns (Donation memory)
```
- Returns donation details

---

#### getAllocation
```solidity
function getAllocation(uint _allocationId) 
    public view returns (FundAllocation memory)
```
- Returns allocation details

---

#### getDonor
```solidity
function getDonor(address _donorAddress) 
    public view returns (Donor memory)
```
- Returns donor information

---

#### getContractBalance
```solidity
function getContractBalance() public view returns (uint)
```
- Returns total funds held in contract

---

### Admin Functions

#### deactivateCharity
```solidity
function deactivateCharity(uint _charityId) 
    public onlyCharityOwner(_charityId)
```
- Charity owner deactivates charity
- Prevents further donations

---

## Events

### CharityRegistered
```solidity
event CharityRegistered(
    uint indexed charityId,
    address indexed charityOwner,
    string charityName
);
```

### DonationReceived
```solidity
event DonationReceived(
    uint indexed donationId,
    uint indexed charityId,
    address indexed donor,
    uint amount
);
```

### DonationVerified
```solidity
event DonationVerified(
    uint indexed donationId,
    address indexed verifier
);
```

### FundsAllocated
```solidity
event FundsAllocated(
    uint indexed allocationId,
    uint indexed charityId,
    uint amount,
    string allocatedFor
);
```

### FundsDistributed
```solidity
event FundsDistributed(
    uint indexed allocationId,
    uint indexed charityId,
    uint amount
);
```

---

## Modifiers

### onlyOwner
- Restricts function to contract owner

### charityExists
- Validates charity exists and is active

### onlyCharityOwner
- Restricts to specific charity owner

---

## Usage Example

### Register Charity
```solidity
charityDonation.registerCharity(
    "Red Cross",
    "International humanitarian organization"
);
```

### Make Donation
```solidity
charityDonation.donate{value: web3.utils.toWei("1", "ether")}(
    1,
    "Emergency Relief Fund"
);
```

### Allocate Funds
```solidity
charityDonation.allocateFunds(
    1,
    "Medical Supplies",
    web3.utils.toWei("5", "ether")
);
```

### Distribute Funds
```solidity
charityDonation.distributeFunds(
    1,
    web3.utils.toWei("2", "ether")
);
```

---

## Gas Optimization Tips

1. **Batch Operations** - Group multiple updates
2. **Storage** - Use mappings for frequently accessed data
3. **Loop Limits** - Avoid unbounded loops
4. **Efficient Comparisons** - Use optimal comparison operators

---

## Security Considerations

1. **Access Control** - Modifiers restrict sensitive operations
2. **Reentrancy** - Uses simple transfer pattern
3. **Overflow/Underflow** - Solidity ^0.8.0 has built-in checks
4. **Input Validation** - Validates all inputs

---

## Testing

Run test suite:
```bash
cd smart-contracts
npm test
```

Test cases cover:
- Charity registration
- Donation handling
- Fund allocation
- Fund distribution
- Error conditions
