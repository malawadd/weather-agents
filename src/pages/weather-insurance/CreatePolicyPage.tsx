import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Link } from 'react-router-dom';
import { BIDDING_CONTRACT_ADDRESS } from '../../constants/contractAddresses';
import { BIDDING_ABI } from '../../constants/biddingAbi';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/ui/ToastContainer';

export function CreatePolicyPage() {
  const [thresholds, setThresholds] = useState('20, 21, 22, 23, 24');
  const [isCreating, setIsCreating] = useState(false);
  const { address } = useAccount();
  const { toasts, showSuccess, showError, hideToast } = useToast();

  // Check if user is contract owner
  const { data: contractOwner } = useReadContract({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'owner',
  });

  const { writeContract: createPolicy, data: createPolicyHash } = useWriteContract();

  const { isLoading: isCreatingPolicy } = useWaitForTransactionReceipt({
    hash: createPolicyHash,
    onSuccess: () => {
      showSuccess('Weather insurance policy created successfully! Users can now purchase coverage.');
      setThresholds('20, 21, 22, 23, 24');
      setIsCreating(false);
    },
    onError: () => {
      showError('Failed to create weather insurance policy. Please try again.');
      setIsCreating(false);
    }
  });

  const isOwner = address && contractOwner && address.toLowerCase() === contractOwner.toLowerCase();

  const handleCreatePolicy = async () => {
    if (!address || !isOwner) return;

    try {
      setIsCreating(true);
      
      // Parse thresholds
      const thresholdArray = thresholds
        .split(',')
        .map(t => parseInt(t.trim()))
        .filter(t => !isNaN(t));

      if (thresholdArray.length === 0) {
        showError('Please enter valid temperature thresholds.');
        setIsCreating(false);
        return;
      }

      // London city ID (hardcoded as bytes32)
      const londonCityId = '0x4c6f6e646f6e000000000000000000000000000000000000000000000000000';
      
      // End time: 1 week from now
      const endTime = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);

      createPolicy({
        address: BIDDING_CONTRACT_ADDRESS,
        abi: BIDDING_ABI,
        functionName: 'createDraw',
        args: [londonCityId, BigInt(endTime), thresholdArray.map(t => BigInt(t))],
      });
    } catch (error) {
      showError('Invalid threshold values. Please check your input.');
      setIsCreating(false);
    }
  };

  if (!address) {
    return (
      <div className="w-full px-4">
        <div className="nb-betting-panel-warning p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">🔒 Wallet Connection Required</h2>
          <p className="mb-4">Please connect your wallet to access policy creation.</p>
          <Link to="/weather-insurance" className="nb-betting-button-accent px-6 py-3 font-bold">
            ← Back to Active Policies
          </Link>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="w-full px-4">
        <div className="nb-betting-panel-warning p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">🚫 Access Denied</h2>
          <p className="mb-4">Only the contract owner can create new insurance policies.</p>
          <p className="text-sm text-gray-600 mb-4">
            Contract Owner: {contractOwner ? `${contractOwner.slice(0, 6)}...${contractOwner.slice(-4)}` : 'Loading...'}
          </p>
          <Link to="/weather-insurance" className="nb-betting-button-accent px-6 py-3 font-bold">
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
        <span className="text-gray-600">Create New Policy</span>
      </div>

      {/* Header */}
      <div className="nb-betting-panel-white p-6">
        <h1 className="text-3xl font-bold mb-2">☔ Create Weather Insurance Policy</h1>
        <p className="text-gray-600">
          Create a new parametric weather insurance policy for the community to purchase.
        </p>
      </div>

      {/* Create Policy Form */}
      <div className="max-w-2xl mx-auto">
        <div className="nb-betting-panel-white p-6">
          <h2 className="text-xl font-bold mb-6">📋 Policy Configuration</h2>
          
          {/* Hardcoded Policy Info */}
          <div className="space-y-4 mb-6">
            <div className="nb-betting-panel-accent p-4">
              <h3 className="font-bold mb-2">☔ Coverage Type</h3>
              <p className="text-lg font-bold">Temperature Insurance for London</p>
            </div>

            <div className="nb-betting-panel-success p-4">
              <h3 className="font-bold mb-2">📝 Description</h3>
              <p className="text-sm">
                Parametric insurance policy that provides automatic payouts when temperature 
                conditions in London meet specified thresholds. Coverage is triggered by 
                verified weather data from the WeatherXM oracle network.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="nb-betting-panel p-3">
                <h4 className="font-bold text-sm mb-1">📍 Location</h4>
                <p className="text-sm">London, UK</p>
              </div>
              <div className="nb-betting-panel p-3">
                <h4 className="font-bold text-sm mb-1">⏰ Duration</h4>
                <p className="text-sm">7 days</p>
              </div>
            </div>
          </div>

          {/* Temperature Thresholds Input */}
          <div className="mb-6">
            <label className="block font-bold mb-2">
              🌡️ Temperature Triggers (°C)
            </label>
            <input
              type="text"
              value={thresholds}
              onChange={(e) => setThresholds(e.target.value)}
              placeholder="20, 21, 22, 23, 24"
              className="nb-betting-input w-full px-4 py-3"
              disabled={isCreating || isCreatingPolicy}
            />
            <p className="text-xs text-gray-600 mt-1">
              Enter comma-separated temperature values that trigger payouts (e.g., "20, 21, 22, 23, 24")
            </p>
          </div>

          {/* Preview */}
          <div className="nb-betting-panel-warning p-4 mb-6">
            <h4 className="font-bold text-sm mb-2">📋 Policy Preview</h4>
            <ul className="text-sm space-y-1">
              <li>• Coverage: "Temperature insurance for London this week"</li>
              <li>• Duration: 7 days from creation</li>
              <li>• Data Source: WeatherXM Oracle</li>
              <li>• Triggers: {thresholds.split(',').map(t => t.trim()).filter(t => t).join('°C, ')}°C</li>
            </ul>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreatePolicy}
            disabled={!thresholds.trim() || isCreating || isCreatingPolicy}
            className="nb-betting-button-success w-full py-4 font-bold text-lg disabled:opacity-50"
          >
            {isCreating || isCreatingPolicy ? '⏳ Creating Policy...' : '☔ Create Insurance Policy'}
          </button>

          {/* Info */}
          <div className="nb-betting-panel p-4 mt-6">
            <h4 className="font-bold text-sm mb-2">ℹ️ Important Notes:</h4>
            <ul className="text-xs space-y-1">
              <li>• Once created, the policy cannot be modified</li>
              <li>• The policy will automatically expire after 7 days</li>
              <li>• Payouts require oracle data from WeatherXM</li>
              <li>• Users need Kiyan tickets to purchase coverage</li>
            </ul>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onHideToast={hideToast} />
    </div>
  );
}