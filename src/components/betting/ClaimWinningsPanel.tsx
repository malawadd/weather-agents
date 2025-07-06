import React from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BIDDING_CONTRACT_ADDRESS } from '../../constants/contractAddresses';
import { BIDDING_ABI } from '../../constants/biddingAbi';
import { useToast } from '../../hooks/useToast';

interface ClaimWinningsPanelProps {
  drawId: number;
  isDrawSettled: boolean;
  actualTemp?: number;
  onClaimed: () => void;
}

export function ClaimWinningsPanel({ drawId, isDrawSettled, actualTemp, onClaimed }: ClaimWinningsPanelProps) {
  const { address } = useAccount();
  const { showSuccess, showError } = useToast();

  // Check if user has already claimed
  const { data: hasClaimed = false } = useReadContract({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'claimed',
    args: address ? [BigInt(drawId), address] : undefined,
  });

  // Write contract
  const { writeContract: claim, data: claimHash } = useWriteContract();

  // Transaction state
  const { isLoading: isClaiming } = useWaitForTransactionReceipt({
    hash: claimHash,
    onSuccess: () => {
      showSuccess('Winnings claimed successfully! Tokens have been sent to your wallet.');
      onClaimed();
    },
    onError: () => {
      showError('Failed to claim winnings. You may not have any winnings to claim.');
    }
  });

  const handleClaim = () => {
    if (!address) return;
    
    claim({
      address: BIDDING_CONTRACT_ADDRESS,
      abi: BIDDING_ABI,
      functionName: 'claim',
      args: [BigInt(drawId)],
    });
  };

  if (!address) {
    return (
      <div className="nb-betting-panel-white p-6">
        <h3 className="text-xl font-bold mb-4">🏆 Claim Winnings</h3>
        <div className="text-center py-4">
          <p className="text-gray-600">Connect your wallet to claim winnings</p>
        </div>
      </div>
    );
  }

  if (!isDrawSettled) {
    return (
      <div className="nb-betting-panel-white p-6">
        <h3 className="text-xl font-bold mb-4">🏆 Claim Winnings</h3>
        <div className="nb-betting-panel-warning p-4 text-center">
          <p className="font-bold text-sm">⏳ Draw Not Settled Yet</p>
          <p className="text-xs mt-1">Wait for the draw to be settled before claiming winnings</p>
        </div>
      </div>
    );
  }

  if (hasClaimed) {
    return (
      <div className="nb-betting-panel-white p-6">
        <h3 className="text-xl font-bold mb-4">🏆 Claim Winnings</h3>
        <div className="nb-betting-panel-success p-4 text-center">
          <p className="font-bold text-sm">✅ Already Claimed</p>
          <p className="text-xs mt-1">You have already claimed your winnings for this draw</p>
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
      <h3 className="text-xl font-bold mb-4">🏆 Claim Winnings</h3>
      
      {/* Draw Results */}
      {actualTemp !== undefined && (
        <div className="nb-betting-panel-accent p-4 mb-4">
          <h4 className="font-bold text-sm mb-1">📊 Final Results</h4>
          <p className="text-xl font-bold">Actual Temperature: {actualTemp}°C</p>
        </div>
      )}

      {/* Claim Status */}
      <div className="nb-betting-panel-success p-4 mb-4">
        <h4 className="font-bold text-sm mb-1">🎯 Claim Status</h4>
        <p className="text-sm">
          {isDrawSettled ? 'Draw has been settled - you can claim any winnings' : 'Waiting for draw settlement'}
        </p>
      </div>

      {/* Claim Button */}
      <button
        onClick={handleClaim}
        disabled={isClaiming || hasClaimed}
        className="nb-betting-button-success w-full py-3 font-bold disabled:opacity-50"
      >
        {isClaiming ? '⏳ Claiming...' : '🏆 Claim Winnings'}
      </button>

      {/* Info */}
      <div className="nb-betting-panel p-3 mt-4">
        <h4 className="font-bold text-sm mb-2">ℹ️ About claiming:</h4>
        <ul className="text-xs space-y-1">
          <li>• Only winning bets are eligible for rewards</li>
          <li>• Winnings are distributed proportionally</li>
          <li>• You can only claim once per draw</li>
          <li>• Tokens are sent directly to your wallet</li>
        </ul>
      </div>
    </div>
  );
}