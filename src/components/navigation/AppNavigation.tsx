import React from 'react';
import { Link } from 'react-router-dom';
import { WalletConnection } from '../../WalletConnection';

interface AppNavigationProps {
  user: any;
  isGuest: boolean;
  signOut: () => void;
  currentPage?: string;
}

export function AppNavigation({ user, isGuest, signOut, currentPage = '' }: AppNavigationProps) {
  const getLinkClass = (page: string) => {
    return currentPage === page 
      ? "font-bold text-black hover:underline" 
      : "font-bold text-gray-600 hover:text-black hover:underline";
  };

  return (
    <nav className="nb-panel-white p-4 m-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">🤖 Kiyan</h1>
            <Link to="/platform-selection" className="nb-button px-3 py-1 text-sm font-bold">
              ← Platforms
            </Link>
          </div>
          <div className="flex space-x-6">
            <Link to="/weather-intelligence" className={getLinkClass('dashboard')}>
              Dashboard
            </Link>
            {!isGuest && (
              <>
                {/* <Link to="/weather-intelligence/create-agent" className={getLinkClass('create-agent')}>
                  Import Agent
                </Link>
                <Link to="/weather-intelligence/my-agents" className={getLinkClass('my-agents')}>
                  My Agents
                </Link> */}
              </>
            )}
            <Link to="/weather-intelligence/stations" className={getLinkClass('stations')}>
              Weather Stations
            </Link>
            {!isGuest && (
              <Link to="/weather-intelligence/my-stations" className={getLinkClass('my-stations')}>
                My Stations
              </Link>
            )}
            <Link to="/active-bids" className={getLinkClass('active-bids')}>
              Temperature Bets
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-bold">
            Welcome, {user?.name || 'Explorer'}!
            {isGuest && <span className="text-sm text-gray-600"> (Guest)</span>}
          </span>
          {!isGuest && <WalletConnection />}
          <button 
            onClick={signOut}
            className="nb-button px-4 py-2 text-sm font-bold"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}