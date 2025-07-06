import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useReadContract } from 'wagmi';
import { mockBidDetails } from '../../data/mockBettingData';
import { BidDetailsSection } from '../../components/betting/BidDetailsSection';
import { PlaceBetPanel } from '../../components/betting/PlaceBetPanel';
import { ClaimWinningsPanel } from '../../components/betting/ClaimWinningsPanel';
import { BidRulesSection } from '../../components/betting/BidRulesSection';
import { BIDDING_CONTRACT_ADDRESS } from '../../constants/contractAddresses';
import { BIDDING_ABI } from '../../constants/biddingAbi';

export function BidDetailPage() {
  const { bidId } = useParams<{ bidId: string }>();
  const [selectedThreshold, setSelectedThreshold] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const bid = bidId ? mockBidDetails[bidId] : null;
  
  // Try to fetch from contract if it's a numeric ID
  const isContractBid = bidId && !isNaN(Number(bidId));
  const drawId = isContractBid ? Number(bidId) : null;
  
  // Fetch contract draw data
  const { data: drawData } = useReadContract({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'draws',
    args: drawId !== null ? [BigInt(drawId)] : undefined,
  });
  
  const { data: thresholds = [] } = useReadContract({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'getThresholds',
    args: drawId !== null ? [BigInt(drawId)] : undefined,
  });

  const handleBetPlaced = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleClaimed = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!bid) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="nb-betting-panel-warning p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Bet Not Found</h2>
          <p className="mb-4">The betting market you're looking for doesn't exist or has ended.</p>
          <Link to="/weather-betting" className="nb-betting-button-accent px-6 py-3 font-bold">
            ← Back to Active Bets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <Link to="/weather-betting" className="hover:underline font-bold">Active Bets</Link>
        <span>→</span>
        <span className="text-gray-600">{bid.question}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <BidDetailsSection bid={bid} />
          <BidRulesSection bid={bid} />
        </div>

        {/* Trading Panel */}
        <div className="lg:col-span-1">
          {isContractBid && drawId !== null ? (
            <div className="space-y-6">
              <PlaceBetPanel
                drawId={drawId}
                selectedThreshold={selectedThreshold}
                thresholds={thresholds.map(t => Number(t))}
                onBetPlaced={handleBetPlaced}
              />
              <ClaimWinningsPanel
                drawId={drawId}
                isDrawSettled={drawData?.[2] || false}
                actualTemp={drawData?.[3] ? Number(drawData[3]) : undefined}
                onClaimed={handleClaimed}
              />
            </div>
          ) : (
            <div className="nb-betting-panel-white p-6">
              <h3 className="text-xl font-bold mb-4">🚧 Demo Mode</h3>
              <p className="text-gray-600">
                This is a demo bid. Real betting functionality is available for contract-based bids.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Bets */}
      <div className="nb-betting-panel-white p-6">
        <h2 className="text-xl font-bold mb-4">🔗 Related Weather Bets</h2>
        {isContractBid && thresholds.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold mb-2">🌡️ Temperature Options</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {thresholds.map((threshold, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedThreshold(Number(threshold))}
                  className={`p-3 font-bold text-sm ${
                    selectedThreshold === Number(threshold)
                      ? 'nb-betting-button-success'
                      : 'nb-betting-button'
                  }`}
                >
                  {Number(threshold)}°C
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(mockBidDetails)
            .filter(relatedBid => relatedBid.id !== bid.id && relatedBid.category === bid.category)
            .slice(0, 3)
            .map(relatedBid => (
              <Link 
                key={relatedBid.id} 
                to={`/weather-betting/bid/${relatedBid.id}`}
                className="nb-betting-panel p-4 hover:nb-betting-panel-accent transition-all"
              >
                <h3 className="font-bold text-sm mb-2">{relatedBid.question}</h3>
                <p className="text-xs text-gray-600">{relatedBid.location}</p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}