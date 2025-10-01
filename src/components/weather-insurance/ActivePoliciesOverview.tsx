import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReadContract, useReadContracts } from 'wagmi';
import { PolicyCard } from './PolicyCard';
import { Policy } from '../../data/mockInsuranceData';
import { BIDDING_CONTRACT_ADDRESS } from '../../constants/contractAddresses';
import { BIDDING_ABI } from '../../constants/biddingAbi';

export function ActivePoliciesOverview() {
  // Fetch all policy IDs from contract (limited for overview)
  const { data: allPolicyIds = [] } = useReadContract({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'getAllDrawIds',
  });

  // Only show first 3 policies for overview
  const limitedPolicyIds = allPolicyIds.slice(0, 3);

  // Fetch policy details for limited policies
  const policyContracts = limitedPolicyIds.map((policyId: bigint) => ({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'getDraw',
    args: [policyId],
  }));

  const thresholdContracts = limitedPolicyIds.map((policyId: bigint) => ({
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
  const contractPolicies: Policy[] = limitedPolicyIds.map((policyId: bigint, index: number) => {
    const policyData = policiesData[index]?.result;
    const thresholds = thresholdsData[index]?.result || [];
    
    if (!policyData || !thresholds) return null;

    const [cityId, endTime, settled, actualTemp, coverageAmount] = policyData;
    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = Number(endTime) > now ? 
      formatTimeRemaining(Number(endTime) - now) : 'Expired';

    // Create coverage options from thresholds
    const options = Array.isArray(thresholds) ? thresholds.map((threshold: bigint) => ({
      range: `${Number(threshold)}°C`,
      percentage: Math.floor(Math.random() * 30) + 10,
      premiumRate: Math.floor(Math.random() * 15) + 5,
      coverageRatio: Math.floor(Math.random() * 50) + 100,
    })) : [];

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
      thresholds: Array.isArray(thresholds) ? thresholds.map((t: bigint) => Number(t)) : [],
    };
  }).filter(Boolean) as Policy[];

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
    <div className="nb-insurance-panel-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Featured Insurance Policies</h2>
        <Link to="/weather-insurance/policies" className="nb-insurance-button-accent px-6 py-3 font-bold">
          View All Policies
        </Link>
      </div>
      
      <p className="text-gray-600 mb-6">
        Protect your assets with our most popular weather insurance policies.
      </p>

      {/* Featured Policies Grid */}
      {contractPolicies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contractPolicies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      ) : (
        <div className="nb-insurance-panel p-8 text-center">
          <h3 className="text-xl font-bold mb-2">🏗️ Policies Loading</h3>
          <p className="text-gray-600 mb-4">
            Fetching the latest weather insurance policies from the blockchain...
          </p>
          <Link to="/weather-insurance/create-policy" className="nb-insurance-button-accent px-6 py-3 font-bold">
            Create First Policy
          </Link>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t-4 border-black">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{contractPolicies.length}+</div>
          <p className="text-sm font-bold">Active Policies</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">24h</div>
          <p className="text-sm font-bold">Claim Processing</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">100%</div>
          <p className="text-sm font-bold">Automated</p>
        </div>
      </div>
    </div>
  );
}