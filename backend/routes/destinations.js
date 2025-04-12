const express = require('express');
const Destination = require('../models/Destination');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user's portfolio
router.get('/portfolio', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('portfolio.destination');
    const portfolioItems = await Promise.all(
      user.portfolio.map(async (item) => {
        const destination = await Destination.findById(item.destination);
        return {
          _id: destination._id,
          name: destination.name,
          location: destination.location,
          images: destination.images,
          marketData: destination.marketData,
          performance: destination.performance,
          sharesOwned: item.shares
        };
      })
    );
    res.json(portfolioItems);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const { category, status, sort = 'createdAt' } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;

    const destinations = await Destination.find(query)
      .sort(sort)
      .limit(parseInt(req.query.limit) || 10)
      .skip(parseInt(req.query.skip) || 0);

    res.json(destinations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get destination by ID
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(destination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create new destination (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const destination = new Destination(req.body);
    await destination.save();
    res.status(201).json(destination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update destination (admin only)
router.patch('/:id', auth, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    Object.keys(req.body).forEach(update => {
      destination[update] = req.body[update];
    });

    await destination.save();
    res.json(destination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Invest in destination
router.post('/:id/invest', auth, async (req, res) => {
  try {
    const { shares } = req.body;
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    if (shares > destination.marketData.availableShares) {
      return res.status(400).json({ message: 'Not enough shares available' });
    }

    const investmentAmount = shares * destination.marketData.pricePerShare;
    
    if (req.user.balance < investmentAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Update user's portfolio and balance
    req.user.portfolio.push({
      destination: destination._id,
      investmentAmount,
      shares
    });
    req.user.balance -= investmentAmount;

    // Update destination's available shares
    destination.marketData.availableShares -= shares;

    await Promise.all([
      req.user.save(),
      destination.save()
    ]);

    res.json({
      message: 'Investment successful',
      investment: {
        shares,
        amount: investmentAmount
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get destination performance metrics
router.get('/:id/performance', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json(destination.performance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 