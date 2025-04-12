'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Destination {
  _id: string;
  name: string;
  location: {
    country: string;
    city: string;
  };
  description: string;
  images: Array<{ url: string; caption: string }>;
  marketData: {
    pricePerShare: number;
    availableShares: number;
    marketCap: number;
  };
  category: string;
  performance: {
    dailyChange: number;
  };
}

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Beach', 'Mountain', 'City', 'Cultural', 'Adventure', 'Luxury'];

  useEffect(() => {
    fetchDestinations();
  }, [selectedCategory]);

  const fetchDestinations = async () => {
    try {
      const url = selectedCategory === 'all'
        ? 'http://localhost:5000/api/destinations'
        : `http://localhost:5000/api/destinations?category=${selectedCategory}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch destinations');
      }

      setDestinations(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <h3 className="text-lg font-semibold">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Investment Destinations
        </h1>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`${selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                } px-4 py-2 rounded-md text-sm font-medium capitalize`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {destinations.map((destination, index) => (
          <div
            key={destination._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48">
              <Image
                src={destination.images[0]?.url || '/placeholder.jpg'}
                alt={destination.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700">
                {destination.category}
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold text-gray-900">{destination.name}</h2>
                <div className={`${destination.performance.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {destination.performance.dailyChange >= 0 ? '+' : ''}
                  {destination.performance.dailyChange}%
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {destination.location.city}, {destination.location.country}
              </p>
              <p className="text-gray-700 mb-4 line-clamp-2">{destination.description}</p>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">₹{destination.marketData.pricePerShare}</span> / share
                  </div>
                  <div>
                    <span className="font-medium">{destination.marketData.availableShares}</span> shares left
                  </div>
                </div>
                <Link
                  href={`/destinations/${destination._id}`}
                  className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}