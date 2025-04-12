'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
    weeklyChange: number;
    monthlyChange: number;
    yearlyChange: number;
  };
  features: string[];
  status: string;
}

export default function DestinationDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shares, setShares] = useState(1);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/destinations/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch destination: ${response.statusText}`);
        }
        
        const data = await response.json();
        setDestination(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load destination');
        console.error('Error fetching destination:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDestination();
    }
  }, [id]);

  const handleInvest = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to invest');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/destinations/${id}/invest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ shares })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Investment failed');
      }

      // Update the destination data to reflect the new share count
      if (destination) {
        setDestination({
          ...destination,
          marketData: {
            ...destination.marketData,
            availableShares: destination.marketData.availableShares - shares
          }
        });
      }

      alert('Investment successful!');
    } catch (err: any) {
      setError(err.message || 'Investment failed');
      console.error('Error investing:', err);
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
          <Link href="/destinations" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Destination Not Found</h3>
          <Link href="/destinations" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/destinations" className="text-indigo-600 hover:text-indigo-800 mb-6 inline-block">
        ← Back to Destinations
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <Image
            src={destination.images[0]?.url || '/placeholder.jpg'}
            alt={destination.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            {destination.category}
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{destination.name}</h1>
              <p className="text-gray-600 mt-1">
                {destination.location.city}, {destination.location.country}
              </p>
            </div>
            <div className={`${destination.performance.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'} font-medium text-xl`}>
              {destination.performance.dailyChange >= 0 ? '+' : ''}
              {destination.performance.dailyChange}%
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900">Description</h2>
            <p className="mt-2 text-gray-700">{destination.description}</p>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Market Data</h2>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Price per Share</p>
                  <p className="text-lg font-semibold">${destination.marketData.pricePerShare}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Available Shares</p>
                  <p className="text-lg font-semibold">{destination.marketData.availableShares}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Market Cap</p>
                  <p className="text-lg font-semibold">${destination.marketData.marketCap.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-lg font-semibold">{destination.status}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Performance</h2>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Daily Change</p>
                  <p className={`text-lg font-semibold ${destination.performance.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {destination.performance.dailyChange >= 0 ? '+' : ''}{destination.performance.dailyChange}%
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Weekly Change</p>
                  <p className={`text-lg font-semibold ${destination.performance.weeklyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {destination.performance.weeklyChange >= 0 ? '+' : ''}{destination.performance.weeklyChange}%
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Monthly Change</p>
                  <p className={`text-lg font-semibold ${destination.performance.monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {destination.performance.monthlyChange >= 0 ? '+' : ''}{destination.performance.monthlyChange}%
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Yearly Change</p>
                  <p className={`text-lg font-semibold ${destination.performance.yearlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {destination.performance.yearlyChange >= 0 ? '+' : ''}{destination.performance.yearlyChange}%
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {destination.features && destination.features.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Features</h2>
              <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {destination.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Invest in {destination.name}</h2>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="w-full md:w-auto">
                <label htmlFor="shares" className="block text-sm font-medium text-gray-700">Number of Shares</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="shares"
                    id="shares"
                    min="1"
                    max={destination.marketData.availableShares}
                    value={shares}
                    onChange={(e) => setShares(Math.max(1, Math.min(parseInt(e.target.value) || 1, destination.marketData.availableShares)))}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Available: {destination.marketData.availableShares} shares
                </p>
              </div>
              <div className="w-full md:w-auto">
                <p className="text-lg font-semibold">
                  Total: ${(shares * destination.marketData.pricePerShare).toFixed(2)}
                </p>
              </div>
              <button
                onClick={handleInvest}
                disabled={shares > destination.marketData.availableShares}
                className="w-full md:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Invest Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 