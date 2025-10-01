import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { PolicyDetailsSection } from '../../components/weather-insurance/PolicyDetailsSection';
import { PurchasePolicyPanel } from '../../components/weather-insurance/PurchasePolicyPanel';
import { ClaimPayoutPanel } from '../../components/weather-insurance/ClaimPayoutPanel';
import { PolicyRulesSection } from '../../components/weather-insurance/PolicyRulesSection';
import { BIDDING_CONTRACT_ADDRESS } from '../../constants/contractAddresses';
import { BIDDING_ABI } from '../../constants/biddingAbi';
import { PolicyDetail } from '../../data/mockInsuranceData';

export function PolicyDetailPage() {
  const { policyId } = useParams<{ policyId: string }>();
  const { address } = useAccount();
  const [selectedThreshold, setSelectedThreshold] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Fetch contract policy data
  const { data: policyData, isLoading: isLoadingPolicy, isError: isPolicyError } = useReadContract({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'getDraw',
    args: policyId ? [BigInt(policyId)] : undefined,
  });
  
  const { data: thresholds = [], isLoading: isLoadingThresholds, isError: isThresholdsError } = useReadContract({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'getThresholds',
    args: policyId ? [BigInt(policyId)] : undefined,
  });

  // Construct policy detail from contract data
  const policyDetail: PolicyDetail | null = useMemo(() => {
    if (!policyData || !thresholds || thresholds.length === 0) return null;
    
    const [cityId, endTime, settled, actualTemp, coverageAmount] = policyData;
    
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
      : 'Expired';
    
    // Create options from thresholds
    const options = Array.from(thresholds).map((threshold, index) => {
      const thresholdValue = Number(threshold);
      return {
        range: `${thresholdValue}°C`,
        percentage: Math.floor(Math.random() * 30) + 10,
        premiumRate: Math.floor(Math.random() * 15) + 5,
        coverageRatio: Math.floor(Math.random() * 50) + 100,
        trend: Math.random() > 0.5 ? Math.floor(Math.random() * 10) : undefined,
      };
    });
    
    return {
      id: policyId || '0',
      question: `Temperature insurance for ${cityName || 'London'} this week?`,
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      options,
      totalCoverage: Number(coverageAmount),
      frequency: 'Weekly',
      timeRemaining,
      category: 'Temperature',
      location: `${cityName || 'London'}, UK`,
      termsSummary: `If the temperature in ${cityName || 'London'} meets the specified conditions during the policy period, automatic payout will be triggered based on the coverage ratio. Payouts are calculated using verified weather data from the WeatherXM Oracle.`,
      fullTermsLink: '/terms/temperature-insurance',
      description: `Protect against temperature-related risks in ${cityName || 'London'} this week. Coverage is automatically triggered when temperature conditions meet policy thresholds.`,
      dataSource: 'WeatherXM Oracle',
      verificationMethod: 'Smart Contract Oracle Verification',
      policyId: policyId ? Number(policyId) : 0,
      endTime: Number(endTime),
      isSettled: settled,
      actualTemp: Number(actualTemp),
      thresholds: Array.from(thresholds).map(t => Number(t)),
    };
  }, [policyId, policyData, thresholds]);

  const handlePolicyPurchased = () => {
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
  if (isLoadingPolicy || isLoadingThresholds) {
    return (
      <div className="w-full px-4 space-y-6">
        <div className="nb-insurance-panel p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">🔄 Loading Policy Details</h2>
          <p>Fetching data from the blockchain...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isPolicyError || isThresholdsError || !policyDetail) {
    return (
      <div className="w-full px-4 space-y-6">
        <div className="nb-insurance-panel-warning p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">❌ Policy Not Found</h2>
          <p className="mb-4">The insurance policy you're looking for doesn't exist or has expired.</p>
          <Link to="/weather-insurance" className="nb-insurance-button-accent px-6 py-3 font-bold">
            ← Back to Active Policies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <Link to="/weather-insurance" className="hover:underline font-bold">Active Policies</Link>
        <span>→</span>
        <span className="text-gray-600">{policyDetail.question}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <PolicyDetailsSection policy={policyDetail} />
          <div className="nb-insurance-panel-white p-6">
            <h2 className="text-xl font-bold mb-4">🌡️ Coverage Options</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {policyDetail.thresholds && policyDetail.thresholds.map((threshold, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedThreshold(threshold)}
                  className={`p-3 font-bold text-sm ${
                    selectedThreshold === threshold
                     ? 'nb-insurance-button-success'
                     : 'nb-insurance-button'
                  }`}
                >
                  {threshold}°C
                </button>
              ))}
            </div>
          </div>
          <PolicyRulesSection policy={policyDetail} />
        </div>

        {/* Policy Panel */}
        <div className="lg:col-span-1">
          {policyId && (
            <div className="space-y-6">
              <PurchasePolicyPanel
                policyId={Number(policyId)}
                selectedThreshold={selectedThreshold}
                thresholds={policyDetail.thresholds || []}
                onPolicyPurchased={handlePolicyPurchased}
              />
              <ClaimPayoutPanel
                policyId={Number(policyId)}
                isPolicySettled={policyDetail.isSettled || false}
                actualTemp={policyDetail.actualTemp}
                onClaimed={handleClaimed}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}