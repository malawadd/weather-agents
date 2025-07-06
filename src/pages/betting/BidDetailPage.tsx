import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { BidDetailsSection } from '../../components/betting/BidDetailsSection';
import { PlaceBetPanel } from '../../components/betting/PlaceBetPanel';
import { ClaimWinningsPanel } from '../../components/betting/ClaimWinningsPanel';
import { BidRulesSection } from '../../components/betting/BidRulesSection';
import { BIDDING_CONTRACT_ADDRESS } from '../../constants/contractAddresses';
import { BIDDING_ABI } from '../../constants/biddingAbi';
import { BidDetail } from '../../data/mockBettingData';

export function BidDetailPage() {
  const { bidId } = useParams<{ bidId: string }>();
  const navigate = useNavigate();
  const { address } = useAccount();
  const [selectedThreshold, setSelectedThreshold] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Fetch contract draw data
  const { data: drawData, isLoading: isLoadingDraw, isError: isDrawError } = useReadContract({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'getDraw',
    args: bidId ? [BigInt(bidId)] : undefined,
  });
  
  const { data: thresholds = [], isLoading: isLoadingThresholds, isError: isThresholdsError } = useReadContract({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'getThresholds',
    args: bidId ? [BigInt(bidId)] : undefined,
  });

  // Fetch total shares for each threshold
  const thresholdShares = useMemo(() => {
    if (!thresholds || thresholds.length === 0) return [];
    
    const shares: { threshold: number; totalShares: bigint; percentage: number }[] = [];
    let totalSharesSum = 0n;
    
    // First pass to calculate total shares
    for (const threshold of thresholds) {
      const totalSharesForThreshold = 0n; // This would be fetched from contract
      totalSharesSum += totalSharesForThreshold;
    }
    
    // Second pass to calculate percentages
    for (const threshold of thresholds) {
      const thresholdValue = Number(threshold);
      const totalSharesForThreshold = 0n; // This would be fetched from contract
      const percentage = totalSharesSum > 0n 
        ? Number((totalSharesForThreshold * 100n) / totalSharesSum)
        : 0;
      
      shares.push({
        threshold: thresholdValue,
        totalShares: totalSharesForThreshold,
        percentage,
      });
    }
    
    return shares;
  }, [thresholds]);

  // Construct bid detail from contract data
  const bidDetail: BidDetail | null = useMemo(() => {
    if (!drawData || !thresholds || thresholds.length === 0) return null;
    
    const [cityId, endTime, settled, actualTemp, pot] = drawData;
    
    // Convert bytes32 cityId to string
    const cityName = (() => {
      try {
        const hex = cityId.toString(16).replace(/^0x/, '');
        const bytes = [];
        for (let i = 0; i < hex.length; i += 2) {
          bytes.push(parseInt(hex.substring(i, 2), 16));
        }
        return new TextDecoder().decode(new Uint8Array(bytes)).replace(/\0/g, '');
      } catch {
        return 'Unknown City';
      }
    })();
    
    // Calculate time remaining
    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = Number(endTime) > now 
      ? formatTimeRemaining(Number(endTime) - now) 
      : 'Ended';
    
    // Create options from thresholds
    const options = Array.from(thresholds).map((threshold, index) => {
      const thresholdValue = Number(threshold);
      return {
        range: `${thresholdValue}°C`,
        percentage: thresholdShares[index]?.percentage || Math.floor(Math.random() * 30) + 10,
        yesPrice: Math.floor(Math.random() * 50) + 25,
        noPrice: 0, // No option as per requirement
        trend: Math.random() > 0.5 ? Math.floor(Math.random() * 10) : undefined,
      };
    });
    
    return {
      id: bidId || '0',
      question: `Highest temperature in ${cityName || 'London'} this week?`,
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      options,
      totalVolume: Number(pot),
      frequency: 'Weekly',
      timeRemaining,
      category: 'Temperature',
      location: `${cityName || 'London'}, UK`,
      rulesSummary: `If the highest temperature recorded in ${cityName || 'London'} for the specified date as reported by the WeatherXM Oracle, is above any of the thresholds, then those who bet on that threshold will win proportionally from the prize pool.`,
      fullRulesLink: '/rules/temperature-betting',
      description: `Predict the highest temperature that will be recorded in ${cityName || 'London'} this week. Temperature readings are taken from official WeatherXM Oracle.`,
      dataSource: 'WeatherXM Oracle',
      verificationMethod: 'Smart Contract Oracle Verification',
      drawId: bidId ? Number(bidId) : 0,
      endTime: Number(endTime),
      isSettled: settled,
      actualTemp: Number(actualTemp),
      thresholds: Array.from(thresholds).map(t => Number(t)),
    };
  }, [bidId, drawData, thresholds, thresholdShares]);

  const handleBetPlaced = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleClaimed = () => {
    setRefreshKey(prev => prev + 1);
  };

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

  // Loading state
  if (isLoadingDraw || isLoadingThresholds) {
    return (
      <div className="w-full px-4 space-y-6">
        <div className="nb-betting-panel p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">🔄 Loading Bid Details</h2>
          <p>Fetching data from the blockchain...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isDrawError || isThresholdsError || !bidDetail) {
    return (
      <div className="w-full px-4 space-y-6">
        <div className="nb-betting-panel-warning p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">❌ Bid Not Found</h2>
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
        <span className="text-gray-600">{bidDetail.question}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <BidDetailsSection bid={bidDetail} />
          <div className="nb-betting-panel-white p-6">
        <h2 className="text-xl font-bold mb-4">🌡️ Temperature Options</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {bidDetail.thresholds && bidDetail.thresholds.map((threshold, index) => (
            <button
              key={index}
              onClick={() => setSelectedThreshold(threshold)}
              className={`p-3 font-bold text-sm ${
                selectedThreshold === threshold
                  ? 'nb-betting-button-success'
                  : 'nb-betting-button'
              }`}
            >
              {threshold}°C
            </button>
          ))}
        </div>
      </div>
          <BidRulesSection bid={bidDetail} />
        </div>

        {/* Trading Panel */}
        <div className="lg:col-span-1">
          {bidId && (
            <div className="space-y-6">
              <PlaceBetPanel
                drawId={Number(bidId)}
                selectedThreshold={selectedThreshold}
                thresholds={bidDetail.thresholds || []}
                onBetPlaced={handleBetPlaced}
              />
              <ClaimWinningsPanel
                drawId={Number(bidId)}
                isDrawSettled={bidDetail.isSettled || false}
                actualTemp={bidDetail.actualTemp}
                onClaimed={handleClaimed}
              />
            </div>
          )}
        </div>
      </div>

      {/* Temperature Options */}
      {/* <div className="nb-betting-panel-white p-6">
        <h2 className="text-xl font-bold mb-4">🌡️ Temperature Options</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {bidDetail.thresholds && bidDetail.thresholds.map((threshold, index) => (
            <button
              key={index}
              onClick={() => setSelectedThreshold(threshold)}
              className={`p-3 font-bold text-sm ${
                selectedThreshold === threshold
                  ? 'nb-betting-button-success'
                  : 'nb-betting-button'
              }`}
            >
              {threshold}°C
            </button>
          ))}
        </div>
      </div> */}
    </div>
  );
}