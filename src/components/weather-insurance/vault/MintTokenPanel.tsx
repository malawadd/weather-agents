import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { MTOKEN_ABI } from '../../../constants/mtokenAbi';
import { useToast } from '../../../hooks/useToast';

interface MintTokenPanelProps {
  mtokenAddress: `0x${string}`;
  mtokenSymbol: string;
  mtokenDecimals: number;
  onTransactionSuccess: () => void;
}

export function MintTokenPanel({
  mtokenAddress,
  mtokenSymbol,
  mtokenDecimals,
  onTransactionSuccess
}: MintTokenPanelProps) {
  const [amount, setAmount] = useState('');
  const { address } = useAccount();
  const { showSuccess, showError } = useToast();

  // Read total supply for display
  const { data: totalSupply = 0n } = useReadContract({
    address: mtokenAddress,
    abi: MTOKEN_ABI,
    functionName: 'totalSupply',
  });

  // Write contract
  const { writeContract: writeMint, data: mintHash } = useWriteContract();

  // Wait for transaction
  const { isLoading: isMinting } = useWaitForTransactionReceipt({
    hash: mintHash,
    onSuccess: () => {
      showSuccess(`Successfully minted ${amount} ${mtokenSymbol} tokens!`);
      setAmount('');
      onTransactionSuccess();
    },
    onError: () => {
      showError('Minting failed. Please try again.');
    }
  });

  const handleMint = () => {
    if (!amount || !address) return;
    
    try {
      const amountBigInt = parseUnits(amount, mtokenDecimals);
      writeMint({
        address: mtokenAddress,
        abi: MTOKEN_ABI,
        functionName: 'mint',
        args: [address, amountBigInt],
      });
    } catch (error) {
      showError('Invalid amount entered.');
    }
  };

  const isValidAmount = () => {
    if (!amount) return false;
    try {
      const amountBigInt = parseUnits(amount, mtokenDecimals);
      return amountBigInt > 0n;
    } catch {
      return false;
    }
  };

  const formatTotalSupply = () => {
    const formatted = formatUnits(totalSupply, mtokenDecimals);
    const num = parseFloat(formatted);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toFixed(2);
  };

  return (
    <div className="nb-betting-panel-white p-6">
      <h2 className="text-xl font-bold mb-4">🏭 Mint {mtokenSymbol} Tokens</h2>
      
      {/* Token Info */}
      <div className="nb-betting-panel-accent p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm mb-1">💎 {mtokenSymbol} Token</h3>
            <p className="text-xs text-gray-600">ERC20 Mock Token for Testing</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">Total Supply</p>
            <p className="text-lg font-bold">{formatTotalSupply()}</p>
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block font-bold mb-2">
          Amount to Mint ({mtokenSymbol})
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1000"
          className="nb-betting-input w-full px-4 py-3 text-lg"
          disabled={isMinting}
        />
        <p className="text-xs text-gray-600 mt-1">
          Enter the amount of {mtokenSymbol} tokens you want to mint
        </p>
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {['100', '1000', '10000', '100000'].map((quickAmount) => (
          <button
            key={quickAmount}
            onClick={() => setAmount(quickAmount)}
            className="nb-betting-button px-3 py-2 text-sm font-bold"
            disabled={isMinting}
          >
            {quickAmount}
          </button>
        ))}
      </div>

      {/* Mint Button */}
      <button
        onClick={handleMint}
        disabled={!isValidAmount() || isMinting}
        className="nb-betting-button-success w-full py-3 font-bold disabled:opacity-50"
      >
        {isMinting ? '⏳ Minting...' : `🏭 Mint ${amount || '0'} ${mtokenSymbol}`}
      </button>

      {/* Info Panel */}
      <div className="nb-betting-panel p-3 mt-4">
        <h4 className="font-bold text-sm mb-2">ℹ️ About Token Minting:</h4>
        <ul className="text-xs space-y-1">
          <li>• This is a test token for demonstration purposes</li>
          <li>• Anyone can mint tokens using this interface</li>
          <li>• Minted tokens will be sent to your wallet</li>
          <li>• Use these tokens to deposit into the vault</li>
          <li>• No gas fees required for minting (mock contract)</li>
        </ul>
      </div>

      {/* Warning */}
      <div className="nb-betting-panel-warning p-3 mt-4">
        <p className="text-xs font-bold">
          ⚠️ Test Environment: This is a mock ERC20 token for testing purposes only. 
          In production, token minting would typically be restricted to authorized addresses.
        </p>
      </div>
    </div>
  );
}