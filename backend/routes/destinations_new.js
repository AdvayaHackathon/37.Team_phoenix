const express = require('express');
const Destination = require('../models/Destination');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

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

// Initialize destinations with sample data
const initializeDestinations = async () => {
  try {
    const count = await Destination.countDocuments();
    if (count === 0) {
      const newDestinations = [
        {
          name: "Bali, Indonesia",
          location: {
            country: "Indonesia",
            city: "Bali"
          },
          description: "Tropical paradise with beautiful beaches, rich culture, and stunning landscapes.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
              caption: "Beautiful Bali beach"
            }
          ],
          marketData: {
            pricePerShare: 100,
            availableShares: 1000,
            marketCap: 100000
          },
          category: "Beach",
          performance: {
            dailyChange: 2.5,
            weeklyChange: 5.8,
            monthlyChange: 12.3,
            yearlyChange: 25.6
          },
          features: ["Beaches", "Culture", "Temples", "Rice Terraces"],
          status: "Active"
        },
        {
          name: "Paris, France",
          location: {
            country: "France",
            city: "Paris"
          },
          description: "The City of Light, known for its art, fashion, gastronomy and culture.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
              caption: "Eiffel Tower at sunset"
            }
          ],
          marketData: {
            pricePerShare: 150,
            availableShares: 800,
            marketCap: 120000
          },
          category: "City",
          performance: {
            dailyChange: 1.8,
            weeklyChange: 4.2,
            monthlyChange: 9.5,
            yearlyChange: 18.7
          },
          features: ["Landmarks", "Museums", "Shopping", "Cuisine"],
          status: "Active"
        },
        {
          name: "Tokyo, Japan",
          location: {
            country: "Japan",
            city: "Tokyo"
          },
          description: "A fascinating blend of the ultramodern and traditional.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1542051841857-5f90071e7989",
              caption: "Tokyo cityscape"
            }
          ],
          marketData: {
            pricePerShare: 200,
            availableShares: 600,
            marketCap: 120000
          },
          category: "City",
          performance: {
            dailyChange: 3.2,
            weeklyChange: 7.5,
            monthlyChange: 15.8,
            yearlyChange: 28.4
          },
          features: ["Technology", "Culture", "Food", "Shopping"],
          status: "Active"
        },
        {
          name: "New York City, USA",
          location: {
            country: "USA",
            city: "New York"
          },
          description: "The city that never sleeps, a global center for business and culture.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1496442226666-8d4fd0e7e62c",
              caption: "Manhattan skyline"
            }
          ],
          marketData: {
            pricePerShare: 180,
            availableShares: 700,
            marketCap: 126000
          },
          category: "City",
          performance: {
            dailyChange: 2.1,
            weeklyChange: 5.3,
            monthlyChange: 11.2,
            yearlyChange: 22.5
          },
          features: ["Skyscrapers", "Museums", "Shopping", "Entertainment"],
          status: "Active"
        },
        {
          name: "Santorini, Greece",
          location: {
            country: "Greece",
            city: "Santorini"
          },
          description: "Stunning white architecture and breathtaking sunsets.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
              caption: "Santorini white buildings"
            }
          ],
          marketData: {
            pricePerShare: 120,
            availableShares: 900,
            marketCap: 108000
          },
          category: "Island",
          performance: {
            dailyChange: 2.8,
            weeklyChange: 6.5,
            monthlyChange: 13.7,
            yearlyChange: 26.3
          },
          features: ["Sunsets", "Beaches", "Wine", "Architecture"],
          status: "Active"
        },
        {
          name: "Dubai, UAE",
          location: {
            country: "UAE",
            city: "Dubai"
          },
          description: "A futuristic city in the desert with iconic architecture.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
              caption: "Dubai skyline"
            }
          ],
          marketData: {
            pricePerShare: 160,
            availableShares: 750,
            marketCap: 120000
          },
          category: "City",
          performance: {
            dailyChange: 2.3,
            weeklyChange: 5.6,
            monthlyChange: 12.1,
            yearlyChange: 24.8
          },
          features: ["Shopping", "Architecture", "Desert", "Luxury"],
          status: "Active"
        },
        {
          name: "Maldives",
          location: {
            country: "Maldives",
            city: "Male"
          },
          description: "Crystal clear waters and overwater bungalows in paradise.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
              caption: "Maldives overwater bungalow"
            }
          ],
          marketData: {
            pricePerShare: 250,
            availableShares: 500,
            marketCap: 125000
          },
          category: "Beach",
          performance: {
            dailyChange: 3.5,
            weeklyChange: 8.2,
            monthlyChange: 16.5,
            yearlyChange: 30.2
          },
          features: ["Beaches", "Diving", "Luxury", "Romance"],
          status: "Active"
        },
        {
          name: "Venice, Italy",
          location: {
            country: "Italy",
            city: "Venice"
          },
          description: "Historic canals and stunning architecture in the floating city.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
              caption: "Venice canals"
            }
          ],
          marketData: {
            pricePerShare: 140,
            availableShares: 850,
            marketCap: 119000
          },
          category: "City",
          performance: {
            dailyChange: 1.9,
            weeklyChange: 4.8,
            monthlyChange: 10.5,
            yearlyChange: 20.7
          },
          features: ["Canals", "History", "Art", "Gondolas"],
          status: "Active"
        },
        {
          name: "Machu Picchu, Peru",
          location: {
            country: "Peru",
            city: "Cusco"
          },
          description: "Ancient Incan citadel set high in the Andes Mountains.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1526392060635-9d61d2356f1f",
              caption: "Machu Picchu ruins"
            }
          ],
          marketData: {
            pricePerShare: 130,
            availableShares: 950,
            marketCap: 123500
          },
          category: "Historical",
          performance: {
            dailyChange: 2.2,
            weeklyChange: 5.4,
            monthlyChange: 11.8,
            yearlyChange: 23.6
          },
          features: ["History", "Hiking", "Culture", "Archaeology"],
          status: "Active"
        },
        {
          name: "Sydney, Australia",
          location: {
            country: "Australia",
            city: "Sydney"
          },
          description: "Vibrant harbor city with iconic Opera House and Harbour Bridge.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
              caption: "Sydney Opera House"
            }
          ],
          marketData: {
            pricePerShare: 170,
            availableShares: 800,
            marketCap: 136000
          },
          category: "City",
          performance: {
            dailyChange: 2.4,
            weeklyChange: 5.9,
            monthlyChange: 12.7,
            yearlyChange: 25.1
          },
          features: ["Harbor", "Beaches", "Culture", "Food"],
          status: "Active"
        },
        {
          name: "Swiss Alps",
          location: {
            country: "Switzerland",
            city: "Zermatt"
          },
          description: "Majestic mountains and world-class skiing destinations.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7",
              caption: "Swiss Alps mountains"
            }
          ],
          marketData: {
            pricePerShare: 220,
            availableShares: 600,
            marketCap: 132000
          },
          category: "Mountain",
          performance: {
            dailyChange: 2.9,
            weeklyChange: 6.8,
            monthlyChange: 14.2,
            yearlyChange: 27.5
          },
          features: ["Skiing", "Hiking", "Scenery", "Luxury"],
          status: "Active"
        },
        {
          name: "Amsterdam, Netherlands",
          location: {
            country: "Netherlands",
            city: "Amsterdam"
          },
          description: "Historic canals, beautiful architecture, and vibrant culture.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017",
              caption: "Amsterdam canals"
            }
          ],
          marketData: {
            pricePerShare: 150,
            availableShares: 850,
            marketCap: 127500
          },
          category: "City",
          performance: {
            dailyChange: 2.0,
            weeklyChange: 5.0,
            monthlyChange: 10.8,
            yearlyChange: 21.5
          },
          features: ["Canals", "Museums", "Cycling", "Culture"],
          status: "Active"
        },
        {
          name: "Great Barrier Reef, Australia",
          location: {
            country: "Australia",
            city: "Cairns"
          },
          description: "World's largest coral reef system with diverse marine life.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1549965174-6184e3be2d0f",
              caption: "Great Barrier Reef coral"
            }
          ],
          marketData: {
            pricePerShare: 190,
            availableShares: 700,
            marketCap: 133000
          },
          category: "Nature",
          performance: {
            dailyChange: 2.6,
            weeklyChange: 6.2,
            monthlyChange: 13.1,
            yearlyChange: 25.8
          },
          features: ["Diving", "Snorkeling", "Marine Life", "Islands"],
          status: "Active"
        },
        {
          name: "Petra, Jordan",
          location: {
            country: "Jordan",
            city: "Petra"
          },
          description: "Ancient rock-cut architecture and archaeological wonders.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1544735716-392fe2480c44",
              caption: "Petra Treasury"
            }
          ],
          marketData: {
            pricePerShare: 140,
            availableShares: 900,
            marketCap: 126000
          },
          category: "Historical",
          performance: {
            dailyChange: 1.7,
            weeklyChange: 4.5,
            monthlyChange: 9.8,
            yearlyChange: 19.6
          },
          features: ["History", "Archaeology", "Hiking", "Culture"],
          status: "Active"
        },
        {
          name: "Rio de Janeiro, Brazil",
          location: {
            country: "Brazil",
            city: "Rio de Janeiro"
          },
          description: "Vibrant city with beautiful beaches and iconic landmarks.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325",
              caption: "Rio de Janeiro Christ the Redeemer"
            }
          ],
          marketData: {
            pricePerShare: 160,
            availableShares: 800,
            marketCap: 128000
          },
          category: "City",
          performance: {
            dailyChange: 2.3,
            weeklyChange: 5.7,
            monthlyChange: 12.4,
            yearlyChange: 24.9
          },
          features: ["Beaches", "Landmarks", "Culture", "Nightlife"],
          status: "Active"
        },
        {
          name: "Kyoto, Japan",
          location: {
            country: "Japan",
            city: "Kyoto"
          },
          description: "Traditional Japanese culture with numerous classical Buddhist temples.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
              caption: "Kyoto temple"
            }
          ],
          marketData: {
            pricePerShare: 180,
            availableShares: 750,
            marketCap: 135000
          },
          category: "Cultural",
          performance: {
            dailyChange: 2.4,
            weeklyChange: 5.9,
            monthlyChange: 12.6,
            yearlyChange: 25.2
          },
          features: ["Temples", "Gardens", "Culture", "History"],
          status: "Active"
        },
        {
          name: "Safari, South Africa",
          location: {
            country: "South Africa",
            city: "Kruger National Park"
          },
          description: "Wildlife viewing in stunning African landscapes.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
              caption: "African safari"
            }
          ],
          marketData: {
            pricePerShare: 200,
            availableShares: 650,
            marketCap: 130000
          },
          category: "Nature",
          performance: {
            dailyChange: 2.7,
            weeklyChange: 6.5,
            monthlyChange: 13.8,
            yearlyChange: 26.9
          },
          features: ["Wildlife", "Nature", "Adventure", "Photography"],
          status: "Active"
        },
        {
          name: "Northern Lights, Iceland",
          location: {
            country: "Iceland",
            city: "Reykjavik"
          },
          description: "Spectacular natural light show in the Arctic sky.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73",
              caption: "Northern Lights"
            }
          ],
          marketData: {
            pricePerShare: 170,
            availableShares: 780,
            marketCap: 132600
          },
          category: "Nature",
          performance: {
            dailyChange: 2.5,
            weeklyChange: 6.0,
            monthlyChange: 12.9,
            yearlyChange: 25.4
          },
          features: ["Aurora", "Nature", "Hot Springs", "Glaciers"],
          status: "Active"
        },
        {
          name: "Marrakech, Morocco",
          location: {
            country: "Morocco",
            city: "Marrakech"
          },
          description: "Vibrant markets and stunning architecture in the heart of Morocco.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2",
              caption: "Marrakech market"
            }
          ],
          marketData: {
            pricePerShare: 130,
            availableShares: 920,
            marketCap: 119600
          },
          category: "Cultural",
          performance: {
            dailyChange: 1.9,
            weeklyChange: 4.7,
            monthlyChange: 10.2,
            yearlyChange: 20.5
          },
          features: ["Markets", "Architecture", "Culture", "Food"],
          status: "Active"
        },
        {
          name: "Hawaii, USA",
          location: {
            country: "USA",
            city: "Maui"
          },
          description: "Tropical paradise with stunning beaches and volcanic landscapes.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1544185310-0b3cf308587b",
              caption: "Hawaiian beach"
            }
          ],
          marketData: {
            pricePerShare: 190,
            availableShares: 710,
            marketCap: 134900
          },
          category: "Beach",
          performance: {
            dailyChange: 2.6,
            weeklyChange: 6.3,
            monthlyChange: 13.4,
            yearlyChange: 26.1
          },
          features: ["Beaches", "Volcanoes", "Culture", "Nature"],
          status: "Active"
        },
        {
          name: "Cappadocia, Turkey",
          location: {
            country: "Turkey",
            city: "Cappadocia"
          },
          description: "Unique landscape with fairy chimneys and hot air balloon rides.",
          images: [
            {
              url: "https://images.unsplash.com/photo-1516738901174-8fabf0dea015",
              caption: "Cappadocia balloons"
            }
          ],
          marketData: {
            pricePerShare: 150,
            availableShares: 830,
            marketCap: 124500
          },
          category: "Adventure",
          performance: {
            dailyChange: 2.1,
            weeklyChange: 5.2,
            monthlyChange: 11.3,
            yearlyChange: 22.7
          },
          features: ["Balloons", "History", "Landscapes", "Adventure"],
          status: "Active"
        }
      ];

      await Destination.insertMany(newDestinations);
      console.log('Sample destinations initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing destinations:', error);
  }
};

// Call the initialization function
initializeDestinations();

module.exports = router; 