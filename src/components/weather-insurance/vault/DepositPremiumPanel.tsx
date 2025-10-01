import React, { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { VAULT_ABI } from '../../../constants/vaultAbi';
import { ERC20_ABI } from '../../../constants/erc20Abi';
import { useToast } from '../../../hooks/useToast';

interface DepositPremiumPanelProps {
  vaultAddress: string;
  mtokenAddress: string;
  mtokenBalance: bigint;
  mtokenDecimals: number;
  mtokenSymbol: string;
  onTransactionSuccess: () => void;
}

export function DepositPremiumPanel({ 
  vaultAddress, 
  mtokenAddress, 
  mtokenBalance, 
  mtokenDecimals, 
  mtokenSymbol,
  onTransactionSuccess 
}: DepositPremiumPanelProps) {
  const [depositAmount, setDepositAmount] = useState('');
  const [donateAmount, setDonateAmount] = useState('');
  const { showSuccess, showError } = useToast();

  // Write contracts
  const { writeContract: deposit, data: depositHash } = useWriteContract();
  const { writeContract: donate, data: donateHash } = useWriteContract();
  const { writeContract: approve, data: approveHash } = useWriteContract();

  // Transaction states
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
      showSuccess('Deposit successful! Kiyan insurance tickets have been minted to your wallet.');
      setDepositAmount('');
      onTransactionSuccess();
    },
    onError: () => {
      showError('Deposit failed. Please try again.');
    }
  });

  const { isLoading: isDonating } = useWaitForTransactionReceipt({
    hash: donateHash,
    onSuccess: () => {
      showSuccess('Thank you for your contribution! The community coverage pool has been increased.');
      setDonateAmount('');
      onTransactionSuccess();
    },
    onError: () => {
      showError('Donation failed. Please try again.');
    }
  });

  const handleApprove = (amount: string) => {
    if (!amount) return;
    
    try {
      const amountBigInt = parseUnits(amount, mtokenDecimals);
      approve({
        address: mtokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [vaultAddress, amountBigInt],
      });
    } catch (error) {
      showError('Invalid amount entered.');
    }
  };

  const handleDeposit = () => {
    if (!depositAmount) return;
    
    try {
      const amount = parseUnits(depositAmount, mtokenDecimals);
      deposit({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'deposit',
        args: [amount, vaultAddress], // receiver is the vault itself
      });
    } catch (error) {
      showError('Invalid deposit amount.');
    }
  };

  const handleDonate = () => {
    if (!donateAmount) return;
    
    try {
      const amount = parseUnits(donateAmount, mtokenDecimals);
      donate({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'donateYield',
        args: [amount],
      });
    } catch (error) {
      showError('Invalid donation amount.');
    }
  };

  const isValidAmount = (amount: string) => {
    if (!amount) return false;
    try {
      const amountBigInt = parseUnits(amount, mtokenDecimals);
      return amountBigInt > 0n && amountBigInt <= mtokenBalance;
    } catch {
      return false;
    }
  };

  const handleMaxClick = (setter: (value: string) => void) => {
    if (mtokenBalance > 0n) {
      setter(formatUnits(mtokenBalance, mtokenDecimals));
    }
  };

  return (
    <div className="space-y-6">
      {/* Deposit Panel */}
      <div className="nb-insurance-panel-white p-6">
        <h3 className="text-xl font-bold mb-4">💎 Deposit for Insurance Tickets</h3>
        <p className="text-sm text-gray-600 mb-4">
          Deposit {mtokenSymbol} tokens to mint Kiyan insurance tickets for purchasing weather protection policies.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block font-bold mb-2">Deposit Amount ({mtokenSymbol})</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.0"
                className="nb-insurance-input flex-1 px-4 py-3"
                disabled={isApproving || isDepositing}
              />
              <button
                onClick={() => handleMaxClick(setDepositAmount)}
                className="nb-insurance-button px-4 py-3 font-bold"
                disabled={isApproving || isDepositing}
              >
                MAX
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleApprove(depositAmount)}
              disabled={!isValidAmount(depositAmount) || isApproving || isDepositing}
              className="nb-insurance-button-warning w-full py-2 font-bold disabled:opacity-50"
            >
              {isApproving ? '⏳ Approving...' : '🔓 Approve Tokens'}
            </button>
            
            <button
              onClick={handleDeposit}
              disabled={!isValidAmount(depositAmount) || isDepositing}
              className="nb-insurance-button-success w-full py-3 font-bold disabled:opacity-50"
            >
              {isDepositing ? '⏳ Depositing...' : '💎 Deposit & Mint Insurance Tickets'}
            </button>
          </div>
        </div>
      </div>

      {/* Donate Panel */}
      <div className="nb-insurance-panel-accent p-6">
        <h3 className="text-xl font-bold mb-4">💝 Contribute to Coverage Pool</h3>
        <p className="text-sm text-gray-600 mb-4">
          Donate {mtokenSymbol} tokens to increase the community coverage pool and help other policyholders.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block font-bold mb-2">Contribution Amount ({mtokenSymbol})</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={donateAmount}
                onChange={(e) => setDonateAmount(e.target.value)}
                placeholder="0.0"
                className="nb-insurance-input flex-1 px-4 py-3"
                disabled={isApproving || isDonating}
              />
              <button
                onClick={() => handleMaxClick(setDonateAmount)}
                className="nb-insurance-button px-4 py-3 font-bold"
                disabled={isApproving || isDonating}
              >
                MAX
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleApprove(donateAmount)}
              disabled={!isValidAmount(donateAmount) || isApproving || isDonating}
              className="nb-insurance-button-warning w-full py-2 font-bold disabled:opacity-50"
            >
              {isApproving ? '⏳ Approving...' : '🔓 Approve Tokens'}
            </button>
            
            <button
              onClick={handleDonate}
              disabled={!isValidAmount(donateAmount) || isDonating}
              className="nb-insurance-button-accent w-full py-3 font-bold disabled:opacity-50"
            >
              {isDonating ? '⏳ Contributing...' : '💝 Contribute to Coverage Pool'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}