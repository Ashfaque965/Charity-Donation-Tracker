const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donationId: {
      type: Number,
      required: true,
      unique: true,
    },
    charityId: {
      type: Number,
      required: true,
    },
    charityName: {
      type: String,
      required: true,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
      required: true,
    },
    donorWallet: {
      type: String,
      required: true,
      lowercase: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'ETH',
    },
    transactionHash: {
      type: String,
      unique: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: String,
    },
    verifiedAt: {
      type: Date,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    blockchainTimestamp: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
