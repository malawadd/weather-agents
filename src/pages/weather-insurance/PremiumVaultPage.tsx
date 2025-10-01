/* eslint-disable @typescript-eslint/no-floating-promises */
import React from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { VAULT_CONTRACT_ADDRESS, MTOKEN_CONTRACT_ADDRESS } from '../../constants/contractAddresses';
import { VAULT_ABI } from '../../constants/vaultAbi';
import { MTOKEN_ABI } from '../../constants/mtokenAbi';
import { PremiumVaultOverview } from '../../components/weather-insurance/vault/PremiumVaultOverview';
import { UserPremiumBalance } from '../../components/weather-insurance/vault/UserPremiumBalance';
import { DepositPremiumPanel } from '../../components/weather-insurance/vault/DepositPremiumPanel';
import { RedeemMintTicketPanel } from '../../components/weather-insurance/vault/RedeemMintTicketPanel';
import { MintTicketTokenPanel } from '../../components/weather-insurance/vault/MintTicketTokenPanel';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/ui/ToastContainer';

export function PremiumVaultPage() {
  const { address, isConnected } = useAccount();
  const { toasts, hideToast } = useToast();

  // Vault contract reads
  const { data: vaultName = '', isLoading: isLoadingVaultName } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'name',
  });

  const { data: vaultSymbol = '', isLoading: isLoadingVaultSymbol } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'symbol',
  });

  const { data: vaultDecimals = 18, isLoading: isLoadingVaultDecimals } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'decimals',
  });

  const { data: totalAssets = 0n, isLoading: isLoadingTotalAssets, refetch: refetchTotalAssets } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'totalAssets',
  });

  // MToken contract reads
  const { data: mtokenSymbol = '', isLoading: isLoadingMtokenSymbol } = useReadContract({
    address: MTOKEN_CONTRACT_ADDRESS,
    abi: MTOKEN_ABI,
    functionName: 'symbol',
  });

  const { data: mtokenDecimals = 18, isLoading: isLoadingMtokenDecimals } = useReadContract({
    address: MTOKEN_CONTRACT_ADDRESS,
    abi: MTOKEN_ABI,
    functionName: 'decimals',
  });

  // User balance reads
  const { data: mtokenBalance = 0n, isLoading: isLoadingMtokenBalance, refetch: refetchMtokenBalance } = useReadContract({
    address: MTOKEN_CONTRACT_ADDRESS,
    abi: MTOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: vaultBalance = 0n, isLoading: isLoadingVaultBalance, refetch: refetchVaultBalance } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const isLoading = isLoadingVaultName || isLoadingVaultSymbol || isLoadingVaultDecimals || 
                   isLoadingTotalAssets || isLoadingMtokenSymbol || isLoadingMtokenDecimals ||
                   isLoadingMtokenBalance || isLoadingVaultBalance;

  const handleTransactionSuccess = () => {
    // Refetch all relevant data after successful transactions
    refetchTotalAssets();
    refetchMtokenBalance();
    refetchVaultBalance();
  };

  if (!isConnected) {
    return (
      <div className="w-full px-4">
        <div className="nb-insurance-panel-warning p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">🔒 Wallet Connection Required</h2>
          <p className="mb-4">
            Please connect your wallet to access the premium vault and manage your insurance tokens.
          </p>
          <p className="text-sm text-gray-600">
            You'll need a connected wallet to deposit premiums, mint tickets, and purchase insurance policies.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 space-y-6">
      {/* Page Header */}
      <div className="nb-insurance-panel-white p-6">
        <h1 className="text-3xl font-bold mb-2">🏦 Kiyan Premium Vault</h1>
        <p className="text-gray-600">
          Deposit tokens to mint Kiyan tickets for purchasing weather insurance policies, or contribute to the community coverage pool.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Balances */}
        <div className="lg:col-span-1">
          <UserPremiumBalance
            mtokenBalance={mtokenBalance}
            mtokenSymbol={mtokenSymbol}
            mtokenDecimals={mtokenDecimals}
            vaultBalance={vaultBalance}
            vaultSymbol={vaultSymbol}
            vaultDecimals={vaultDecimals}
            isLoading={isLoading}
          />
        </div>

        {/* Vault Overview */}
        <div className="lg:col-span-1">
          <PremiumVaultOverview
            totalAssets={totalAssets}
            vaultSymbol={vaultSymbol}
            vaultName={vaultName}
            vaultDecimals={vaultDecimals}
            isLoading={isLoading}
          />
        </div>

        {/* Mint Tokens */}
        <div className="lg:col-span-1 space-y-6">
          <DepositPremiumPanel
            vaultAddress={VAULT_CONTRACT_ADDRESS}
            mtokenAddress={MTOKEN_CONTRACT_ADDRESS}
            mtokenBalance={mtokenBalance}
            mtokenDecimals={mtokenDecimals}
            mtokenSymbol={mtokenSymbol}
            onTransactionSuccess={handleTransactionSuccess}
          />
        </div>

        {/* Mint Token Panel */}
        <div className="lg:col-span-1">
          <MintTicketTokenPanel
            mtokenAddress={MTOKEN_CONTRACT_ADDRESS}
            mtokenSymbol={mtokenSymbol}
            mtokenDecimals={mtokenDecimals}
            onTransactionSuccess={handleTransactionSuccess}
          />
        </div>

        {/* Redeem/Mint Panel */}
        <div className="lg:col-span-1 space-y-6">
          <RedeemMintTicketPanel
            vaultAddress={VAULT_CONTRACT_ADDRESS}
            mtokenAddress={MTOKEN_CONTRACT_ADDRESS}
            vaultBalance={vaultBalance}
            vaultDecimals={vaultDecimals}
            vaultSymbol={vaultSymbol}
            mtokenSymbol={mtokenSymbol}
            mtokenDecimals={mtokenDecimals}
            onTransactionSuccess={handleTransactionSuccess}
          />
        </div>
      </div>

      {/* Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="nb-insurance-panel-accent p-6">
          <h3 className="text-xl font-bold mb-4">☔ How Insurance Works</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start space-x-2">
              <span>💎</span>
              <span>Deposit {mtokenSymbol} tokens to mint Kiyan tickets</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>🛡️</span>
              <span>Use Kiyan tickets to purchase weather insurance</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>🏆</span>
              <span>Receive automatic payouts when conditions are met</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>💸</span>
              <span>Redeem unused tickets back to {mtokenSymbol} anytime</span>
            </li>
          </ul>
        </div>

        <div className="nb-insurance-panel-success p-6">
          <h3 className="text-xl font-bold mb-4">💝 Community Coverage Pool</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start space-x-2">
              <span>🤝</span>
              <span>Contributions increase coverage for all policyholders</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>🎁</span>
              <span>Larger pools enable better coverage ratios</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>🌟</span>
              <span>Support the weather insurance community</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>📈</span>
              <span>Help grow the platform ecosystem</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Contract Information */}
      <div className="nb-insurance-panel p-6">
        <h3 className="text-lg font-bold mb-4">📋 Contract Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-bold mb-1">Premium Vault Contract:</p>
            <p className="font-mono text-xs break-all">{VAULT_CONTRACT_ADDRESS}</p>
          </div>
          <div>
            <p className="font-bold mb-1">Token Contract:</p>
            <p className="font-mono text-xs break-all">{MTOKEN_CONTRACT_ADDRESS}</p>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onHideToast={hideToast} />
    </div>
  );
}