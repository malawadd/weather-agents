import React from 'react';
import { formatUnits } from 'viem';

interface UserPremiumBalanceProps {
  mtokenBalance: bigint;
  mtokenSymbol: string;
  mtokenDecimals: number;
  vaultBalance: bigint;
  vaultSymbol: string;
  vaultDecimals: number;
  isLoading: boolean;
}

export function UserPremiumBalance({ 
  mtokenBalance, 
  mtokenSymbol, 
  mtokenDecimals,
  vaultBalance,
  vaultSymbol,
  vaultDecimals,
  isLoading 
}: UserPremiumBalanceProps) {
  if (isLoading) {
    return (
      <div className="nb-betting-panel-white p-6">
        <h3 className="text-xl font-bold mb-4">💰 Your Balances</h3>
        <div className="text-center py-4">
          <p className="font-medium">Loading balances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nb-betting-panel-white p-6">
      <h3 className="text-xl font-bold mb-4">💰 Your Insurance Balances</h3>
      
      <div className="space-y-4">
        {/* MToken Balance */}
        <div className="nb-betting-panel-success p-4">
          <h4 className="font-bold text-sm mb-1">💎 {mtokenSymbol} Tokens</h4>
          <p className="text-2xl font-bold">
            {formatUnits(mtokenBalance, mtokenDecimals)}
          </p>
          <p className="text-xs text-gray-600">Available for premium deposits</p>
        </div>

        {/* Vault Tickets Balance */}
        <div className="nb-betting-panel-accent p-4">
          <h4 className="font-bold text-sm mb-1">🎫 {vaultSymbol} Insurance Tickets</h4>
          <p className="text-2xl font-bold">
            {formatUnits(vaultBalance, vaultDecimals)}
          </p>
          <p className="text-xs text-gray-600">Available for purchasing policies</p>
        </div>
      </div>

      {/* Balance Actions */}
      <div className="mt-6 pt-4 border-t-4 border-black">
        <h4 className="font-bold text-sm mb-3">⚡ Portfolio Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Total Portfolio Value:</span>
            <span className="font-bold">
              {(Number(formatUnits(mtokenBalance, mtokenDecimals)) + 
                Number(formatUnits(vaultBalance, vaultDecimals))).toFixed(4)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Insurance Ready:</span>
            <span className="font-bold text-green-600">
              {formatUnits(vaultBalance, vaultDecimals)} {vaultSymbol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}