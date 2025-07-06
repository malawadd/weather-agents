import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { VAULT_ABI } from '../../../constants/vaultAbi';
import { ERC20_ABI } from '../../../constants/erc20Abi';
import { useToast } from '../../../hooks/useToast';

interface RedeemMintPanelProps {
  vaultAddress: `0x${string}`;
  mtokenAddress: `0x${string}`;
  vaultBalance: bigint;
  vaultDecimals: number;
  vaultSymbol: string;
  mtokenSymbol: string;
  mtokenDecimals: number;
  onTransactionSuccess: () => void;
}

export function RedeemMintPanel({
  vaultAddress,
  mtokenAddress,
  vaultBalance,
  vaultDecimals,
  vaultSymbol,
  mtokenSymbol,
  mtokenDecimals,
  onTransactionSuccess
}: RedeemMintPanelProps) {
  const [activeTab, setActiveTab] = useState<'mint' | 'redeem'>('mint');
  const [amount, setAmount] = useState('');
  const { address } = useAccount();
  const { showSuccess, showError } = useToast();

  // Read conversion rates
  const { data: previewMint = 0n } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'previewMint',
    args: amount ? [parseUnits(amount, vaultDecimals)] : [0n],
  });

  const { data: previewRedeem = 0n } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'previewRedeem',
    args: amount ? [parseUnits(amount, vaultDecimals)] : [0n],
  });

  // Read allowance for minting
  const { data: allowance = 0n } = useReadContract({
    address: mtokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, vaultAddress] : undefined,
  });

  // Read mtoken balance for minting
  const { data: mtokenBalance = 0n } = useReadContract({
    address: mtokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Write contracts
  const { writeContract: writeApprove, data: approveHash } = useWriteContract();
  const { writeContract: writeMint, data: mintHash } = useWriteContract();
  const { writeContract: writeRedeem, data: redeemHash } = useWriteContract();

  // Wait for transactions
  const { isLoading: isApproving } = useWaitForTransactionReceipt({
    hash: approveHash,
    onSuccess: () => {
      showSuccess('Approval successful! You can now proceed with minting.');
    },
    onError: () => {
      showError('Approval failed. Please try again.');
    }
  });

  const { isLoading: isMinting } = useWaitForTransactionReceipt({
    hash: mintHash,
    onSuccess: () => {
      showSuccess('Minting successful! Kiyan tickets have been minted to your wallet.');
      setAmount('');
      onTransactionSuccess();
    },
    onError: () => {
      showError('Minting failed. Please try again.');
    }
  });

  const { isLoading: isRedeeming } = useWaitForTransactionReceipt({
    hash: redeemHash,
    onSuccess: () => {
      showSuccess('Redemption successful! Tokens have been returned to your wallet.');
      setAmount('');
      onTransactionSuccess();
    },
    onError: () => {
      showError('Redemption failed. Please try again.');
    }
  });

  const isLoading = isApproving || isMinting || isRedeeming;

  const handleMaxClick = () => {
    if (activeTab === 'redeem' && vaultBalance > 0n) {
      setAmount(formatUnits(vaultBalance, vaultDecimals));
    } else if (activeTab === 'mint' && mtokenBalance > 0n) {
      setAmount(formatUnits(mtokenBalance, mtokenDecimals));
    }
  };

  const handleApprove = () => {
    if (!amount || !address) return;
    
    try {
      const amountBigInt = parseUnits(amount, mtokenDecimals);
      writeApprove({
        address: mtokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [vaultAddress, amountBigInt],
      });
    } catch (error) {
      showError('Invalid amount entered.');
    }
  };

  const handleMint = () => {
    if (!amount || !address) return;
    
    try {
      const sharesBigInt = parseUnits(amount, vaultDecimals);
      writeMint({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'mint',
        args: [sharesBigInt, address],
      });
    } catch (error) {
      showError('Invalid amount entered.');
    }
  };

  const handleRedeem = () => {
    if (!amount || !address) return;
    
    try {
      const sharesBigInt = parseUnits(amount, vaultDecimals);
      writeRedeem({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'redeem',
        args: [sharesBigInt, address, address],
      });
    } catch (error) {
      showError('Invalid amount entered.');
    }
  };

  const needsApproval = () => {
    if (activeTab !== 'mint' || !amount) return false;
    try {
      return allowance < previewMint;
    } catch {
      return false;
    }
  };

  const isValidAmount = () => {
    if (!amount) return false;
    try {
      const amountBigInt = parseUnits(amount, vaultDecimals);
      if (activeTab === 'mint') {
        return amountBigInt > 0n && previewMint <= mtokenBalance;
      } else {
        return amountBigInt > 0n && amountBigInt <= vaultBalance;
      }
    } catch {
      return false;
    }
  };

  return (
    <div className="nb-betting-panel-white p-6">
      <h2 className="text-xl font-bold mb-4">🎫 Mint & Redeem Tickets</h2>
      
      {/* Tab Selection */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('mint')}
          className={`flex-1 py-3 px-4 font-bold ${
            activeTab === 'mint' 
              ? 'nb-betting-button-success' 
              : 'nb-betting-button'
          }`}
        >
          ⚡ Mint
        </button>
        <button
          onClick={() => setActiveTab('redeem')}
          className={`flex-1 py-3 px-4 font-bold ${
            activeTab === 'redeem' 
              ? 'nb-betting-button-success' 
              : 'nb-betting-button'
          }`}
        >
          💸 Redeem
        </button>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block font-bold mb-2">
          Amount ({activeTab === 'mint' ? vaultSymbol : vaultSymbol})
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
          Available: {activeTab === 'mint' 
            ? formatUnits(mtokenBalance, mtokenDecimals) + ' ' + mtokenSymbol
            : formatUnits(vaultBalance, vaultDecimals) + ' ' + vaultSymbol
          }
        </p>
      </div>

      {/* Conversion Preview */}
      {amount && (
        <div className="nb-betting-panel-accent p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm">
              {activeTab === 'mint' ? 'Cost:' : 'You receive:'}
            </span>
            <span className="font-bold">
              {activeTab === 'mint' 
                ? `${formatUnits(previewMint, mtokenDecimals)} ${mtokenSymbol}`
                : `${formatUnits(previewRedeem, mtokenDecimals)} ${mtokenSymbol}`
              }
            </span>
          </div>
        </div>
      )}

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
          onClick={activeTab === 'mint' ? handleMint : handleRedeem}
          disabled={!isValidAmount() || needsApproval() || isLoading}
          className="nb-betting-button-success w-full py-3 font-bold disabled:opacity-50"
        >
          {isLoading && !isApproving
            ? `⏳ ${activeTab === 'mint' ? 'Minting' : 'Redeeming'}...`
            : activeTab === 'mint'
            ? '⚡ Mint Tickets'
            : '💸 Redeem to Tokens'
          }
        </button>
      </div>

      {/* Help Text */}
      <div className="nb-betting-panel p-3 mt-4">
        <h4 className="font-bold text-sm mb-2">ℹ️ How it works:</h4>
        <ul className="text-xs space-y-1">
          {activeTab === 'mint' ? (
            <>
              <li>• Specify how many {vaultSymbol} tickets to mint</li>
              <li>• Pay the required {mtokenSymbol} tokens</li>
              <li>• Receive {vaultSymbol} tickets for betting</li>
              <li>• Exchange rate may vary based on vault performance</li>
            </>
          ) : (
            <>
              <li>• Redeem {vaultSymbol} tickets back to {mtokenSymbol}</li>
              <li>• Get {mtokenSymbol} tokens returned to your wallet</li>
              <li>• Exchange rate may vary based on vault performance</li>
              <li>• Redeemed tickets are burned permanently</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}