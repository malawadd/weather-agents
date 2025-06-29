import React from 'react';
import { Link } from 'react-router-dom';
import { WalletConnection } from '../../WalletConnection';

interface StationsNavigationProps {
  user: any;
  isGuest: boolean;
  signOut: () => void;
}

export function StationsNavigation({ user, isGuest, signOut }: StationsNavigationProps) {
  return (
    <nav className="nb-panel-white p-4 m-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold">🤖 Kiyan</h1>
          <div className="flex space-x-6">
            <Link to="/" className="font-bold text-gray-600 hover:text-black hover:underline">
              Dashboard
            </Link>
            {!isGuest && (
              <>
                <Link to="/create-agent" className="font-bold text-gray-600 hover:text-black hover:underline">
                  Import Agent
                </Link>
                <Link to="/my-agents" className="font-bold text-gray-600 hover:text-black hover:underline">
                  My Agents
                </Link>
              </>
            )}
            <Link to="/stations" className="font-bold text-black hover:underline">
              Weather Stations
            </Link>
            {!isGuest && (
              <Link to="/my-stations" className="font-bold text-gray-600 hover:text-black hover:underline">
                My Stations
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-bold">
            Welcome, {user?.name || 'Trader'}!
            {isGuest && <span className="text-sm text-gray-600"> (Guest)</span>}
          </span>
          {!isGuest && <WalletConnection />}
          <button onClick={signOut} className="nb-button px-4 py-2 text-sm font-bold">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}