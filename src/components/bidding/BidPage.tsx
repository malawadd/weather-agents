import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { useBiddingContract, ThresholdData } from '../../hooks/useBiddingContract';

export function BidPage() {
  const { drawId } = useParams<{ drawId: string }>();
  const { address } = useAccount();
  const { getDrawById, getThresholdData, placeBid } = useBiddingContract();
  
  const [selectedThreshold, setSelectedThreshold] = useState<number | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [thresholdData, setThresholdData] = useState<ThresholdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draw = drawId ? getDrawById(parseInt(drawId)) : null;
  console.log('Draw Data:', draw);

  useEffect(() => {
    if (draw) {
      loadThresholdData();
    }
  }, [draw]);

  const loadThresholdData = async () => {
    if (!draw) return;
    console.log('Draw Data:', draw);
    setLoading(true);
    try {
      const data = await getThresholdData(draw.id);
      setThresholdData(data);
    } catch (err) {
      console.error('Error loading threshold data:', err);
      setError('Failed to load threshold data');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async () => {
    if (!draw || selectedThreshold === null || !bidAmount || !address) return;

    setSubmitting(true);
    setError(null);

    try {
      await placeBid(draw.id, selectedThreshold, bidAmount);
      setBidAmount('');
      setSelectedThreshold(null);
      await loadThresholdData(); // Refresh data
    } catch (err: any) {
      setError(err.message || 'Failed to place bid');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return 'Ended';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatTemperature = (temp: number) => {
    return `${(temp / 1000).toFixed(1)}°C`;
  };

  const getCityName = (cityId: string) => {
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

  if (!draw) {
    return (
      <div className="min-h-screen nb-grid-bg">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="nb-panel-warning p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">❌ Draw Not Found</h2>
            <p className="mb-4">The requested temperature prediction draw could not be found.</p>
            <Link to="/active-bids" className="nb-button-accent px-6 py-3 font-bold">
              ← Back to Active Bids
            </Link>
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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                🌡️ {getCityName(draw.cityId)} Temperature Prediction
              </h1>
              <p className="text-gray-600">Draw #{draw.id}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded font-bold ${
                draw.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : draw.settled 
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {draw.isActive ? '🟢 Active' : draw.settled ? '✅ Settled' : '⏰ Ended'}
              </span>
            </div>
          </div>
        </div>

        {/* Draw Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="nb-panel-success p-6">
            <h3 className="text-xl font-bold mb-3">💰 Prize Pool</h3>
            <p className="text-3xl font-bold">{formatEther(draw.pot)} USDC</p>
          </div>

          <div className="nb-panel-accent p-6">
            <h3 className="text-xl font-bold mb-3">📊 Total Volume</h3>
            <p className="text-3xl font-bold">{formatEther(draw.totalVolume)} Tickets</p>
          </div>

          <div className="nb-panel-warning p-6">
            <h3 className="text-xl font-bold mb-3">
              {draw.isActive ? '⏰ Time Remaining' : draw.settled ? '🌡️ Final Temperature' : '⏳ Status'}
            </h3>
            <p className="text-3xl font-bold">
              {draw.isActive 
                ? formatTimeRemaining(draw.timeRemaining)
                : draw.settled 
                ? formatTemperature(draw.actualTemp)
                : 'Awaiting Settlement'
              }
            </p>
          </div>
        </div>

        {/* Threshold Selection */}
        <div className="nb-panel-white p-6">
          <h3 className="text-2xl font-bold mb-6">🎯 Temperature Thresholds</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="font-bold">Loading threshold data...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {thresholdData.map((threshold) => (
                <div
                  key={threshold.threshold}
                  className={`nb-panel p-4 cursor-pointer transition-all ${
                    selectedThreshold === threshold.threshold 
                      ? 'nb-panel-accent ring-4 ring-blue-500' 
                      : 'hover:nb-panel-success'
                  } ${!draw.isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => draw.isActive && setSelectedThreshold(threshold.threshold)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-bold">
                        Temperature &gt; {formatTemperature(threshold.threshold)}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Bet that the temperature will be above this threshold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{formatEther(threshold.totalShares)} Tickets</p>
                      <p className="text-sm text-gray-600">{threshold.percentage.toFixed(1)}% of total</p>
                      {threshold.userShares > 0 && (
                        <p className="text-sm font-bold text-blue-600">
                          Your stake: {formatEther(threshold.userShares)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bid Placement */}
        {draw.isActive && (
          <div className="nb-panel p-6">
            <h3 className="text-2xl font-bold mb-6">💸 Place Your Bid</h3>
            
            {!address ? (
              <div className="nb-panel-warning p-4 text-center">
                <p className="font-bold">Connect your wallet to place bids</p>
              </div>
            ) : selectedThreshold === null ? (
              <div className="nb-panel-warning p-4 text-center">
                <p className="font-bold">Select a temperature threshold above to place your bid</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="nb-panel-accent p-4">
                  <p className="font-bold">
                    Selected: Temperature &gt; {formatTemperature(selectedThreshold)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Bid Amount (Tickets)</label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter amount in tickets"
                    className="nb-input w-full px-4 py-3 text-lg"
                    min="0"
                    step="0.01"
                  />
                </div>

                {error && (
                  <div className="nb-panel-warning p-4">
                    <p className="font-bold text-red-700">{error}</p>
                  </div>
                )}

                <button
                  onClick={handlePlaceBid}
                  disabled={!bidAmount || submitting}
                  className="w-full nb-button-accent py-4 text-xl font-bold"
                >
                  {submitting ? '⏳ Placing Bid...' : '🎯 Place Bid'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Settlement Info */}
        {draw.settled && (
          <div className="nb-panel-success p-6">
            <h3 className="text-2xl font-bold mb-4">✅ Draw Settled</h3>
            <p className="text-lg mb-4">
              Final temperature: <span className="font-bold">{formatTemperature(draw.actualTemp)}</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Winners can now claim their rewards based on their winning predictions.
            </p>
            <button className="nb-button-accent px-6 py-3 font-bold">
              🏆 Claim Rewards
            </button>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <Link to="/active-bids" className="nb-button px-6 py-3 font-bold">
            ← Back to All Draws
          </Link>
        </div>
      </div>
    </div>
  );
}