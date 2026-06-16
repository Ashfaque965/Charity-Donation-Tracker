const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema(
  {
    allocationId: {
      type: Number,
      required: true,
      unique: true,
    },
    charityId: {
      type: Number,
      required: true,
    },
    charity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Charity',
    },
    allocatedFor: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    allocatedAmount: {
      type: Number,
      required: true,
    },
    distributedAmount: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    beneficiaries: [
      {
        name: String,
        amount: Number,
        date: Date,
        purpose: String,
      },
    ],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completionPercentage: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Allocation', allocationSchema);
