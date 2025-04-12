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
  images: { url: string; caption: string }[];
  marketData: {
    totalShares: number;
    availableShares: number;
    pricePerShare: number;
    marketCap: number;
  };
  performance: {
    dailyChange: number;
    weeklyChange: number;
    monthlyChange: number;
    yearlyChange: number;
  };
}

interface TicketOffer {
  destinationId: string;
  destinationName: string;
  offerType: string;
  description: string;
  price: number;
  validUntil: string;
}

const sampleOffers: TicketOffer[] = [
  {
    destinationId: "1",
    destinationName: "New York City",
    offerType: "City Explorer Pass",
    description: "3-day pass to top NYC attractions including Empire State Building, Statue of Liberty, and more",
    price: 10789.17,
    validUntil: "2024-12-31"
  },
  {
    destinationId: "2",
    destinationName: "Hawaii",
    offerType: "Beach Resort Package",
    description: "5-day stay at luxury beachfront resort with daily activities and spa access",
    price: 74699.17,
    validUntil: "2024-12-31"
  }
];

export default function Market() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/destinations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch destinations: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setDestinations(data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const handleBookTicket = async (offerId: string) => {
    try {
      setBookingStatus(prev => ({ ...prev, [offerId]: 'booking' }));
      
      // Simulate API call for booking
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update booking status
      setBookingStatus(prev => ({ ...prev, [offerId]: 'success' }));
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setBookingStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[offerId];
          return newStatus;
        });
      }, 3000);
    } catch (error) {
      setBookingStatus(prev => ({ ...prev, [offerId]: 'error' }));
    }
  };

  const getButtonText = (offerId: string) => {
    switch (bookingStatus[offerId]) {
      case 'booking':
        return 'Booking...';
      case 'success':
        return 'Booked!';
      case 'error':
        return 'Try Again';
      default:
        return 'Book Now';
    }
  };

  const getButtonStyle = (offerId: string) => {
    switch (bookingStatus[offerId]) {
      case 'booking':
        return 'bg-gray-400 cursor-not-allowed';
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-indigo-600 hover:bg-indigo-700';
    }
  };

  if (loading) return <div className="text-center py-8">Loading market data...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Market Overview</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Market Values</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Share</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {destinations.map((destination) => (
                  <tr key={destination._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 relative flex-shrink-0">
                          <Image
                            src={destination.images[0].url}
                            alt={destination.images[0].caption}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{destination.name}</div>
                          <div className="text-sm text-gray-500">{destination.location.city}, {destination.location.country}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{destination.marketData.pricePerShare.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{destination.marketData.marketCap.toLocaleString('en-IN')}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      destination.performance.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {destination.performance.dailyChange >= 0 ? '+' : ''}{destination.performance.dailyChange}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Special Offers</h2>
          <div className="space-y-4">
            {sampleOffers.map((offer) => (
              <div key={offer.destinationId} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{offer.offerType}</h3>
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-indigo-600">₹{offer.price.toLocaleString('en-IN')}</p>
                      <p className="text-sm text-gray-500">Valid until {new Date(offer.validUntil).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleBookTicket(offer.destinationId)}
                      disabled={bookingStatus[offer.destinationId] === 'booking'}
                      className={`${getButtonStyle(offer.destinationId)} text-white px-4 py-2 rounded transition-colors duration-200`}
                    >
                      {getButtonText(offer.destinationId)}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 