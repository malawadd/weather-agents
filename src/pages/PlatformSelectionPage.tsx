import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../WalletAuthProvider';

export function PlatformSelectionPage() {
  const { user, isGuest, signOut } = useAuth();

  const platforms = [
    {
      id: 'weather-intelligence',
      title: 'Weather Intelligence Platform',
      description: 'Explore global weather stations and get AI-powered insights about weather patterns and conditions.',
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      path: '/weather-intelligence',
      available: true,
    },
    {
      id: 'weather-betting',
      title: 'Weather Betting Platform',
      description: 'Place bets on weather predictions and compete with other weather enthusiasts.',
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      path: '/weather-betting',
      available: false,
    },
    {
      id: 'future-innovations',
      title: 'Future Innovations',
      description: 'Discover what\'s coming next in the world of weather technology and AI.',
      image: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      path: '/future-platform',
      available: false,
    },
  ];

  return (
    <div className="min-h-screen nb-grid-bg">
      {/* Header */}
      <nav className="nb-panel-white p-4 m-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">🤖 Kiyan</h1>
          <div className="flex items-center space-x-4">
            <span className="font-bold">
              Welcome, {user?.name || 'Explorer'}!
              {isGuest && <span className="text-sm text-gray-600"> (Guest)</span>}
            </span>
            <button 
              onClick={signOut}
              className="nb-button px-4 py-2 text-sm font-bold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Welcome Section */}
        <div className="nb-panel-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Choose Your Kiyan</h1>
          <p className="text-xl text-gray-600 mb-2">
            Select the platform that matches your interests
          </p>
          <p className="text-sm text-gray-500">
            Each platform offers unique features and experiences powered by AI and weather data
          </p>
        </div>

        {/* Platform Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {platforms.map((platform) => (
            <div key={platform.id} className="relative">
              {platform.available ? (
                <Link
                  to={platform.path}
                  className="block nb-panel-white p-0 overflow-hidden group hover:scale-105 transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={platform.image}
                      alt={platform.title}
                      className="w-full h-64 object-cover platform-choice-image"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-lg font-bold mb-1">{platform.title}</h3>
                      <p className="text-sm">{platform.description}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{platform.title}</h3>
                    <p className="text-gray-600 mb-4">{platform.description}</p>
                    <div className="nb-button-accent px-4 py-2 text-center font-bold">
                      Enter Platform →
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="nb-panel p-0 overflow-hidden opacity-75">
                  <div className="relative">
                    <img
                      src={platform.image}
                      alt={platform.title}
                      className="w-full h-64 object-cover platform-choice-image grayscale"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="nb-panel-warning px-4 py-2">
                        <span className="font-bold text-sm">🚧 Coming Soon</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-500">{platform.title}</h3>
                    <p className="text-gray-400 mb-4">{platform.description}</p>
                    <div className="nb-panel px-4 py-2 text-center font-bold text-gray-500">
                      Under Development
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="nb-panel-accent p-6">
          <h3 className="text-xl font-bold mb-4 text-center">🌟 What Makes Kiyan Special</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🤖</div>
              <h4 className="font-bold mb-2">AI-Powered</h4>
              <p className="text-sm">Advanced artificial intelligence analyzes weather patterns and provides intelligent insights.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌍</div>
              <h4 className="font-bold mb-2">Global Network</h4>
              <p className="text-sm">Access data from weather stations worldwide through the decentralized WeatherXM network.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔮</div>
              <h4 className="font-bold mb-2">Future Ready</h4>
              <p className="text-sm">Built for the future with blockchain integration and innovative weather applications.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}