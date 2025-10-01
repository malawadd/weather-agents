import React from 'react';
import { Link } from 'react-router-dom';
import { useAccount, useReadContract } from 'wagmi';
import { useAuth } from '../../WalletAuthProvider';
import { WalletConnection } from '../../WalletConnection';
import { BIDDING_CONTRACT_ADDRESS } from '../../constants/contractAddresses';
import { BIDDING_ABI } from '../../constants/biddingAbi';

export function WeatherInsuranceHeader() {
  const { user, isGuest, signOut } = useAuth();
  const { address } = useAccount();

  // Check if user is contract owner
  const { data: contractOwner } = useReadContract({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'owner',
  });

  const isOwner = address && contractOwner && address.toLowerCase() === contractOwner.toLowerCase();

  return (
    <nav className="nb-insurance-panel-white p-4 m-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">☔ Kiyan Insurance</h1>
            <Link to="/platform-selection" className="nb-betting-button px-3 py-1 text-sm font-bold">
            <Link to="/platform-selection" className="nb-insurance-button px-3 py-1 text-sm font-bold">
              ← Platforms
            </Link>
          </div>
          <div className="flex space-x-6">
            <Link to="/weather-insurance" className="font-bold text-black hover:underline">
              Active Policies
            </Link>
            {isOwner && (
              <Link to="/weather-insurance/create-policy" className="font-bold text-gray-600 hover:text-black hover:underline">
                Create Policy
              </Link>
            )}
            <Link to="/weather-insurance/premium-vault" className="font-bold text-gray-600 hover:text-black hover:underline">
              Premium Vault
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-bold">
            Welcome, {user?.name || 'Policyholder'}!
            {isGuest && <span className="text-sm text-gray-600"> (Guest)</span>}
          </span>
          {!isGuest && <WalletConnection />}
          <button 
            onClick={signOut}
            className="nb-insurance-button px-4 py-2 text-sm font-bold"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}