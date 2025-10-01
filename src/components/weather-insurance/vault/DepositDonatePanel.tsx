import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { VAULT_ABI } from '../../../constants/vaultAbi';
import { MTOKEN_ABI } from '../../../constants/mtokenAbi';
import { useToast } from '../../../hooks/useToast';

interface DepositDonatePanelProps {
  vaultAddress: `0x${string}`;
  mtokenAddress: `0x${string}`;
  mtokenBalance: bigint;
  mtokenDecimals: number;
  mtokenSymbol: string;
  onTransactionSuccess: () => void;
}

export function DepositDonatePanel({
  vaultAddress,
  mtokenAddress,
  mtokenBalance,
  mtokenDecimals,
  mtokenSymbol,
  onTransactionSuccess
}: DepositDonatePanelProps) {
  const [activeTab, setActiveTab] = useState<'deposit' | 'donate'>('deposit');
  const [amount, setAmount] = useState('');
  const { address } = useAccount();
  const { showSuccess, showError } = useToast();

  // Read current allowance
  const { data: allowance = 0n } = useReadContract({
    address: mtokenAddress,
    abi: MTOKEN_ABI,
    functionName: 'allowance',
    args: address ? [address, vaultAddress] : undefined,
  });

  // Write contracts
  const { writeContract: writeApprove, data: approveHash } = useWriteContract();
  const { writeContract: writeDeposit, data: depositHash } = useWriteContract();
  const { writeContract: writeDonate, data: donateHash } = useWriteContract();

  // Wait for transactions
  const { isLoading: isApproving } = useWaitForTransactionReceipt({
    hash: approveHash,
    onSuccess: () => {
      showSuccess('Approval successful! You can now proceed with your transaction.');
    },
    onError: () => {
      showError('Approval failed. Please try again.');
    }
  });

  const { isLoading: isDepositing } = useWaitForTransactionReceipt({
    hash: depositHash,
    onSuccess: () => {
      showSuccess('Deposit successful! Kiyan tickets have been minted to your wallet.');
      setAmount('');
      onTransactionSuccess();
    },
    onError: () => {
      showError('Deposit failed. Please try again.');
    }
  });

  const { isLoading: isDonating } = useWaitForTransactionReceipt({
    hash: donateHash,
    onSuccess: () => {
      showSuccess('Donation successful! Thank you for contributing to the prize pool.');
      setAmount('');
      onTransactionSuccess();
    },
    onError: () => {
      showError('Donation failed. Please try again.');
    }
  });

  const isLoading = isApproving || isDepositing || isDonating;

  const handleMaxClick = () => {
    if (mtokenBalance > 0n) {
      setAmount(formatUnits(mtokenBalance, mtokenDecimals));
    }
  };

  const handleApprove = () => {
    if (!amount || !address) return;
    
    try {
      const amountBigInt = parseUnits(amount, mtokenDecimals);
      writeApprove({
        address: mtokenAddress,
        abi: MTOKEN_ABI,
        functionName: 'approve',
        args: [vaultAddress, amountBigInt],
      });
    } catch (error) {
      showError('Invalid amount entered.');
    }
  };

  const handleDeposit = () => {
    if (!amount || !address) return;
    
    try {
      const amountBigInt = parseUnits(amount, mtokenDecimals);
      writeDeposit({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'deposit',
        args: [amountBigInt, address],
      });
    } catch (error) {
      showError('Invalid amount entered.');
    }
  };

  const handleDonate = () => {
    if (!amount || !address) return;
    
    try {
      const amountBigInt = parseUnits(amount, mtokenDecimals);
      writeDonate({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'donateYield',
        args: [amountBigInt],
      });
    } catch (error) {
      showError('Invalid amount entered.');
    }
  };

  const needsApproval = () => {
    if (!amount) return false;
    try {
      const amountBigInt = parseUnits(amount, mtokenDecimals);
      return allowance < amountBigInt;
    } catch {
      return false;
    }
  };

  const isValidAmount = () => {
    if (!amount) return false;
    try {
      const amountBigInt = parseUnits(amount, mtokenDecimals);
      return amountBigInt > 0n && amountBigInt <= mtokenBalance;
    } catch {
      return false;
    }
  };

  return (
    <div className="nb-betting-panel-white p-6">
      <h2 className="text-xl font-bold mb-4">💰 Deposit & Donate</h2>
      
      {/* Tab Selection */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('deposit')}
          className={`flex-1 py-3 px-4 font-bold ${
            activeTab === 'deposit' 
              ? 'nb-betting-button-success' 
              : 'nb-betting-button'
          }`}
        >
          🏦 Deposit
        </button>
        <button
          onClick={() => setActiveTab('donate')}
          className={`flex-1 py-3 px-4 font-bold ${
            activeTab === 'donate' 
              ? 'nb-betting-button-success' 
              : 'nb-betting-button'
          }`}
        >
          💝 Donate
        </button>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block font-bold mb-2">
          Amount ({mtokenSymbol})
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="nb-betting-input flex-1 px-4 py-3 text-lg"
            disabled={isLoading}
          />
          <button
            onClick={handleMaxClick}
            className="nb-betting-button px-4 py-3 font-bold"
            disabled={isLoading}
          >
            MAX
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Available: {formatUnits(mtokenBalance, mtokenDecimals)} {mtokenSymbol}
        </p>
      </div>

      {/* Action Description */}
      <div className="nb-betting-panel-accent p-3 mb-4">
        <p className="text-sm font-bold">
          {activeTab === 'deposit' 
            ? `💡 Deposit ${mtokenSymbol} to mint Kiyan tickets for betting`
            : `💝 Donate ${mtokenSymbol} to increase the prize pool for all players`
          }
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {needsApproval() && (
          <button
            onClick={handleApprove}
            disabled={!isValidAmount() || isLoading}
            className="nb-betting-button-warning w-full py-3 font-bold disabled:opacity-50"
          >
            {isApproving ? '⏳ Approving...' : `🔓 Approve ${mtokenSymbol}`}
          </button>
        )}
        
        <button
          onClick={activeTab === 'deposit' ? handleDeposit : handleDonate}
          disabled={!isValidAmount() || needsApproval() || isLoading}
          className="nb-betting-button-success w-full py-3 font-bold disabled:opacity-50"
        >
          {isLoading && !isApproving
            ? `⏳ ${activeTab === 'deposit' ? 'Depositing' : 'Donating'}...`
            : activeTab === 'deposit'
            ? '🏦 Deposit & Mint Tickets'
            : '💝 Donate to Prize Pool'
          }
        </button>
      </div>

      {/* Help Text */}
      <div className="nb-betting-panel p-3 mt-4">
        <h4 className="font-bold text-sm mb-2">ℹ️ How it works:</h4>
        <ul className="text-xs space-y-1">
          {activeTab === 'deposit' ? (
            <>
              <li>• Deposit {mtokenSymbol} tokens to the vault</li>
              <li>• Receive Kiyan tickets (1:1 ratio)</li>
              <li>• Use tickets for weather betting</li>
              <li>• Redeem tickets back to {mtokenSymbol} anytime</li>
            </>
          ) : (
            <>
              <li>• Donate {mtokenSymbol} to increase prize pool</li>
              <li>• Donations are permanent contributions</li>
              <li>• Helps create bigger rewards for winners</li>
              <li>• Shows support for the community</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}