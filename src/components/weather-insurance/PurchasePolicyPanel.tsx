import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { BIDDING_CONTRACT_ADDRESS } from '../../constants/contractAddresses';
import { BIDDING_ABI } from '../../constants/biddingAbi';
import { ERC20_ABI } from '../../constants/erc20Abi';
import { useToast } from '../../hooks/useToast';

interface PurchasePolicyPanelProps {
  policyId: number;
  selectedThreshold: number | null;
  thresholds: number[];
  onPolicyPurchased: () => void;
}

export function PurchasePolicyPanel({ policyId, selectedThreshold, thresholds, onPolicyPurchased }: PurchasePolicyPanelProps) {
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
  const { data: ticketBalance = 0n, refetch: refetchTicketBalance } = useReadContract({
    address: ticketsAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Get user shares for selected threshold
  const { data: userShares = 0n, refetch: refetchUserShares } = useReadContract({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'getUserShares',
    args: address && selectedThreshold !== null ? [BigInt(policyId), address, BigInt(selectedThreshold)] : undefined,
  });

  // Get total shares for selected threshold
  const { data: totalShares = 0n, refetch: refetchTotalShares } = useReadContract({
    address: BIDDING_CONTRACT_ADDRESS,
    abi: BIDDING_ABI,
    functionName: 'getTotalShares',
    args: selectedThreshold !== null ? [BigInt(policyId), BigInt(selectedThreshold)] : undefined,
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
  const { writeContract: purchasePolicy, data: purchasePolicyHash } = useWriteContract();

  // Transaction states
  const { isLoading: isApproving } = useWaitForTransactionReceipt({
    hash: approveHash,
    onSuccess: () => {
      showSuccess('Approval successful! You can now purchase the policy.');
    },
    onError: () => {
      showError('Approval failed. Please try again.');
    }
  });

  const { isLoading: isPurchasing } = useWaitForTransactionReceipt({
    hash: purchasePolicyHash,
    onSuccess: () => {
      showSuccess('Policy purchased successfully! You are now covered against weather risks.');
      setShareAmount('');
      refetchTicketBalance();
      refetchUserShares();
      refetchTotalShares();
      onPolicyPurchased();
    },
    onError: () => {
      showError('Failed to purchase policy. Please try again.');
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

  const handlePurchasePolicy = () => {
    if (!shareAmount || selectedThreshold === null) return;
    
    try {
      const amount = parseUnits(shareAmount, ticketDecimals);
      purchasePolicy({
        address: BIDDING_CONTRACT_ADDRESS,
        abi: BIDDING_ABI,
        functionName: 'placeBid',
        args: [BigInt(policyId), BigInt(selectedThreshold), amount],
      });
    } catch (error) {
      showError('Invalid policy parameters.');
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
        <h3 className="text-xl font-bold mb-4">🛡️ Purchase Policy</h3>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Connect your wallet to purchase insurance policies</p>
          <div className="nb-betting-panel-warning p-3">
          <div className="nb-insurance-panel-warning p-3">
            <p className="text-sm font-bold">Wallet connection required</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nb-insurance-panel-white p-6">
      <h3 className="text-xl font-bold mb-4">🛡️ Purchase Policy</h3>
      
      {/* Selected Option */}
      {selectedThreshold !== null ? (
        <div className="space-y-3 mb-4">
          <div className="nb-insurance-panel-accent p-4">
            <h4 className="font-bold text-sm mb-1">Selected Coverage</h4>
            <p className="text-xl font-bold">{selectedThreshold}°C threshold</p>
          </div>
          
          {/* Show user's current coverage */}
          {userShares > 0n && (
            <div className="nb-insurance-panel-success p-3">
              <h4 className="font-bold text-xs mb-1">Your Current Coverage</h4>
              <p className="text-sm font-bold">
                {formatUnits(userShares, ticketDecimals)} KITX
              </p>
              <p className="text-xs text-gray-600">
                {totalShares > 0n ? 
                  `${((Number(userShares) / Number(totalShares)) * 100).toFixed(2)}% of total coverage` 
                  : 'First policy for this threshold'
                }
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="nb-insurance-panel p-4 mb-4 text-center">
          <p className="text-gray-600">Select a temperature threshold to purchase coverage</p>
        </div>
      )}

      {/* Ticket Balance */}
      <div className="nb-insurance-panel-success p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-sm mb-1">🎫 Your Tickets</h4>
            <p className="text-xs text-gray-600">Available for insurance purchase</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">
              {formatUnits(ticketBalance, ticketDecimals)}
            </p>
            <p className="text-xs text-gray-600">KITX</p>
          </div>
        </div>
      </div>

      {/* Coverage Amount Input */}
      <div className="mb-4">
        <label className="block font-bold mb-2">Coverage Amount (KITX)</label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={shareAmount}
            onChange={(e) => setShareAmount(e.target.value)}
            placeholder="0.0"
            className="nb-betting-input flex-1 px-4 py-3"
            className="nb-insurance-input flex-1 px-4 py-3"
            disabled={isApproving || isPurchasing}
          />
          <button
            onClick={handleMaxClick}
            className="nb-insurance-button px-4 py-3 font-bold"
            disabled={isApproving || isPurchasing}
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
            disabled={!isValidAmount() || isApproving || isPurchasing}
            className="nb-insurance-button-warning w-full py-3 font-bold disabled:opacity-50"
          >
            {isApproving ? '⏳ Approving...' : '🔓 Approve Tickets'}
          </button>
        )}
        
        <button
          onClick={handlePurchasePolicy}
          disabled={!isValidAmount() || needsApproval() || selectedThreshold === null || isApproving || isPurchasing}
          className="nb-insurance-button-success w-full py-3 font-bold disabled:opacity-50"
        >
          {isPurchasing ? '⏳ Purchasing...' : '🛡️ Purchase Policy'}
        </button>
      </div>

      {/* Help Text */}
      <div className="nb-insurance-panel p-3 mt-4">
        <h4 className="font-bold text-sm mb-2">💡 How to purchase:</h4>
        <ul className="text-xs space-y-1">
          <li>• Select a temperature threshold above</li>
          <li>• Enter the amount of KITX tickets for coverage</li>
          <li>• Approve tickets if needed</li>
          <li>• Purchase your policy and wait for results</li>
          <li>• Claim payouts after the policy settles</li>
        </ul>
      </div>
    </div>
  );
}