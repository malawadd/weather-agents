import React from 'react';
import { formatUnits } from 'viem';

interface VaultOverviewProps {
  totalAssets: bigint;
  vaultSymbol: string;
  vaultName: string;
  vaultDecimals: number;
  isLoading?: boolean;
}

export function VaultOverview({ 
  totalAssets, 
  vaultSymbol, 
  vaultName, 
  vaultDecimals,
  isLoading 
}: VaultOverviewProps) {
  // Calculate fill percentage (assuming max capacity of 1M tokens for visual scaling)
  const maxCapacity = BigInt(1000000) * BigInt(10 ** vaultDecimals);
  const fillPercentage = totalAssets > 0n 
    ? Math.min(Number((totalAssets * 100n) / maxCapacity), 100)
    : 0;

  const formatAmount = (amount: bigint) => {
    const formatted = formatUnits(amount, vaultDecimals);
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
      <h2 className="text-2xl font-bold mb-6 text-center">🏦 Vault Overview</h2>
      
      {/* Vault Visual */}
      <div className="mb-6">
        <div className="relative mx-auto w-48 h-64 border-4 border-black rounded-lg bg-gray-100 overflow-hidden">
          {/* Vault Container */}
          <div className="absolute inset-2 border-2 border-gray-400 rounded bg-white">
            {/* Liquid Fill */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-400 to-blue-300 transition-all duration-1000 ease-out"
              style={{ height: `${fillPercentage}%` }}
            >
              {/* Animated bubbles effect */}
              {fillPercentage > 0 && (
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute w-2 h-2 bg-white rounded-full animate-bounce" style={{ left: '20%', bottom: '10%', animationDelay: '0s' }} />
                  <div className="absolute w-1 h-1 bg-white rounded-full animate-bounce" style={{ left: '60%', bottom: '30%', animationDelay: '0.5s' }} />
                  <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ left: '80%', bottom: '20%', animationDelay: '1s' }} />
                </div>
              )}
            </div>
            
            {/* Fill Level Indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-700">
                  {fillPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Full</div>
              </div>
            </div>
          </div>
          
          {/* Vault Label */}
          <div className="absolute -bottom-8 left-0 right-0 text-center">
            <div className="nb-betting-panel-accent px-3 py-1 inline-block">
              <span className="font-bold text-sm">Prize Vault</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vault Stats */}
      <div className="space-y-4">
        <div className="nb-betting-panel-success p-4 text-center">
          <h3 className="font-bold text-sm mb-2">💰 TOTAL ASSETS</h3>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-24 mx-auto"></div>
            </div>
          ) : (
            <p className="text-2xl font-bold">
              {formatAmount(totalAssets)} {vaultSymbol}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="nb-betting-panel p-3 text-center">
            <h4 className="font-bold text-xs mb-1">VAULT NAME</h4>
            <p className="text-sm font-bold">{vaultName}</p>
          </div>
          <div className="nb-betting-panel p-3 text-center">
            <h4 className="font-bold text-xs mb-1">CAPACITY</h4>
            <p className="text-sm font-bold">{fillPercentage.toFixed(1)}%</p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="nb-betting-panel p-3">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span>Vault Capacity</span>
            <span>{fillPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-black">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}