const Charity = require('../models/Charity');
const Donation = require('../models/Donation');
const Allocation = require('../models/Allocation');

// Register a new charity
exports.registerCharity = async (req, res) => {
  try {
    const { name, description, email, walletAddress, registrationNumber } = req.body;

    const existingCharity = await Charity.findOne({
      $or: [{ walletAddress }, { email }],
    });

    if (existingCharity) {
      return res.status(400).json({
        success: false,
        message: 'Charity already registered',
      });
    }

    const latestCharity = await Charity.findOne().sort({ charityId: -1 });
    const charityId = (latestCharity?.charityId || 0) + 1;

    const charity = new Charity({
      charityId,
      name,
      description,
      email,
      walletAddress: walletAddress.toLowerCase(),
      registrationNumber,
    });

    await charity.save();

    res.status(201).json({
      success: true,
      message: 'Charity registered successfully',
      data: charity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all charities
exports.getAllCharities = async (req, res) => {
  try {
    const charities = await Charity.find({ isActive: true }).populate('donations').populate('allocations');

    res.status(200).json({
      success: true,
      count: charities.length,
      data: charities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single charity
exports.getCharityById = async (req, res) => {
  try {
    const { id } = req.params;

    const charity = await Charity.findById(id).populate('donations').populate('allocations');

    if (!charity) {
      return res.status(404).json({
        success: false,
        message: 'Charity not found',
      });
    }

    res.status(200).json({
      success: true,
      data: charity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update charity
exports.updateCharity = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const charity = await Charity.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!charity) {
      return res.status(404).json({
        success: false,
        message: 'Charity not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Charity updated successfully',
      data: charity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get charity statistics
exports.getCharityStats = async (req, res) => {
  try {
    const { charityId } = req.params;

    const charity = await Charity.findOne({ charityId });

    if (!charity) {
      return res.status(404).json({
        success: false,
        message: 'Charity not found',
      });
    }

    const donations = await Donation.find({ charityId });
    const allocations = await Allocation.find({ charityId });

    const stats = {
      charityId: charity.charityId,
      charityName: charity.name,
      totalFundsReceived: charity.totalFundsReceived,
      fundsAllocated: charity.fundsAllocated,
      fundsDistributed: charity.fundsDistributed,
      donationCount: donations.length,
      verifiedDonations: donations.filter((d) => d.isVerified).length,
      allocationCount: allocations.length,
      completedAllocations: allocations.filter((a) => a.isCompleted).length,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
