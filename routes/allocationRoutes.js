const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocationController');

// Create allocation
router.post('/create', allocationController.createAllocation);

// Get allocations by charity
router.get('/charity/:charityId', allocationController.getAllocationsByCharity);

// Distribute funds
router.post('/distribute/:allocationId', allocationController.distributeFunds);

// Get allocation details
router.get('/:allocationId', allocationController.getAllocationDetails);

module.exports = router;
