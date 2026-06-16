const Allocation = require('../models/Allocation');
const Charity = require('../models/Charity');

// Create fund allocation
exports.createAllocation = async (req, res) => {
  try {
    const {
      allocationId,
      charityId,
      allocatedFor,
      description,
      allocatedAmount,
      startDate,
      endDate,
    } = req.body;

    const charity = await Charity.findOne({ charityId });

    if (!charity) {
      return res.status(404).json({
        success: false,
        message: 'Charity not found',
      });
    }

    const allocation = new Allocation({
      allocationId,
      charityId,
      charity: charity._id,
      allocatedFor,
      description,
      allocatedAmount,
      remainingAmount: allocatedAmount,
      startDate,
      endDate,
    });

    await allocation.save();

    // Update charity allocated funds
    await Charity.findOneAndUpdate(
      { charityId },
      { $inc: { fundsAllocated: allocatedAmount }, $push: { allocations: allocation._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Allocation created successfully',
      data: allocation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get allocations by charity
exports.getAllocationsByCharity = async (req, res) => {
  try {
    const { charityId } = req.params;

    const allocations = await Allocation.find({ charityId }).populate('charity');

    res.status(200).json({
      success: true,
      count: allocations.length,
      data: allocations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Distribute funds
exports.distributeFunds = async (req, res) => {
  try {
    const { allocationId } = req.params;
    const {
      distributedAmount,
      beneficiaryName,
      beneficiaryAmount,
      purpose,
    } = req.body;

    const allocation = await Allocation.findById(allocationId);

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: 'Allocation not found',
      });
    }

    if (
      allocation.distributedAmount + distributedAmount >
      allocation.allocatedAmount
    ) {
      return res.status(400).json({
        success: false,
        message: 'Cannot distribute more than allocated amount',
      });
    }

    // Add beneficiary
    allocation.beneficiaries.push({
      name: beneficiaryName,
      amount: beneficiaryAmount,
      date: new Date(),
      purpose,
    });

    allocation.distributedAmount += distributedAmount;
    allocation.remainingAmount = allocation.allocatedAmount - allocation.distributedAmount;
    allocation.completionPercentage = Math.round(
      (allocation.distributedAmount / allocation.allocatedAmount) * 100
    );

    if (allocation.distributedAmount === allocation.allocatedAmount) {
      allocation.isCompleted = true;
    }

    await allocation.save();

    // Update charity distributed funds
    await Charity.findOneAndUpdate(
      { charityId: allocation.charityId },
      { $inc: { fundsDistributed: distributedAmount } }
    );

    res.status(200).json({
      success: true,
      message: 'Funds distributed successfully',
      data: allocation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get allocation details
exports.getAllocationDetails = async (req, res) => {
  try {
    const { allocationId } = req.params;

    const allocation = await Allocation.findById(allocationId).populate('charity');

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: 'Allocation not found',
      });
    }

    res.status(200).json({
      success: true,
      data: allocation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
