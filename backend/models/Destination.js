const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    country: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    caption: String
  }],
  marketData: {
    totalShares: {
      type: Number,
      required: true
    },
    availableShares: {
      type: Number,
      required: true
    },
    pricePerShare: {
      type: Number,
      required: true
    },
    marketCap: {
      type: Number,
      required: true
    }
  },
  performance: {
    dailyChange: Number,
    weeklyChange: Number,
    monthlyChange: Number,
    yearlyChange: Number
  },
  features: [String],
  category: {
    type: String,
    enum: ['Beach', 'Mountain', 'City', 'Cultural', 'Adventure', 'Luxury'],
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Coming Soon', 'Closed'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
destinationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;