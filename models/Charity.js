const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema(
  {
    charityId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    registrationNumber: {
      type: String,
      unique: true,
    },
    logo: {
      type: String,
    },
    website: {
      type: String,
    },
    totalFundsReceived: {
      type: Number,
      default: 0,
    },
    fundsAllocated: {
      type: Number,
      default: 0,
    },
    fundsDistributed: {
      type: Number,
      default: 0,
    },
    donations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation',
      },
    ],
    allocations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Allocation',
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model('Charity', charitySchema);
