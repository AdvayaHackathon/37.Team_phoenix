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
      marketCap: 4150000 
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
      marketCap: 3984000 
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
      marketCap: 4980000 
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
      marketCap: 4482000 
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
      marketCap: 5021500 
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
      marketCap: 5125250 
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
      marketCap: 4938500 
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
      marketCap: 6640000 
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
      marketCap: 4482000 
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
      marketCap: 7470000 
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
  },
  {
    name: "Great Barrier Reef",
    location: { 
      country: "Australia", 
      city: "Cairns",
      coordinates: { latitude: -16.9203, longitude: 145.7709 }
    },
    description: "World's largest coral reef system with diverse marine life.",
    images: [{ url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80", caption: "Great Barrier Reef" }],
    marketData: { 
      totalShares: 800, 
      availableShares: 600, 
      pricePerShare: 85, 
      marketCap: 68000 
    },
    category: "Adventure",
    performance: { 
      dailyChange: 0.7,
      weeklyChange: 2.9,
      monthlyChange: 6.8,
      yearlyChange: 14.5
    },
    features: ["Snorkeling", "Diving", "Marine life"],
    status: "Active"
  },
  {
    name: "Petra",
    location: { 
      country: "Jordan", 
      city: "Petra",
      coordinates: { latitude: 30.3285, longitude: 35.4444 }
    },
    description: "Ancient rock-cut architecture and archaeological wonders.",
    images: [{ url: "https://images.unsplash.com/photo-1621996659490-3275b4d0d951?auto=format&fit=crop&w=800&q=80", caption: "Petra Treasury" }],
    marketData: { 
      totalShares: 750, 
      availableShares: 550, 
      pricePerShare: 70, 
      marketCap: 52500 
    },
    category: "Cultural",
    performance: { 
      dailyChange: 0.6,
      weeklyChange: 2.4,
      monthlyChange: 5.8,
      yearlyChange: 13.0
    },
    features: ["Rock-cut architecture", "Archaeological sites", "Desert landscape"],
    status: "Active"
  },
  {
    name: "Rio de Janeiro",
    location: { 
      country: "Brazil", 
      city: "Rio de Janeiro",
      coordinates: { latitude: -22.9068, longitude: -43.1729 }
    },
    description: "Vibrant city with beautiful beaches and iconic landmarks.",
    images: [{ url: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80", caption: "Rio de Janeiro" }],
    marketData: { 
      totalShares: 950, 
      availableShares: 750, 
      pricePerShare: 65, 
      marketCap: 61750 
    },
    category: "City",
    performance: { 
      dailyChange: 0.8,
      weeklyChange: 3.1,
      monthlyChange: 7.2,
      yearlyChange: 15.5
    },
    features: ["Christ the Redeemer", "Copacabana Beach", "Carnival"],
    status: "Active"
  },
  {
    name: "Kyoto Temples",
    location: { 
      country: "Japan", 
      city: "Kyoto",
      coordinates: { latitude: 35.0116, longitude: 135.7681 }
    },
    description: "Traditional Japanese culture with numerous classical Buddhist temples.",
    images: [{ url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80", caption: "Kyoto Temple" }],
    marketData: { 
      totalShares: 850, 
      availableShares: 650, 
      pricePerShare: 75, 
      marketCap: 63750 
    },
    category: "Cultural",
    performance: { 
      dailyChange: 0.7,
      weeklyChange: 2.8,
      monthlyChange: 6.5,
      yearlyChange: 14.0
    },
    features: ["Buddhist temples", "Japanese gardens", "Tea ceremonies"],
    status: "Active"
  },
  {
    name: "Safari Adventure",
    location: { 
      country: "South Africa", 
      city: "Kruger National Park",
      coordinates: { latitude: -24.3671, longitude: 31.4913 }
    },
    description: "Wildlife viewing in stunning African landscapes.",
    images: [{ url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80", caption: "African Safari" }],
    marketData: { 
      totalShares: 700, 
      availableShares: 500, 
      pricePerShare: 90, 
      marketCap: 63000 
    },
    category: "Adventure",
    performance: { 
      dailyChange: 0.9,
      weeklyChange: 3.5,
      monthlyChange: 8.0,
      yearlyChange: 16.5
    },
    features: ["Wildlife viewing", "Luxury lodges", "Guided tours"],
    status: "Active"
  },
  {
    name: "Northern Lights",
    location: { 
      country: "Iceland", 
      city: "Reykjavik",
      coordinates: { latitude: 64.1265, longitude: -21.8174 }
    },
    description: "Spectacular natural light show in the Arctic sky.",
    images: [{ url: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=800&q=80", caption: "Northern Lights" }],
    marketData: { 
      totalShares: 800, 
      availableShares: 600, 
      pricePerShare: 80, 
      marketCap: 64000 
    },
    category: "Adventure",
    performance: { 
      dailyChange: 0.8,
      weeklyChange: 3.2,
      monthlyChange: 7.5,
      yearlyChange: 15.5
    },
    features: ["Aurora viewing", "Hot springs", "Glacier tours"],
    status: "Active"
  },
  {
    name: "Marrakech",
    location: { 
      country: "Morocco", 
      city: "Marrakech",
      coordinates: { latitude: 31.6295, longitude: -7.9811 }
    },
    description: "Vibrant markets and stunning architecture in the heart of Morocco.",
    images: [{ url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80", caption: "Marrakech Market" }],
    marketData: { 
      totalShares: 900, 
      availableShares: 700, 
      pricePerShare: 70, 
      marketCap: 63000 
    },
    category: "Cultural",
    performance: { 
      dailyChange: 0.6,
      weeklyChange: 2.5,
      monthlyChange: 6.0,
      yearlyChange: 13.5
    },
    features: ["Souks", "Palaces", "Desert tours"],
    status: "Active"
  },
  {
    name: "Hawaii",
    location: { 
      country: "USA", 
      city: "Honolulu",
      coordinates: { latitude: 21.3069, longitude: -157.8583 }
    },
    description: "Tropical paradise with beautiful beaches, volcanoes, and rich culture.",
    images: [{ url: "https://images.unsplash.com/photo-1542259009477-d625e55577f3?auto=format&fit=crop&w=800&q=80", caption: "Hawaii Beach" }],
    marketData: { 
      totalShares: 1000, 
      availableShares: 800, 
      pricePerShare: 85, 
      marketCap: 85000 
    },
    category: "Beach",
    performance: { 
      dailyChange: 0.9,
      weeklyChange: 3.5,
      monthlyChange: 8.2,
      yearlyChange: 16.8
    },
    features: ["Beaches", "Volcanoes", "Luau shows"],
    status: "Active"
  },
  {
    name: "Cappadocia",
    location: { 
      country: "Turkey", 
      city: "Cappadocia",
      coordinates: { latitude: 38.6431, longitude: 34.8283 }
    },
    description: "Unique landscape with fairy chimneys and hot air balloon rides.",
    images: [{ url: "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?auto=format&fit=crop&w=800&q=80", caption: "Cappadocia Balloons" }],
    marketData: { 
      totalShares: 850, 
      availableShares: 650, 
      pricePerShare: 65, 
      marketCap: 55250 
    },
    category: "Adventure",
    performance: { 
      dailyChange: 0.8,
      weeklyChange: 3.1,
      monthlyChange: 7.2,
      yearlyChange: 15.0
    },
    features: ["Hot air balloons", "Cave dwellings", "Rock formations"],
    status: "Active"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourism-stock');
    console.log('Connected to MongoDB');

    // Clear existing destinations
    await Destination.deleteMany({});
    console.log('Cleared existing destinations');

    // Insert new destinations
    await Destination.insertMany(sampleDestinations);
    console.log('Added sample destinations');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 