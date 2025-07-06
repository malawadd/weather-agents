import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBiddingContract, DrawData } from '../../hooks/useBiddingContract';
import { formatEther } from 'viem';

export function ActiveBidsPage() {
  const { draws, loading, error, refetch } = useBiddingContract();
  const [filter, setFilter] = useState<'all' | 'active' | 'settled'>('all');

  const filteredDraws = draws.filter(draw => {
    switch (filter) {
      case 'active':
        return draw.isActive;
      case 'settled':
        return draw.settled;
      default:
        return true;
    }
  });

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return 'Ended';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatTemperature = (temp: number) => {
    return `${(temp / 1000).toFixed(1)}°C`;
  };

  const getCityName = (cityId: string) => {
    // Convert bytes32 back to string
    try {
      const hex = cityId.replace('0x', '');
      const bytes = [];
      for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
      }
      return new TextDecoder().decode(new Uint8Array(bytes)).replace(/\0/g, '');
    } catch {
      return 'Unknown City';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen nb-grid-bg">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="nb-panel p-8 text-center">
            <p className="text-xl font-bold">🔄 Loading active bids from contract...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen nb-grid-bg">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="nb-panel-warning p-8 text-center">
            <p className="text-xl font-bold mb-4">⚠️ Error Loading Contract Data</p>
            <p className="mb-4">{error}</p>
            <button onClick={refetch} className="nb-button-accent px-6 py-3 font-bold">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen nb-grid-bg">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="nb-panel-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">🎯 Temperature Prediction Markets</h1>
              <p className="text-gray-600">
                Predict temperature outcomes and win rewards from the prize pool
              </p>
            </div>
            <div className="flex gap-4">
              <button onClick={refetch} className="nb-button px-4 py-2 font-bold">
                🔄 Refresh
              </button>
              <Link to="/create-bid" className="nb-button-accent px-6 py-3 font-bold">
                ➕ Create New Draw
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="nb-panel p-4">
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Draws', count: draws.length },
              { key: 'active', label: 'Active', count: draws.filter(d => d.isActive).length },
              { key: 'settled', label: 'Settled', count: draws.filter(d => d.settled).length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 font-bold text-sm ${
                  filter === key ? 'nb-panel-accent' : 'nb-button'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Draws Grid */}
        {filteredDraws.length === 0 ? (
          <div className="nb-panel p-8 text-center">
            <h3 className="text-xl font-bold mb-4">📭 No Draws Found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'active' 
                ? 'No active temperature prediction draws at the moment.'
                : filter === 'settled'
                ? 'No settled draws found.'
                : 'No draws have been created yet.'
              }
            </p>
            <Link to="/create-bid" className="nb-button-accent px-6 py-3 font-bold">
              🎯 Create First Draw
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDraws.map((draw) => (
              <div key={draw.id} className="nb-panel-white p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{getCityName(draw.cityId)}</h3>
                    <p className="text-sm text-gray-600">Draw #{draw.id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    draw.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : draw.settled 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {draw.isActive ? '🟢 Active' : draw.settled ? '✅ Settled' : '⏰ Ended'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="nb-panel p-3">
                    <p className="text-sm font-bold">💰 Prize Pool</p>
                    <p className="text-xl font-bold">{formatEther(draw.pot)} USDC</p>
                  </div>

                  <div className="nb-panel p-3">
                    <p className="text-sm font-bold">📊 Total Volume</p>
                    <p className="text-lg font-bold">{formatEther(draw.totalVolume)} Tickets</p>
                  </div>

                  <div className="nb-panel p-3">
                    <p className="text-sm font-bold">🌡️ Temperature Ranges</p>
                    <p className="text-sm">
                      {draw.thresholds.length} threshold{draw.thresholds.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {draw.isActive ? (
                    <div className="nb-panel-success p-3">
                      <p className="text-sm font-bold">⏰ Time Remaining</p>
                      <p className="text-lg font-bold">{formatTimeRemaining(draw.timeRemaining)}</p>
                    </div>
                  ) : draw.settled ? (
                    <div className="nb-panel-accent p-3">
                      <p className="text-sm font-bold">🌡️ Final Temperature</p>
                      <p className="text-lg font-bold">{formatTemperature(draw.actualTemp)}</p>
                    </div>
                  ) : (
                    <div className="nb-panel-warning p-3">
                      <p className="text-sm font-bold">⏳ Awaiting Settlement</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t-4 border-black">
                  <Link
                    to={`/bid/${draw.id}`}
                    className="w-full nb-button-accent py-2 font-bold text-center block"
                  >
                    {draw.isActive ? '🎯 Place Bid' : '📊 View Details'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        <div className="nb-panel-accent p-6">
          <h3 className="text-xl font-bold mb-4">📈 Market Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="nb-panel-white p-4 text-center">
              <p className="text-2xl font-bold">{draws.length}</p>
              <p className="text-sm font-bold">Total Draws</p>
            </div>
            <div className="nb-panel-white p-4 text-center">
              <p className="text-2xl font-bold">{draws.filter(d => d.isActive).length}</p>
              <p className="text-sm font-bold">Active Draws</p>
            </div>
            <div className="nb-panel-white p-4 text-center">
              <p className="text-2xl font-bold">
                {formatEther(draws.reduce((sum, draw) => sum + draw.pot, BigInt(0)))}
              </p>
              <p className="text-sm font-bold">Total Prize Pool</p>
            </div>
            <div className="nb-panel-white p-4 text-center">
              <p className="text-2xl font-bold">
                {formatEther(draws.reduce((sum, draw) => sum + draw.totalVolume, BigInt(0)))}
              </p>
              <p className="text-sm font-bold">Total Volume</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}