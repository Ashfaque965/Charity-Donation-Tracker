const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const Charity = require('../models/Charity');

// Create donation record
exports.recordDonation = async (req, res) => {
  try {
    const {
      donationId,
      charityId,
      donorWallet,
      charityName,
      amount,
      transactionHash,
      purpose,
    } = req.body;

    const donor = await Donor.findOne({ walletAddress: donorWallet });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found',
      });
    }

    const donation = new Donation({
      donationId,
      charityId,
      donor: donor._id,
      donorWallet: donorWallet.toLowerCase(),
      charityName,
      amount,
      transactionHash,
      purpose,
    });

    await donation.save();

    // Update charity total funds
    await Charity.findOneAndUpdate(
      { charityId },
      { $inc: { totalFundsReceived: amount } }
    );

    // Update donor records
    await Donor.findOneAndUpdate(
      { walletAddress: donorWallet },
      {
        $inc: { totalDonated: amount, donationCount: 1 },
        $push: { donations: donation._id },
      }
    );

    res.status(201).json({
      success: true,
      message: 'Donation recorded successfully',
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all donations
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate('donor');

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get donations by charity
exports.getDonationsByCharity = async (req, res) => {
  try {
    const { charityId } = req.params;

    const donations = await Donation.find({ charityId }).populate('donor');

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify donation
exports.verifyDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { verifiedBy } = req.body;

    const donation = await Donation.findByIdAndUpdate(
      donationId,
      {
        isVerified: true,
        verifiedBy,
        verifiedAt: new Date(),
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Donation verified successfully',
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get donation details
exports.getDonationDetails = async (req, res) => {
  try {
    const { donationId } = req.params;

    const donation = await Donation.findById(donationId).populate('donor');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
