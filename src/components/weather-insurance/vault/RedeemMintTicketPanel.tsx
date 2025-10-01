import React, { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { VAULT_ABI } from '../../../constants/vaultAbi';
import { useToast } from '../../../hooks/useToast';

interface RedeemMintTicketPanelProps {
  vaultAddress: string;
  mtokenAddress: string;
  vaultBalance: bigint;
  vaultDecimals: number;
  vaultSymbol: string;
  mtokenSymbol: string;
  mtokenDecimals: number;
  onTransactionSuccess: () => void;
}

export function RedeemMintTicketPanel({ 
  vaultAddress,
  mtokenAddress,
  vaultBalance, 
  vaultDecimals, 
  vaultSymbol,
  mtokenSymbol,
  mtokenDecimals,
  onTransactionSuccess 
}: RedeemMintTicketPanelProps) {
  const [redeemAmount, setRedeemAmount] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const { showSuccess, showError } = useToast();

  // Write contracts
  const { writeContract: redeem, data: redeemHash } = useWriteContract();
  const { writeContract: mint, data: mintHash } = useWriteContract();

  // Transaction states
  const { isLoading: isRedeeming } = useWaitForTransactionReceipt({
    hash: redeemHash,
    onSuccess: () => {
      showSuccess(`Tickets redeemed successfully! ${mtokenSymbol} tokens sent to your wallet.`);
      setRedeemAmount('');
      onTransactionSuccess();
    },
    onError: () => {
      showError('Redemption failed. Please try again.');
    }
  });

  const { isLoading: isMinting } = useWaitForTransactionReceipt({
    hash: mintHash,
    onSuccess: () => {
      showSuccess(`Tickets minted successfully! ${vaultSymbol} tickets sent to your wallet.`);
      setMintAmount('');
      onTransactionSuccess();
    },
    onError: () => {
      showError('Minting failed. Please try again.');
    }
  });

  const handleRedeem = () => {
    if (!redeemAmount) return;
    
    try {
      const amount = parseUnits(redeemAmount, vaultDecimals);
      redeem({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'redeem',
        args: [amount, vaultAddress, vaultAddress], // shares, receiver, owner
      });
    } catch (error) {
      showError('Invalid redeem amount.');
    }
  };

  const handleMint = () => {
    if (!mintAmount) return;
    
    try {
      const amount = parseUnits(mintAmount, vaultDecimals);
      mint({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'mint',
        args: [amount, vaultAddress], // shares, receiver
      });
    } catch (error) {
      showError('Invalid mint amount.');
    }
  };

  const isValidRedeemAmount = () => {
    if (!redeemAmount) return false;
    try {
      const amount = parseUnits(redeemAmount, vaultDecimals);
      return amount > 0n && amount <= vaultBalance;
    } catch {
      return false;
    }
  };

  const isValidMintAmount = () => {
    if (!mintAmount) return false;
    try {
      const amount = parseUnits(mintAmount, vaultDecimals);
      return amount > 0n;
    } catch {
      return false;
    }
  };

  const handleMaxRedeem = () => {
    if (vaultBalance > 0n) {
      setRedeemAmount(formatUnits(vaultBalance, vaultDecimals));
    }
  };

  return (
    <div className="space-y-6">
      {/* Redeem Panel */}
      <div className="nb-betting-panel-white p-6">
        <h3 className="text-xl font-bold mb-4">💸 Redeem Tickets</h3>
        <p className="text-sm text-gray-600 mb-4">
          Convert your Kiyan tickets back to {mtokenSymbol} tokens.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block font-bold mb-2">Redeem Amount ({vaultSymbol})</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={redeemAmount}
                onChange={(e) => setRedeemAmount(e.target.value)}
                placeholder="0.0"
                className="nb-betting-input flex-1 px-4 py-3"
                disabled={isRedeeming}
              />
              <button
                onClick={handleMaxRedeem}
                className="nb-betting-button px-4 py-3 font-bold"
                disabled={isRedeeming}
              >
                MAX
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Available: {formatUnits(vaultBalance, vaultDecimals)} {vaultSymbol}
            </p>
          </div>

          <button
            onClick={handleRedeem}
            disabled={!isValidRedeemAmount() || isRedeeming}
            className="nb-betting-button w-full py-3 font-bold disabled:opacity-50"
          >
            {isRedeeming ? '⏳ Redeeming...' : `💸 Redeem to ${mtokenSymbol}`}
          </button>
        </div>
      </div>

      {/* Mint Panel */}
      <div className="nb-betting-panel-accent p-6">
        <h3 className="text-xl font-bold mb-4">🎫 Mint Additional Tickets</h3>
        <p className="text-sm text-gray-600 mb-4">
          Mint additional Kiyan tickets using the vault's mint function.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block font-bold mb-2">Mint Amount ({vaultSymbol})</label>
            <input
              type="number"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              placeholder="0.0"
              className="nb-betting-input w-full px-4 py-3"
              disabled={isMinting}
            />
          </div>

          <button
            onClick={handleMint}
            disabled={!isValidMintAmount() || isMinting}
            className="nb-betting-button-accent w-full py-3 font-bold disabled:opacity-50"
          >
            {isMinting ? '⏳ Minting...' : '🎫 Mint Tickets'}
          </button>
        </div>
      </div>
    </div>
  );
}