import React from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { VAULT_CONTRACT_ADDRESS, MTOKEN_CONTRACT_ADDRESS } from '../../constants/contractAddresses';
import { VAULT_ABI } from '../../constants/vaultAbi';
import { ERC20_ABI } from '../../constants/erc20Abi';
import { VaultOverview } from '../../components/betting/vault/VaultOverview';
import { UserVaultBalance } from '../../components/betting/vault/UserVaultBalance';
import { DepositDonatePanel } from '../../components/betting/vault/DepositDonatePanel';
import { RedeemMintPanel } from '../../components/betting/vault/RedeemMintPanel';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/ui/ToastContainer';

export function VaultPage() {
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
    abi: ERC20_ABI,
    functionName: 'symbol',
  });

  const { data: mtokenDecimals = 18, isLoading: isLoadingMtokenDecimals } = useReadContract({
    address: MTOKEN_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  // User balance reads
  const { data: mtokenBalance = 0n, isLoading: isLoadingMtokenBalance, refetch: refetchMtokenBalance } = useReadContract({
    address: MTOKEN_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
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
        <div className="nb-betting-panel-warning p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">🔒 Wallet Connection Required</h2>
          <p className="mb-4">
            Please connect your wallet to access the vault and manage your Kiyan tickets.
          </p>
          <p className="text-sm text-gray-600">
            You'll need a connected wallet to deposit tokens, mint tickets, and participate in weather betting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 space-y-6">
      {/* Page Header */}
      <div className="nb-betting-panel-white p-6">
        <h1 className="text-3xl font-bold mb-2">🏦 Kiyan Prize Vault</h1>
        <p className="text-gray-600">
          Deposit tokens to mint Kiyan tickets for weather betting, or donate to increase the prize pool.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Vault Overview */}
        <div className="lg:col-span-1">
          <VaultOverview
            totalAssets={totalAssets}
            vaultSymbol={vaultSymbol}
            vaultName={vaultName}
            vaultDecimals={vaultDecimals}
            isLoading={isLoading}
          />
        </div>

        {/* Middle Column - User Balances */}
        <div className="lg:col-span-1">
          <UserVaultBalance
            mtokenBalance={mtokenBalance}
            mtokenSymbol={mtokenSymbol}
            mtokenDecimals={mtokenDecimals}
            vaultBalance={vaultBalance}
            vaultSymbol={vaultSymbol}
            vaultDecimals={vaultDecimals}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column - Actions */}
        <div className="lg:col-span-1 space-y-6">
          <DepositDonatePanel
            vaultAddress={VAULT_CONTRACT_ADDRESS}
            mtokenAddress={MTOKEN_CONTRACT_ADDRESS}
            mtokenBalance={mtokenBalance}
            mtokenDecimals={mtokenDecimals}
            mtokenSymbol={mtokenSymbol}
            onTransactionSuccess={handleTransactionSuccess}
          />
        </div>
      </div>

      {/* Bottom Section - Mint/Redeem */}
      <div className="max-w-2xl mx-auto">
        <RedeemMintPanel
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

      {/* Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="nb-betting-panel-accent p-6">
          <h3 className="text-xl font-bold mb-4">🎯 How the Vault Works</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start space-x-2">
              <span>💎</span>
              <span>Deposit {mtokenSymbol} tokens to mint Kiyan tickets</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>🎫</span>
              <span>Use Kiyan tickets for weather betting</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>🏆</span>
              <span>Win prizes from the community prize pool</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>💸</span>
              <span>Redeem tickets back to {mtokenSymbol} anytime</span>
            </li>
          </ul>
        </div>

        <div className="nb-betting-panel-success p-6">
          <h3 className="text-xl font-bold mb-4">💝 Community Prize Pool</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start space-x-2">
              <span>🤝</span>
              <span>Donations increase rewards for all players</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>🎁</span>
              <span>Bigger prize pools attract more participants</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>🌟</span>
              <span>Support the weather betting community</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>📈</span>
              <span>Help grow the platform ecosystem</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Contract Information */}
      <div className="nb-betting-panel p-6">
        <h3 className="text-lg font-bold mb-4">📋 Contract Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-bold mb-1">Vault Contract:</p>
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