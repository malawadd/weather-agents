import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { BIDDING_CONTRACT_ADDRESS } from '../../constants/contractAddresses';
import { BIDDING_ABI } from '../../constants/biddingAbi';
import { ERC20_ABI } from '../../constants/erc20Abi';
import { useToast } from '../../hooks/useToast';

interface PlaceBetPanelProps {
  drawId: number;
  selectedThreshold: number | null;
  thresholds: number[];
  onBetPlaced: () => void;
}

export function PlaceBetPanel({ drawId, selectedThreshold, thresholds, onBetPlaced }: PlaceBetPanelProps) {
  const [shareAmount, setShareAmount] = useState('');
  const { address } = useAccount();
  const { showSuccess, showError } = useToast();

  // Get tickets contract address
  const { data: ticketsAddress } = useReadContract({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'tickets',
  });

  // Get user's ticket balance
  const { data: ticketBalance = 0n, refetch: refetchBalance } = useReadContract({
    address: ticketsAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Get ticket decimals
  const { data: ticketDecimals = 18 } = useReadContract({
    address: ticketsAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  // Get allowance
  const { data: allowance = 0n } = useReadContract({
    address: ticketsAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && ticketsAddress ? [address, BIDDING_CONTRACT_ADDRESS] : undefined,
  });

  // Write contracts
  const { writeContract: approve, data: approveHash } = useWriteContract();
  const { writeContract: placeBid, data: placeBidHash } = useWriteContract();

  // Transaction states
  const { isLoading: isApproving } = useWaitForTransactionReceipt({
    hash: approveHash,
    onSuccess: () => {
      showSuccess('Approval successful! You can now place your bet.');
    },
    onError: () => {
      showError('Approval failed. Please try again.');
    }
  });

  const { isLoading: isPlacingBet } = useWaitForTransactionReceipt({
    hash: placeBidHash,
    onSuccess: () => {
      showSuccess('Bet placed successfully! Good luck with your prediction.');
      setShareAmount('');
      refetchBalance();
      onBetPlaced();
    },
    onError: () => {
      showError('Failed to place bet. Please try again.');
    }
  });

  const handleApprove = () => {
    if (!shareAmount || !ticketsAddress) return;
    
    try {
      const amount = parseUnits(shareAmount, ticketDecimals);
      approve({
        address: ticketsAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [BIDDING_CONTRACT_ADDRESS, amount],
      });
    } catch (error) {
      showError('Invalid amount entered.');
    }
  };

  const handlePlaceBet = () => {
    if (!shareAmount || selectedThreshold === null) return;
    
    try {
      const amount = parseUnits(shareAmount, ticketDecimals);
      placeBid({
        address: BIDDING_CONTRACT_ADDRESS,
        abi: BIDDING_ABI,
        functionName: 'placeBid',
        args: [BigInt(drawId), BigInt(selectedThreshold), amount],
      });
    } catch (error) {
      showError('Invalid bet parameters.');
    }
  };

  const needsApproval = () => {
    if (!shareAmount) return false;
    try {
      const amount = parseUnits(shareAmount, ticketDecimals);
      return allowance < amount;
    } catch {
      return false;
    }
  };

  const isValidAmount = () => {
    if (!shareAmount) return false;
    try {
      const amount = parseUnits(shareAmount, ticketDecimals);
      return amount > 0n && amount <= ticketBalance;
    } catch {
      return false;
    }
  };

  const handleMaxClick = () => {
    if (ticketBalance > 0n) {
      setShareAmount(formatUnits(ticketBalance, ticketDecimals));
    }
  };

  if (!address) {
    return (
      <div className="nb-betting-panel-white p-6">
        <h3 className="text-xl font-bold mb-4">🎫 Place Your Bet</h3>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Connect your wallet to place bets</p>
          <div className="nb-betting-panel-warning p-3">
            <p className="text-sm font-bold">Wallet connection required</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nb-betting-panel-white p-6">
      <h3 className="text-xl font-bold mb-4">🎫 Place Your Bet</h3>
      
      {/* Selected Option */}
      {selectedThreshold !== null ? (
        <div className="nb-betting-panel-accent p-4 mb-4">
          <h4 className="font-bold text-sm mb-1">Selected Temperature</h4>
          <p className="text-xl font-bold">{selectedThreshold}°C</p>
        </div>
      ) : (
        <div className="nb-betting-panel p-4 mb-4 text-center">
          <p className="text-gray-600">Select a temperature option to place your bet</p>
        </div>
      )}

      {/* Ticket Balance */}
      <div className="nb-betting-panel-success p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-sm mb-1">🎫 Your Tickets</h4>
            <p className="text-xs text-gray-600">Available for betting</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">
              {formatUnits(ticketBalance, ticketDecimals)}
            </p>
            <p className="text-xs text-gray-600">KITX</p>
          </div>
        </div>
      </div>

      {/* Bet Amount Input */}
      <div className="mb-4">
        <label className="block font-bold mb-2">Bet Amount (KITX)</label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={shareAmount}
            onChange={(e) => setShareAmount(e.target.value)}
            placeholder="0.0"
            className="nb-betting-input flex-1 px-4 py-3"
            disabled={isApproving || isPlacingBet}
          />
          <button
            onClick={handleMaxClick}
            className="nb-betting-button px-4 py-3 font-bold"
            disabled={isApproving || isPlacingBet}
          >
            MAX
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Available: {formatUnits(ticketBalance, ticketDecimals)} KITX
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {needsApproval() && (
          <button
            onClick={handleApprove}
            disabled={!isValidAmount() || isApproving || isPlacingBet}
            className="nb-betting-button-warning w-full py-3 font-bold disabled:opacity-50"
          >
            {isApproving ? '⏳ Approving...' : '🔓 Approve Tickets'}
          </button>
        )}
        
        <button
          onClick={handlePlaceBet}
          disabled={!isValidAmount() || needsApproval() || selectedThreshold === null || isApproving || isPlacingBet}
          className="nb-betting-button-success w-full py-3 font-bold disabled:opacity-50"
        >
          {isPlacingBet ? '⏳ Placing Bet...' : '🎯 Place Bet'}
        </button>
      </div>

      {/* Help Text */}
      <div className="nb-betting-panel p-3 mt-4">
        <h4 className="font-bold text-sm mb-2">💡 How to bet:</h4>
        <ul className="text-xs space-y-1">
          <li>• Select a temperature threshold above</li>
          <li>• Enter the amount of KITX tickets to bet</li>
          <li>• Approve tickets if needed</li>
          <li>• Place your bet and wait for results</li>
          <li>• Claim winnings after the draw settles</li>
        </ul>
      </div>
    </div>
  );
}