import React, { useState } from 'react';
import { useReadContract } from 'wagmi';
import { BidCard } from '../../components/betting/BidCard';
import { mockActiveBids, Bid } from '../../data/mockBettingData';
import { BIDDING_CONTRACT_ADDRESS } from '../../constants/contractAddresses';
import { BIDDING_ABI } from '../../constants/biddingAbi';

export function ActiveBidsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('volume');
  const [contractBids, setContractBids] = useState<Bid[]>([]);

  const categories = ['All', 'Temperature', 'Precipitation', 'Wind', 'Severe Weather'];

  // Fetch contract draws (checking first 10 draw IDs for demo)
  const drawIds = Array.from({ length: 10 }, (_, i) => i);
  
  // For demo, we'll use mock data but in a real implementation you'd fetch from contract
  // This is a placeholder for the contract integration
  const allBids = [...mockActiveBids, ...contractBids];
  
  const filteredBids = allBids.filter(bid => 
    selectedCategory === 'All' || bid.category === selectedCategory
  );

  const sortedBids = [...filteredBids].sort((a, b) => {
    switch (sortBy) {
      case 'volume':
        return b.totalVolume - a.totalVolume;
      case 'time':
        return a.timeRemaining.localeCompare(b.timeRemaining);
      case 'activity':
        return b.options.length - a.options.length;
      default:
        return 0;
    }
  });

  return (
    <div className="w-full px-4 space-y-6">
      {/* Header */}
      <div className="nb-betting-panel-white p-6">
        <h1 className="text-3xl font-bold mb-2">🎲 Active Weather Bets</h1>
        <p className="text-gray-600">
          Place your bets on weather outcomes and compete with other weather enthusiasts worldwide.
        </p>
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 nb-betting-panel-accent p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold">Category:</span>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="nb-betting-input px-3 py-1 text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="nb-betting-input px-3 py-1 text-sm"
              >
                <option value="volume">Volume</option>
                <option value="time">Time Remaining</option>
                <option value="activity">Activity</option>
              </select>
            </div>
          </div>
        </div>

        <div className="nb-betting-panel-success p-4">
          <div className="text-center">
            <p className="font-bold text-sm">TOTAL MARKETS</p>
            <p className="text-2xl font-bold">{filteredBids.length}</p>
          </div>
        </div>
      </div>

      {/* Active Bids Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedBids.map((bid) => (
          <BidCard key={bid.id} bid={bid} />
        ))}
      </div>

      {/* Empty State */}
      {filteredBids.length === 0 && (
        <div className="nb-betting-panel p-8 text-center">
          <h3 className="text-xl font-bold mb-2">No bets found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or check back later for new betting opportunities.
          </p>
          <button 
            onClick={() => setSelectedCategory('All')}
            className="nb-betting-button-accent px-6 py-3 font-bold"
          >
            Show All Bets
          </button>
        </div>
      )}

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="nb-betting-panel-white p-6 text-center">
          <h3 className="font-bold text-lg mb-2">💰 Total Volume</h3>
          <p className="text-2xl font-bold text-green-600">
            ${allBids.reduce((sum, bid) => sum + bid.totalVolume, 0).toLocaleString()}
          </p>
        </div>
        <div className="nb-betting-panel-white p-6 text-center">
          <h3 className="font-bold text-lg mb-2">⏰ Active Markets</h3>
          <p className="text-2xl font-bold text-blue-600">{allBids.length}</p>
        </div>
        <div className="nb-betting-panel-white p-6 text-center">
          <h3 className="font-bold text-lg mb-2">🏆 Top Category</h3>
          <p className="text-2xl font-bold text-purple-600">Temperature</p>
        </div>
      </div>
    </div>
  );
}