import React from 'react';
import { formatUnits } from 'viem';

interface UserVaultBalanceProps {
  mtokenBalance: bigint;
  mtokenSymbol: string;
  mtokenDecimals: number;
  vaultBalance: bigint;
  vaultSymbol: string;
  vaultDecimals: number;
  isLoading?: boolean;
}

export function UserVaultBalance({
  mtokenBalance,
  mtokenSymbol,
  mtokenDecimals,
  vaultBalance,
  vaultSymbol,
  vaultDecimals,
  isLoading
}: UserVaultBalanceProps) {
  const formatBalance = (balance: bigint, decimals: number) => {
    const formatted = formatUnits(balance, decimals);
    const num = parseFloat(formatted);
    return num.toFixed(4);
  };

  return (
    <div className="nb-betting-panel-white p-6">
      <h2 className="text-xl font-bold mb-4">👤 Your Balances</h2>
      
      <div className="space-y-4">
        {/* MToken Balance */}
        <div className="nb-betting-panel-accent p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm mb-1">💎 {mtokenSymbol} Balance</h3>
              <p className="text-xs text-gray-600">Available for deposits</p>
            </div>
            <div className="text-right">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-300 rounded w-20"></div>
                </div>
              ) : (
                <p className="text-xl font-bold">
                  {formatBalance(mtokenBalance, mtokenDecimals)}
                </p>
              )}
              <p className="text-xs text-gray-600">{mtokenSymbol}</p>
            </div>
          </div>
        </div>

        {/* Kiyan Tickets Balance */}
        <div className="nb-betting-panel-success p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm mb-1">🎫 {vaultSymbol} Tickets</h3>
              <p className="text-xs text-gray-600">Betting tickets earned</p>
            </div>
            <div className="text-right">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-300 rounded w-20"></div>
                </div>
              ) : (
                <p className="text-xl font-bold">
                  {formatBalance(vaultBalance, vaultDecimals)}
                </p>
              )}
              <p className="text-xs text-gray-600">{vaultSymbol}</p>
            </div>
          </div>
        </div>

        {/* Balance Summary */}
        <div className="nb-betting-panel p-3">
          <h4 className="font-bold text-sm mb-2">💡 Balance Info</h4>
          <ul className="text-xs space-y-1">
            <li>• Deposit {mtokenSymbol} to mint {vaultSymbol} tickets</li>
            <li>• Use {vaultSymbol} tickets for weather betting</li>
            <li>• Redeem tickets back to {mtokenSymbol} anytime</li>
            <li>• Donate yield to increase the prize pool</li>
          </ul>
        </div>
      </div>
    </div>
  );
}