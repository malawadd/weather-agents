import React from 'react';
import { Link } from 'react-router-dom';

export function BettingFooter() {
  return (
    <footer className="nb-betting-panel-white p-6 m-4 mt-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-3">🎲 Kiyan Betting</h3>
            <p className="text-sm text-gray-600">
              The future of weather prediction betting. Powered by real weather data and blockchain technology.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-3">Betting</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/weather-betting" className="hover:underline">Active Bids</Link></li>
              <li><Link to="/weather-betting/my-bets" className="hover:underline">My Bets</Link></li>
              <li><Link to="/weather-betting/leaderboard" className="hover:underline">Leaderboard</Link></li>
              <li><Link to="/weather-betting/history" className="hover:underline">Bet History</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/weather-betting/rules" className="hover:underline">Betting Rules</Link></li>
              <li><Link to="/weather-betting/help" className="hover:underline">Help Center</Link></li>
              <li><Link to="/weather-betting/faq" className="hover:underline">FAQ</Link></li>
              <li><Link to="/weather-betting/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/weather-betting/terms" className="hover:underline">Terms of Service</Link></li>
              <li><Link to="/weather-betting/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/weather-betting/responsible" className="hover:underline">Responsible Betting</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t-4 border-black mt-6 pt-6 text-center">
          <p className="text-sm text-gray-600">
            © 2025 Kiyan Weather Betting Platform. All rights reserved. 
            <span className="font-bold"> Bet responsibly.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}