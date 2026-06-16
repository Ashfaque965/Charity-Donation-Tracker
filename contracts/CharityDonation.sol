// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CharityDonation
 * @dev Transparent charity donation contract with fund allocation tracking
 */
contract CharityDonation {
    
    struct Donor {
        address donorAddress;
        uint totalDonated;
        uint donationCount;
        bool isActive;
    }
    
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
    
    struct Donation {
        uint donationId;
        uint charityId;
        address donor;
        uint amount;
        uint timestamp;
        string purpose;
        bool verified;
    }
    
    struct FundAllocation {
        uint allocationId;
        uint charityId;
        string allocatedFor;
        uint allocatedAmount;
        uint distributedAmount;
        uint timestamp;
        bool isCompleted;
    }
    
    // State variables
    mapping(address => Donor) public donors;
    mapping(uint => Charity) public charities;
    mapping(uint => Donation) public donations;
    mapping(uint => FundAllocation) public allocations;
    
    address public owner;
    uint public charityCounter;
    uint public donationCounter;
    uint public allocationCounter;
    uint public totalDonationsReceived;
    uint public totalFundsDistributed;
    
    // Events
    event CharityRegistered(uint indexed charityId, address indexed charityOwner, string charityName);
    event DonationReceived(uint indexed donationId, uint indexed charityId, address indexed donor, uint amount);
    event FundsAllocated(uint indexed allocationId, uint indexed charityId, uint amount, string allocatedFor);
    event FundsDistributed(uint indexed allocationId, uint indexed charityId, uint amount);
    event DonationVerified(uint indexed donationId, address indexed verifier);
    event CharityUpdated(uint indexed charityId, uint fundsAllocated, uint fundsDistributed);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier charityExists(uint _charityId) {
        require(charities[_charityId].isActive, "Charity does not exist");
        _;
    }
    
    modifier onlyCharityOwner(uint _charityId) {
        require(charities[_charityId].charityOwner == msg.sender, "Only charity owner can call this");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        charityCounter = 0;
        donationCounter = 0;
        allocationCounter = 0;
    }
    
    // Register a new charity
    function registerCharity(
        string memory _charityName,
        string memory _description
    ) public {
        require(bytes(_charityName).length > 0, "Charity name cannot be empty");
        
        charityCounter++;
        charities[charityCounter] = Charity(
            charityCounter,
            msg.sender,
            _charityName,
            _description,
            0,
            0,
            0,
            true,
            block.timestamp
        );
        
        emit CharityRegistered(charityCounter, msg.sender, _charityName);
    }
    
    // Receive donations
    function donate(uint _charityId, string memory _purpose) public payable charityExists(_charityId) {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        donationCounter++;
        Charity storage charity = charities[_charityId];
        charity.totalFundsReceived += msg.value;
        
        donations[donationCounter] = Donation(
            donationCounter,
            _charityId,
            msg.sender,
            msg.value,
            block.timestamp,
            _purpose,
            false
        );
        
        // Update donor record
        if (!donors[msg.sender].isActive) {
            donors[msg.sender] = Donor(msg.sender, msg.value, 1, true);
        } else {
            donors[msg.sender].totalDonated += msg.value;
            donors[msg.sender].donationCount++;
        }
        
        totalDonationsReceived += msg.value;
        
        emit DonationReceived(donationCounter, _charityId, msg.sender, msg.value);
    }
    
    // Verify donation
    function verifyDonation(uint _donationId) public onlyOwner {
        require(donations[_donationId].amount > 0, "Donation does not exist");
        donations[_donationId].verified = true;
        emit DonationVerified(_donationId, msg.sender);
    }
    
    // Allocate funds for specific purpose
    function allocateFunds(
        uint _charityId,
        string memory _allocatedFor,
        uint _amount
    ) public onlyCharityOwner(_charityId) charityExists(_charityId) {
        Charity storage charity = charities[_charityId];
        require(
            charity.totalFundsReceived - charity.fundsAllocated >= _amount,
            "Insufficient funds to allocate"
        );
        
        allocationCounter++;
        charity.fundsAllocated += _amount;
        
        allocations[allocationCounter] = FundAllocation(
            allocationCounter,
            _charityId,
            _allocatedFor,
            _amount,
            0,
            block.timestamp,
            false
        );
        
        emit FundsAllocated(allocationCounter, _charityId, _amount, _allocatedFor);
    }
    
    // Distribute allocated funds
    function distributeFunds(
        uint _allocationId,
        uint _amount
    ) public {
        FundAllocation storage allocation = allocations[_allocationId];
        require(allocation.allocatedAmount > 0, "Allocation does not exist");
        require(
            allocation.distributedAmount + _amount <= allocation.allocatedAmount,
            "Cannot distribute more than allocated"
        );
        
        Charity storage charity = charities[allocation.charityId];
        require(
            msg.sender == charity.charityOwner,
            "Only charity owner can distribute funds"
        );
        
        allocation.distributedAmount += _amount;
        charity.fundsDistributed += _amount;
        totalFundsDistributed += _amount;
        
        if (allocation.distributedAmount == allocation.allocatedAmount) {
            allocation.isCompleted = true;
        }
        
        // Transfer funds
        payable(msg.sender).transfer(_amount);
        
        emit FundsDistributed(_allocationId, allocation.charityId, _amount);
    }
    
    // Get charity details
    function getCharity(uint _charityId) public view charityExists(_charityId) returns (Charity memory) {
        return charities[_charityId];
    }
    
    // Get donation details
    function getDonation(uint _donationId) public view returns (Donation memory) {
        require(donations[_donationId].amount > 0, "Donation does not exist");
        return donations[_donationId];
    }
    
    // Get allocation details
    function getAllocation(uint _allocationId) public view returns (FundAllocation memory) {
        require(allocations[_allocationId].allocatedAmount > 0, "Allocation does not exist");
        return allocations[_allocationId];
    }
    
    // Get donor details
    function getDonor(address _donorAddress) public view returns (Donor memory) {
        return donors[_donorAddress];
    }
    
    // Get contract balance
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }
    
    // Deactivate charity
    function deactivateCharity(uint _charityId) public onlyCharityOwner(_charityId) {
        charities[_charityId].isActive = false;
    }
}
