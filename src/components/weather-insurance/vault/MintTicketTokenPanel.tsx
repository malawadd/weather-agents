import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { MTOKEN_ABI } from '../../../constants/mtokenAbi';
import { useToast } from '../../../hooks/useToast';

interface MintTicketTokenPanelProps {
  mtokenAddress: string;
  mtokenSymbol: string;
  mtokenDecimals: number;
  onTransactionSuccess: () => void;
}

export function MintTicketTokenPanel({ 
  mtokenAddress, 
  mtokenSymbol, 
  mtokenDecimals,
  onTransactionSuccess 
}: MintTicketTokenPanelProps) {
  const [mintAmount, setMintAmount] = useState('');
  const { address } = useAccount();
  const { showSuccess, showError } = useToast();

  // Write contract
  const { writeContract: mint, data: mintHash } = useWriteContract();

  // Transaction state
  const { isLoading: isMinting } = useWaitForTransactionReceipt({
    hash: mintHash,
    onSuccess: () => {
      showSuccess(`${mtokenSymbol} tokens minted successfully! You can now use them for insurance premiums.`);
      setMintAmount('');
      onTransactionSuccess();
    },
    onError: () => {
      showError('Minting failed. Please try again.');
    }
  });

  const handleMint = () => {
    if (!mintAmount || !address) return;
    
    try {
      const amount = parseUnits(mintAmount, mtokenDecimals);
      mint({
        address: mtokenAddress,
        abi: MTOKEN_ABI,
        functionName: 'mint',
        args: [address, amount],
      });
    } catch (error) {
      showError('Invalid mint amount.');
    }
  };

  const isValidAmount = () => {
    if (!mintAmount) return false;
    try {
      const amount = parseUnits(mintAmount, mtokenDecimals);
      return amount > 0n;
    } catch {
      return false;
    }
  };

  return (
    <div className="nb-insurance-panel-warning p-6">
      <h3 className="text-xl font-bold mb-4">🪙 Mint {mtokenSymbol} Tokens</h3>
      <p className="text-sm text-gray-600 mb-4">
        Mint {mtokenSymbol} tokens for testing purposes. In production, you would acquire these through legitimate means for insurance premiums.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block font-bold mb-2">Mint Amount ({mtokenSymbol})</label>
          <input
            type="number"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
            placeholder="1000"
            className="nb-betting-input w-full px-4 py-3"
            className="nb-insurance-input w-full px-4 py-3"
            disabled={isMinting}
          />
          <p className="text-xs text-gray-600 mt-1">
            Mint tokens to your wallet for testing insurance features
          </p>
        </div>

        <button
          onClick={handleMint}
          disabled={!isValidAmount() || isMinting}
          className="nb-insurance-button-warning w-full py-3 font-bold disabled:opacity-50"
        >
          {isMinting ? '⏳ Minting...' : `🪙 Mint ${mtokenSymbol} Tokens`}
        </button>
      </div>

      {/* Warning */}
      <div className="nb-insurance-panel p-3 mt-4">
        <h4 className="font-bold text-sm mb-2">⚠️ Testing Only:</h4>
        <p className="text-xs">
          This minting function is for testing purposes only. In a production environment, 
          tokens would be acquired through legitimate means for insurance premiums.
        </p>
      </div>
    </div>
  );
}