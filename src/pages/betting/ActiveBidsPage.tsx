import React, { useState } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import { BidCard } from '../../components/betting/BidCard';
import { mockActiveBids, Bid } from '../../data/mockBettingData';
import { BIDDING_CONTRACT_ADDRESS } from '../../constants/contractAddresses';
import { BIDDING_ABI } from '../../constants/biddingAbi';

export function ActiveBidsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('volume');

  const categories = ['All', 'Temperature', 'Precipitation', 'Wind', 'Severe Weather'];

  // Fetch all draw IDs from contract
  const { data: allDrawIds = [] } = useReadContract({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'getAllDrawIds',
  });
  console.log('All Draw IDs:', allDrawIds);

  // Fetch draw details for each draw ID
  const drawContracts = allDrawIds.map((drawId: bigint) => ({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'getDraw',
    args: [drawId],
  }));

  const thresholdContracts = allDrawIds.map((drawId: bigint) => ({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'getThresholds',
    args: [drawId],
  }));

  const { data: drawsData = [] } = useReadContracts({
    contracts: drawContracts,
  });

  const { data: thresholdsData = [] } = useReadContracts({
    contracts: thresholdContracts,
  });

  // Transform contract data to Bid format
  const contractBids: Bid[] = allDrawIds.map((drawId: bigint, index: number) => {
    const drawData = drawsData[index]?.result;
    const thresholds = thresholdsData[index]?.result;
    
    if (!drawData || !thresholds) return null;

    const [cityId, endTime, settled, actualTemp, pot] = drawData;
    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = Number(endTime) > now ? 
      formatTimeRemaining(Number(endTime) - now) : 'Ended';
    
    const isActive = Number(endTime) > now && !settled;
    const isExpired = Number(endTime) <= now || settled;

    // Create options from thresholds
    const options = thresholds.map((threshold: bigint) => ({
      range: `${Number(threshold)}°C`,
      percentage: Math.floor(Math.random() * 30) + 10, // Mock percentage for now
      yesPrice: Math.floor(Math.random() * 50) + 25,
      noPrice: Math.floor(Math.random() * 50) + 25,
    }));

    return {
      id: drawId.toString(),
      question: 'Highest temperature in London this week?',
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      options,
      totalVolume: Number(pot) || Math.floor(Math.random() * 1000000),
      frequency: 'Weekly' as const,
      timeRemaining,
      category: 'Temperature',
      location: 'London, UK',
      drawId: Number(drawId),
      endTime: Number(endTime),
      isSettled: settled,
      actualTemp: actualTemp ? Number(actualTemp) : undefined,
      thresholds: thresholds.map((t: bigint) => Number(t)),
    };
  }).filter(Boolean) as Bid[];
  
  // Combine mock and contract bids
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

  // Helper function to format time remaining
  function formatTimeRemaining(seconds: number): string {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

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