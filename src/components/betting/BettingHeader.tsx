import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../WalletAuthProvider';
import { WalletConnection } from '../../WalletConnection';

export function BettingHeader() {
  const { user, isGuest, signOut } = useAuth();

  return (
    <nav className="nb-betting-panel-white p-4 m-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">🎲 Kiyan Betting</h1>
            <Link to="/platform-selection" className="nb-betting-button px-3 py-1 text-sm font-bold">
              ← Platforms
            </Link>
          </div>
          <div className="flex space-x-6">
            <Link to="/weather-betting" className="font-bold text-black hover:underline">
              Active Bids
            </Link>
            <Link to="/weather-betting/vault" className="font-bold text-gray-600 hover:text-black hover:underline">
              Vault
            </Link>
            <Link to="/weather-betting/my-bets" className="font-bold text-gray-600 hover:text-black hover:underline">
              My Bets
            </Link>
            <Link to="/weather-betting/leaderboard" className="font-bold text-gray-600 hover:text-black hover:underline">
              Leaderboard
            </Link>
            <Link to="/weather-betting/rules" className="font-bold text-gray-600 hover:text-black hover:underline">
              Rules
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-bold">
            Welcome, {user?.name || 'Bettor'}!
            {isGuest && <span className="text-sm text-gray-600"> (Guest)</span>}
          </span>
          {!isGuest && <WalletConnection />}
          <button 
            onClick={signOut}
            className="nb-betting-button px-4 py-2 text-sm font-bold"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}