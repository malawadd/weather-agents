import React from 'react';
import { getDefaultConfig, TomoEVMKitProvider } from '@tomo-inc/tomo-evm-kit';
import { metaMaskWallet, rainbowWallet, walletConnectWallet } from '@tomo-inc/tomo-evm-kit/wallets';
import { WagmiProvider } from 'wagmi';
import { filecoin  , filecoinCalibration  } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const config = getDefaultConfig({
  clientId: '9TJ5ODBE68qK0yY7F8FSn5cScSdZZ1btWx3hxKlwYAlsaTr91H2EIR7CtoP7Ap0Il6h2GHmkXqIYD92o3E2QqZyP',
  appName: 'Kiyan',
  projectId: 'c4f79cc821944d9680842e34466bfbd', // Updated with a valid WalletConnect project ID format
  chains: [filecoinCalibration, filecoin],
  ssr: false,
  wallets: [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet, 
        rainbowWallet, 
        walletConnectWallet,
      ],
    },
  ],
});

const queryClient = new QueryClient();

interface TomoProviderProps {
  children: React.ReactNode;
}

export function TomoProvider({ children }: TomoProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TomoEVMKitProvider>
          {children as any}
        </TomoEVMKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}