const mongoose = require('mongoose');
const Destination = require('./models/Destination');
require('dotenv').config();

const sampleDestinations = [
  {
    name: "Eiffel Tower",
    location: { 
      country: "France", 
      city: "Paris",
      coordinates: { latitude: 48.8584, longitude: 2.2945 }
    },
    description: "Iconic symbol of France, offering stunning views of Paris.",
    images: [{ url: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80", caption: "Eiffel Tower" }],
    marketData: { 
      totalShares: 1000, 
      availableShares: 800, 
      pricePerShare: 4150, 
      marketCap: 4150000,
      currency: "₹"
    },
    category: "City",
    performance: { 
      dailyChange: 0.5,
      weeklyChange: 2.1,
      monthlyChange: 5.3,
      yearlyChange: 12.8
    },
    features: ["Observation deck", "Restaurants", "Light show"],
    status: "Active"
  },
  {
    name: "Great Wall of China",
    location: { 
      country: "China", 
      city: "Beijing",
      coordinates: { latitude: 40.4319, longitude: 116.5704 }
    },
    description: "Ancient series of walls and fortifications spanning thousands of miles.",
    images: [{ url: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80", caption: "Great Wall" }],
    marketData: { 
      totalShares: 1200, 
      availableShares: 900, 
      pricePerShare: 3320, 
      marketCap: 3984000,
      currency: "₹"
    },
    category: "Cultural",
    performance: { 
      dailyChange: 0.3,
      weeklyChange: 1.8,
      monthlyChange: 4.2,
      yearlyChange: 10.5
    },
    features: ["Historical significance", "Hiking trails", "Watchtowers"],
    status: "Active"
  },
  {
    name: "Maldives Paradise",
    location: { 
      country: "Maldives", 
      city: "Male",
      coordinates: { latitude: 4.1755, longitude: 73.5093 }
    },
    description: "Tropical paradise with crystal clear waters and overwater bungalows.",
    images: [{ url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80", caption: "Maldives Resort" }],
    marketData: { 
      totalShares: 800, 
      availableShares: 600, 
      pricePerShare: 6225, 
      marketCap: 4980000,
      currency: "₹"
    },
    category: "Beach",
    performance: { 
      dailyChange: 0.8,
      weeklyChange: 3.2,
      monthlyChange: 7.5,
      yearlyChange: 15.3
    },
    features: ["Overwater bungalows", "Coral reefs", "Spa services"],
    status: "Active"
  },
  {
    name: "Machu Picchu",
    location: { 
      country: "Peru", 
      city: "Cusco",
      coordinates: { latitude: -13.1631, longitude: -72.5450 }
    },
    description: "Ancient Incan citadel set high in the Andes Mountains.",
    images: [{ url: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80", caption: "Machu Picchu" }],
    marketData: { 
      totalShares: 900, 
      availableShares: 700, 
      pricePerShare: 4980, 
      marketCap: 4482000,
      currency: "₹"
    },
    category: "Cultural",
    performance: { 
      dailyChange: 0.6,
      weeklyChange: 2.5,
      monthlyChange: 6.1,
      yearlyChange: 13.7
    },
    features: ["Ancient ruins", "Mountain views", "Hiking trails"],
    status: "Active"
  },
  {
    name: "Tokyo Skyline",
    location: { 
      country: "Japan", 
      city: "Tokyo",
      coordinates: { latitude: 35.6762, longitude: 139.6503 }
    },
    description: "Futuristic metropolis with a blend of traditional and modern culture.",
    images: [{ url: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80", caption: "Tokyo Cityscape" }],
    marketData: { 
      totalShares: 1100, 
      availableShares: 850, 
      pricePerShare: 4565, 
      marketCap: 5021500,
      currency: "₹"
    },
    category: "City",
    performance: { 
      dailyChange: 0.7,
      weeklyChange: 2.8,
      monthlyChange: 6.5,
      yearlyChange: 14.2
    },
    features: ["Shopping districts", "Temples", "Food culture"],
    status: "Active"
  },
  {
    name: "Swiss Alps",
    location: { 
      country: "Switzerland", 
      city: "Zermatt",
      coordinates: { latitude: 46.0207, longitude: 7.7491 }
    },
    description: "Majestic mountain range with world-class skiing and hiking.",
    images: [{ url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80", caption: "Swiss Alps" }],
    marketData: { 
      totalShares: 950, 
      availableShares: 750, 
      pricePerShare: 5395, 
      marketCap: 5125250,
      currency: "₹"
    },
    category: "Mountain",
    performance: { 
      dailyChange: 0.4,
      weeklyChange: 2.0,
      monthlyChange: 5.0,
      yearlyChange: 11.5
    },
    features: ["Skiing", "Hiking", "Scenic trains"],
    status: "Active"
  },
  {
    name: "Santorini",
    location: { 
      country: "Greece", 
      city: "Oia",
      coordinates: { latitude: 36.4614, longitude: 25.3760 }
    },
    description: "Stunning white architecture and breathtaking sunsets in the Aegean Sea.",
    images: [{ url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80", caption: "Santorini" }],
    marketData: { 
      totalShares: 850, 
      availableShares: 650, 
      pricePerShare: 5810, 
      marketCap: 4938500,
      currency: "₹"
    },
    category: "Luxury",
    performance: { 
      dailyChange: 0.9,
      weeklyChange: 3.5,
      monthlyChange: 8.0,
      yearlyChange: 16.5
    },
    features: ["White buildings", "Sunsets", "Wine tasting"],
    status: "Active"
  },
  {
    name: "Dubai Skyline",
    location: { 
      country: "UAE", 
      city: "Dubai",
      coordinates: { latitude: 25.2048, longitude: 55.2708 }
    },
    description: "Futuristic city with iconic architecture and luxury shopping.",
    images: [{ url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80", caption: "Dubai Skyline" }],
    marketData: { 
      totalShares: 1000, 
      availableShares: 800, 
      pricePerShare: 6640, 
      marketCap: 6640000,
      currency: "₹"
    },
    category: "City",
    performance: { 
      dailyChange: 1.0,
      weeklyChange: 3.8,
      monthlyChange: 8.5,
      yearlyChange: 17.2
    },
    features: ["Burj Khalifa", "Shopping malls", "Desert safaris"],
    status: "Active"
  },
  {
    name: "Venice Canals",
    location: { 
      country: "Italy", 
      city: "Venice",
      coordinates: { latitude: 45.4408, longitude: 12.3155 }
    },
    description: "Historic city built on water with beautiful architecture and gondola rides.",
    images: [{ url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80", caption: "Venice Canals" }],
    marketData: { 
      totalShares: 900, 
      availableShares: 700, 
      pricePerShare: 4980, 
      marketCap: 4482000,
      currency: "₹"
    },
    category: "Cultural",
    performance: { 
      dailyChange: 0.5,
      weeklyChange: 2.2,
      monthlyChange: 5.5,
      yearlyChange: 12.5
    },
    features: ["Gondola rides", "Historic buildings", "Art galleries"],
    status: "Active"
  },
  {
    name: "New York City",
    location: { 
      country: "USA", 
      city: "New York",
      coordinates: { latitude: 40.7128, longitude: -74.0060 }
    },
    description: "The city that never sleeps, with iconic landmarks and diverse culture.",
    images: [{ url: "https://images.unsplash.com/photo-1538970272646-f61fabb3a8a2?auto=format&fit=crop&w=800&q=80", caption: "NYC Skyline" }],
    marketData: { 
      totalShares: 1200, 
      availableShares: 950, 
      pricePerShare: 6225, 
      marketCap: 7470000,
      currency: "₹"
    },
    category: "City",
    performance: { 
      dailyChange: 0.8,
      weeklyChange: 3.0,
      monthlyChange: 7.0,
      yearlyChange: 15.0
    },
    features: ["Broadway shows", "Central Park", "Museums"],
    status: "Active"
  }
];

async function reseedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourism-stock', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

   
    await Destination.deleteMany({});
    console.log('Cleared existing destinations');

   
    await Destination.insertMany(sampleDestinations);
    console.log('Inserted new destinations');

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error reseeding database:', error);
    process.exit(1);
  }
}

reseedDatabase(); 