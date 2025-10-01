import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../WalletAuthProvider';

export function PlatformSelectionPage() {
  const { user, isGuest, signOut } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2)',
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Top Right Navigation */}
      <div className="absolute top-8 right-8 z-30 flex items-center space-x-4">
        <Link 
          to="/weather-intelligence" 
          className="nb-button-accent px-4 py-2 font-bold text-sm"
        >
          Weather Intelligence
        </Link>
        <Link 
          to="/weather-betting" 
          className="nb-button px-4 py-2 font-bold text-sm"
        >
          Weather Betting
        </Link>
        <div className="nb-panel-white px-4 py-2 flex items-center space-x-3">
          <span className="text-black text-sm font-bold">
            {user?.name || 'Explorer'}
            {isGuest && <span className="text-gray-600"> (Guest)</span>}
          </span>
          <button
            onClick={signOut}
            className="nb-button px-3 py-1 text-xs font-bold"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Central Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4 text-shadow-md">
            Kiyan Weather Intelligence Platform
          </h1>
          <p className="text-xl text-shadow-sm font-medium">
            Harnessing the power of global weather data and AI
          </p>
        </div>

        {/* Latest Expansion Badge */}
        <div className="flex items-center space-x-4 mb-12">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-green-500 border-4 border-white shadow-lg flex items-center justify-center">
            <span className="text-2xl">🌍</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-300">Latest Platform</p>
            <p className="text-2xl font-bold text-shadow-sm">Weather Intelligence Hub</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Cards */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex space-x-6">
          <Link 
            to="/weather-intelligence" 
            className="nb-panel-white p-6 hover:nb-panel-accent transition-all duration-200 group"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-black rounded border-2 border-black flex items-center justify-center group-hover:bg-gray-800">
                <span className="text-white text-xl">🏠</span>
              </div>
              <p className="font-bold text-sm">Dashboard</p>
            </div>
          </Link>

          <Link 
            to="/weather-intelligence/stations" 
            className="nb-panel-white p-6 hover:nb-panel-accent transition-all duration-200 group"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-black rounded border-2 border-black flex items-center justify-center group-hover:bg-gray-800">
                <span className="text-white text-xl">🌤️</span>
              </div>
              <p className="font-bold text-sm">Stations</p>
            </div>
          </Link>

          <Link 
            to="/weather-intelligence/my-stations" 
            className="nb-panel-white p-6 hover:nb-panel-accent transition-all duration-200 group"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-black rounded border-2 border-black flex items-center justify-center group-hover:bg-gray-800">
                <span className="text-white text-xl">⭐</span>
              </div>
              <p className="font-bold text-sm">My Stations</p>
            </div>
          </Link>

          <Link 
            to="/weather-betting" 
            className="nb-panel-white p-6 hover:nb-panel-accent transition-all duration-200 group"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-black rounded border-2 border-black flex items-center justify-center group-hover:bg-gray-800">
                <span className="text-white text-xl">🎲</span>
              </div>
              <p className="font-bold text-sm">Betting</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}