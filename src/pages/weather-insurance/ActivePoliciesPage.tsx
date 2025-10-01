import React, { useState } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import { PolicyCard } from '../../components/weather-insurance/PolicyCard';
import { Policy } from '../../data/mockInsuranceData';
import { BIDDING_CONTRACT_ADDRESS } from '../../constants/contractAddresses';
import { BIDDING_ABI } from '../../constants/biddingAbi';

export function ActivePoliciesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('coverage');

  const categories = ['All', 'Drought', 'Rainfall', 'Temperature', 'Natural Disasters'];

  // Fetch all policy IDs from contract
  const { data: allPolicyIds = [] } = useReadContract({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'getAllDrawIds',
  });

  // Fetch policy details for each policy ID
  const policyContracts = allPolicyIds.map((policyId: bigint) => ({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'getDraw',
    args: [policyId],
  }));

  const thresholdContracts = allPolicyIds.map((policyId: bigint) => ({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'getThresholds',
    args: [policyId],
  }));

  const { data: policiesData = [] } = useReadContracts({
    contracts: policyContracts,
  });

  const { data: thresholdsData = [] } = useReadContracts({
    contracts: thresholdContracts,
  });

  // Transform contract data to Policy format
  const contractPolicies: Policy[] = allPolicyIds.map((policyId: bigint, index: number) => {
    const policyData = policiesData[index]?.result;
    const thresholds = thresholdsData[index]?.result;
    
    if (!policyData || !thresholds) return null;

    const [cityId, endTime, settled, actualTemp, coverageAmount] = policyData;
    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = Number(endTime) > now ? 
      formatTimeRemaining(Number(endTime) - now) : 'Expired';
    
    const isActive = Number(endTime) > now && !settled;

    // Create coverage options from thresholds
    const options = thresholds.map((threshold: bigint) => ({
      range: `${Number(threshold)}°C`,
      percentage: Math.floor(Math.random() * 30) + 10,
      premiumRate: Math.floor(Math.random() * 15) + 5,
      coverageRatio: Math.floor(Math.random() * 50) + 100,
    }));

    return {
      id: policyId.toString(),
      question: 'Temperature insurance for London this week?',
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      options,
      totalCoverage: Number(coverageAmount) || Math.floor(Math.random() * 1000000),
      frequency: 'Weekly' as const,
      timeRemaining,
      category: 'Temperature',
      location: 'London, UK',
      policyId: Number(policyId),
      endTime: Number(endTime),
      isSettled: settled,
      actualTemp: actualTemp ? Number(actualTemp) : undefined,
      thresholds: thresholds.map((t: bigint) => Number(t)),
    };
  }).filter(Boolean) as Policy[];
  
  const allPolicies = [...contractPolicies];
  
  const filteredPolicies = allPolicies.filter(policy => 
    selectedCategory === 'All' || policy.category === selectedCategory
  );

  const sortedPolicies = [...filteredPolicies].sort((a, b) => {
    switch (sortBy) {
      case 'coverage':
        return b.totalCoverage - a.totalCoverage;
      case 'time':
        return a.timeRemaining.localeCompare(b.timeRemaining);
      case 'activity':
        return b.options.length - a.options.length;
      default:
        return 0;
    }
  });

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
        <h1 className="text-3xl font-bold mb-2">☔ Active Weather Insurance Policies</h1>
        <p className="text-gray-600">
          Protect yourself against weather risks with parametric insurance policies backed by real weather data.
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
                <option value="coverage">Coverage Amount</option>
                <option value="time">Time Remaining</option>
                <option value="activity">Activity</option>
              </select>
            </div>
          </div>
        </div>

        <div className="nb-betting-panel-success p-4">
          <div className="text-center">
            <p className="font-bold text-sm">TOTAL POLICIES</p>
            <p className="text-2xl font-bold">{filteredPolicies.length}</p>
          </div>
        </div>
      </div>

      {/* Policies Grid */}
      {filteredPolicies.length === 0 ? (
        <div className="nb-betting-panel p-8 text-center">
          <h3 className="text-xl font-bold mb-4">📭 No Policies Found</h3>
          <p className="text-gray-600 mb-6">
            {selectedCategory === 'All' 
              ? 'No insurance policies are currently available.'
              : `No ${selectedCategory.toLowerCase()} insurance policies found.`
            }
          </p>
          <button 
            onClick={() => setSelectedCategory('All')}
            className="nb-betting-button-accent px-6 py-3 font-bold"
          >
            Show All Policies
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPolicies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      )}

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="nb-betting-panel-white p-6 text-center">
          <h3 className="font-bold text-lg mb-2">💰 Total Coverage</h3>
          <p className="text-2xl font-bold text-green-600">
            ${allPolicies.reduce((sum, policy) => sum + policy.totalCoverage, 0).toLocaleString()}
          </p>
        </div>
        <div className="nb-betting-panel-white p-6 text-center">
          <h3 className="font-bold text-lg mb-2">📋 Active Policies</h3>
          <p className="text-2xl font-bold text-blue-600">{allPolicies.length}</p>
        </div>
        <div className="nb-betting-panel-white p-6 text-center">
          <h3 className="font-bold text-lg mb-2">🏆 Top Category</h3>
          <p className="text-2xl font-bold text-purple-600">Drought Protection</p>
        </div>
      </div>
    </div>
  );
}