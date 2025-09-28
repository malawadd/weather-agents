import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { useAccount } from 'wagmi';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../WalletAuthProvider';
import { Id } from "../../convex/_generated/dataModel";
import { AgentProfile } from '../components/AgentProfile';
import { MintLicenseTokensPanel } from '../components/MintLicenseTokensPanel';

export function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { sessionId } = useAuth();
  const { address } = useAccount();
  const [buyAmount, setBuyAmount] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Query agent data
  const agent = useQuery(api.agents.getAgent, sessionId && id ? {
    sessionId,
    agentId: id as Id<"agents">
  } : "skip");

  const handleBuyShares = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // In a real app, this would:
      // 1. Call approve() on the token contract
      // 2. Wait for approval tx
      // 3. Call Story Protocol to transfer royalty tokens
      
      alert('Share purchase simulation complete!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleClaimRevenue = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Revenue claiming feature coming soon with Story Protocol integration!');
  };

  if (!agent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="nb-panel p-6 text-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 py-8">
        {/* Header */}
        <div className="nb-panel-white p-6">
          <h1 className="text-2xl font-bold mb-2">{agent.name}</h1>
          <p className="text-gray-600">{agent.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Agent Profile */}
          {agent.fleekData && (
            <AgentProfile fleekData={agent.fleekData} />
          )}

          {/* Right Column - Trading & Revenue Info */}
          <div className="space-y-6">
            {/* IP Information */}
            <div className="nb-panel p-6">
              <h2 className="text-xl font-bold mb-4">IP Information</h2>
              {agent.storyInfo ? (
                <div className="space-y-2">
                  <p>
                    <span className="font-bold">IP ID:</span>{' '}
                    {agent.storyInfo.ipId}
                  </p>
                  <p>
                    <span className="font-bold">Vault:</span>{' '}
                    {agent.storyInfo.vault}
                  </p>
                  {agent.tokenSale && (
                    <>
                      <p>
                        <span className="font-bold">Shares Available:</span>{' '}
                        {agent.tokenSale.amount}%
                      </p>
                      <p>
                        <span className="font-bold">Price per Share:</span>{' '}
                        {parseFloat(agent.tokenSale.priceWei) / 1e18} IP
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Not yet registered on Story Protocol</p>
              )}
            </div>

            {/* Mint License Tokens Section */}
            {agent.storyInfo && agent.storyInfo.ipId && agent.storyInfo.licenseTermsId && agent.storyInfo.vault && (
              <MintLicenseTokensPanel
                ipId={agent.storyInfo.ipId}
                licenseTermsId={agent.storyInfo.licenseTermsId}
                vault={agent.storyInfo.vault}
              />
            )}

            {/* Buy Shares Section */}
            {agent.tokenSale && agent.storyInfo && (
              <div className="nb-panel-accent p-6">
                <h2 className="text-xl font-bold mb-4">Buy Shares</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Amount (%)</label>
                    <input
                      type="number"
                      min="1"
                      max={agent.tokenSale.amount}
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(Number(e.target.value))}
                      className="nb-input w-full px-4 py-2"
                    />
                  </div>

                  <div className="nb-panel-white p-4">
                    <p className="font-bold">Total Cost</p>
                    <p className="text-2xl font-bold">
                      {(buyAmount * parseFloat(agent.tokenSale.priceWei) / 1e18).toFixed(4)} IP
                    </p>
                  </div>

                  <button
                    onClick={(e) => void handleBuyShares(e)}
                    disabled={!address}
                    className="nb-button-accent w-full py-3"
                  >
                    {address ? 'Buy Shares' : 'Connect Wallet to Buy'}
                  </button>
                </div>
              </div>
            )}

            {/* Claim Revenue Section */}
            <div className="nb-panel-success p-6">
              <h2 className="text-xl font-bold mb-4">Revenue</h2>
              <div className="space-y-4">
                <div className="nb-panel-white p-4">
                  <p className="font-bold">Claimable Revenue</p>
                  <p className="text-2xl font-bold">0.05 IP</p>
                </div>

                <button
                  onClick={(e) => void handleClaimRevenue(e)}
                  disabled={!address}
                  className="nb-button w-full py-3"
                >
                  Claim Revenue
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="nb-panel-warning p-4">
            <p className="text-sm font-bold">Error: {error}</p>
          </div>
        )}
    </div>
  );
}