const express = require('express');
const router = express.Router();
const charityController = require('../controllers/charityController');

// Register charity
router.post('/register', charityController.registerCharity);

// Get all charities
router.get('/all', charityController.getAllCharities);

// Get single charity
router.get('/:id', charityController.getCharityById);

// Update charity
router.put('/:id', charityController.updateCharity);

// Get charity statistics
router.get('/stats/:charityId', charityController.getCharityStats);

module.exports = router;
