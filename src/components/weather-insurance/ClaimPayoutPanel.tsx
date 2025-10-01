import React from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BIDDING_CONTRACT_ADDRESS } from '../../constants/contractAddresses';
import { BIDDING_ABI } from '../../constants/biddingAbi';
import { useToast } from '../../hooks/useToast';

interface ClaimPayoutPanelProps {
  policyId: number;
  isPolicySettled: boolean;
  actualTemp?: number;
  onClaimed: () => void;
}

export function ClaimPayoutPanel({ policyId, isPolicySettled, actualTemp, onClaimed }: ClaimPayoutPanelProps) {
  const { address } = useAccount();
  const { showSuccess, showError } = useToast();

  // Check if user has already claimed
  const { data: hasClaimed = false, refetch: refetchClaimed } = useReadContract({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'claimed',
    args: address ? [BigInt(policyId), address] : undefined,
  });

  // Write contract
  const { writeContract: claim, data: claimHash } = useWriteContract();

  // Transaction state
  const { isLoading: isClaiming } = useWaitForTransactionReceipt({
    hash: claimHash,
    onSuccess: () => {
      showSuccess('Insurance payout claimed successfully! Funds have been sent to your wallet.');
      refetchClaimed();
      onClaimed();
    },
    onError: () => {
      showError('Failed to claim payout. You may not have any eligible claims.');
    }
  });

  const handleClaim = () => {
    if (!address) return;
    
    claim({
      address: BIDDING_CONTRACT_ADDRESS,
      abi: BIDDING_ABI,
      functionName: 'claim',
      args: [BigInt(policyId)],
    });
  };

  if (!address) {
    return (
      <div className="nb-betting-panel-white p-6">
        <h3 className="text-xl font-bold mb-4">🏆 Claim Payout</h3>
        <div className="text-center py-4">
          <p className="text-gray-600">Connect your wallet to claim insurance payouts</p>
        </div>
      </div>
    );
  }

  if (!isPolicySettled) {
    return (
      <div className="nb-betting-panel-white p-6">
        <h3 className="text-xl font-bold mb-4">🏆 Claim Payout</h3>
        <div className="nb-betting-panel-warning p-4 text-center">
          <p className="font-bold text-sm">⏳ Policy Not Settled Yet</p>
          <p className="text-xs mt-1">Wait for the policy to be settled before claiming payouts</p>
        </div>
      </div>
    );
  }

  if (hasClaimed) {
    return (
      <div className="nb-betting-panel-white p-6">
        <h3 className="text-xl font-bold mb-4">🏆 Claim Payout</h3>
        <div className="nb-betting-panel-success p-4 text-center">
          <p className="font-bold text-sm">✅ Already Claimed</p>
          <p className="text-xs mt-1">You have already claimed your payout for this policy</p>
        </div>
        {actualTemp !== undefined && (
          <div className="nb-betting-panel-accent p-3 mt-4">
            <p className="text-sm font-bold">🌡️ Final Temperature: {actualTemp}°C</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="nb-betting-panel-white p-6">
      <h3 className="text-xl font-bold mb-4">🏆 Claim Payout</h3>
      
      {/* Policy Results */}
      {actualTemp !== undefined && (
        <div className="nb-betting-panel-accent p-4 mb-4">
          <h4 className="font-bold text-sm mb-1">📊 Final Results</h4>
          <p className="text-xl font-bold">Actual Temperature: {actualTemp}°C</p>
        </div>
      )}

      {/* Claim Status */}
      <div className="nb-betting-panel-success p-4 mb-4">
        <h4 className="font-bold text-sm mb-1">🛡️ Claim Status</h4>
        <p className="text-sm">
          {isPolicySettled ? 'Policy has been settled - you can claim any eligible payouts' : 'Waiting for policy settlement'}
        </p>
      </div>

      {/* Claim Button */}
      <button
        onClick={handleClaim}
        disabled={isClaiming || hasClaimed}
        className="nb-betting-button-success w-full py-3 font-bold disabled:opacity-50"
      >
        {isClaiming ? '⏳ Claiming...' : '🏆 Claim Insurance Payout'}
      </button>

      {/* Info */}
      <div className="nb-betting-panel p-3 mt-4">
        <h4 className="font-bold text-sm mb-2">ℹ️ About claiming:</h4>
        <ul className="text-xs space-y-1">
          <li>• Only policies meeting trigger conditions are eligible</li>
          <li>• Payouts are distributed proportionally</li>
          <li>• You can only claim once per policy</li>
          <li>• Funds are sent directly to your wallet</li>
        </ul>
      </div>
    </div>
  );
}