const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

// Record donation
router.post('/record', donationController.recordDonation);

// Get all donations
router.get('/all', donationController.getAllDonations);

// Get donations by charity
router.get('/charity/:charityId', donationController.getDonationsByCharity);

// Verify donation
router.put('/verify/:donationId', donationController.verifyDonation);

// Get donation details
router.get('/:donationId', donationController.getDonationDetails);

module.exports = router;
