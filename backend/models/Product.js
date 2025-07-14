const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    default: ''
  },
  productCode: {
    type: String,
    required: true,
    unique: true,
    index: true  // ✅ Ensures fast lookups when scanning QR
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  recyclable: {
    type: Boolean,
    default: false
  },
  sustainabilityScore: {
    type: Number,
    default: 0
  },
  recyclabilityStatus: {
    type: String,
    default: ''
  },
  ethicalSourcing: {
    type: String,
    default: ''
  },
  qrCodeUrl: {
    type: String,
    default: ''
  },
  carbonFootprint: {
    rawMaterial: {
      type: Number,
      default: 0
    },
    manufacturing: {
      type: Number,
      default: 0
    },
    transportation: {
      type: Number,
      default: 0
    },
    usage: {
      type: Number,
      default: 0
    },
    endOfLife: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  certifications: {
    type: [String],
    default: []
  },
  dateAdded: {
    type: String
  }
});

module.exports = mongoose.model('Product', productSchema);
