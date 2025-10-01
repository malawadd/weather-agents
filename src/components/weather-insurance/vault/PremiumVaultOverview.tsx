import React from 'react';
import { formatUnits } from 'viem';

interface PremiumVaultOverviewProps {
  totalAssets: bigint;
  vaultSymbol: string;
  vaultName: string;
  vaultDecimals: number;
  isLoading: boolean;
}

export function PremiumVaultOverview({ 
  totalAssets, 
  vaultSymbol, 
  vaultName, 
  vaultDecimals, 
  isLoading 
}: PremiumVaultOverviewProps) {
  if (isLoading) {
    return (
      <div className="nb-betting-panel-white p-6">
        <h3 className="text-xl font-bold mb-4">🏦 Premium Vault Overview</h3>
        <div className="text-center py-4">
          <p className="font-medium">Loading vault data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nb-insurance-panel-white p-6">
      <h3 className="text-xl font-bold mb-4">🏦 Premium Vault Overview</h3>
      
      <div className="space-y-4">
        <div className="nb-insurance-panel-accent p-4">
          <h4 className="font-bold text-sm mb-1">🏛️ Vault Name</h4>
          <p className="text-lg font-bold">{vaultName || 'Kiyan Premium Vault'}</p>
        </div>

        <div className="nb-insurance-panel-success p-4">
          <h4 className="font-bold text-sm mb-1">💰 Total Assets</h4>
          <p className="text-2xl font-bold">
            {formatUnits(totalAssets, vaultDecimals)} {vaultSymbol}
          </p>
          <p className="text-xs text-gray-600">Total value locked in vault</p>
        </div>

        <div className="nb-insurance-panel p-4">
          <h4 className="font-bold text-sm mb-1">🎫 Vault Token</h4>
          <p className="text-lg font-bold">{vaultSymbol}</p>
          <p className="text-xs text-gray-600">Insurance ticket token</p>
        </div>
      </div>

      {/* Vault Stats */}
      <div className="mt-6 pt-4 border-t-4 border-black">
        <h4 className="font-bold text-sm mb-3">📊 Vault Statistics</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="text-center">
            <p className="font-bold">Active Policies</p>
            <p className="text-lg font-bold">12</p>
          </div>
          <div className="text-center">
            <p className="font-bold">Total Coverage</p>
            <p className="text-lg font-bold">$2.5M</p>
          </div>
        </div>
      </div>
    </div>
  );
}