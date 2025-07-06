import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../WalletAuthProvider';

export function PlaceholderPlatformPage() {
  const { user, isGuest, signOut } = useAuth();
  const location = useLocation();

  const getPlatformInfo = () => {
    if (location.pathname.includes('weather-betting')) {
      return {
        title: 'Weather Betting Platform',
        description: 'Place bets on weather predictions and compete with other weather enthusiasts.',
        icon: '🎲',
        features: [
          'Predict weather outcomes',
          'Compete with other users',
          'Win rewards for accurate predictions',
          'Real-time betting markets',
          'Weather-based gaming'
        ]
      };
    } else if (location.pathname.includes('future-platform')) {
      return {
        title: 'Future Innovations',
        description: 'Discover what\'s coming next in the world of weather technology and AI.',
        icon: '🚀',
        features: [
          'Cutting-edge weather tech',
          'Advanced AI models',
          'Experimental features',
          'Community-driven development',
          'Next-gen weather applications'
        ]
      };
    }
    
    return {
      title: 'Platform Under Development',
      description: 'This platform is currently being built with exciting new features.',
      icon: '🔧',
      features: [
        'Innovative weather solutions',
        'AI-powered insights',
        'Community features',
        'Advanced analytics',
        'Real-time data processing'
      ]
    };
  };

  const platformInfo = getPlatformInfo();

  return (
    <div className="min-h-screen nb-grid-bg">
      {/* Header */}
      <nav className="nb-panel-white p-4 m-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">🤖 Kiyan</h1>
            <Link to="/platform-selection" className="nb-button px-4 py-2 text-sm font-bold">
              ← Back to Platform Selection
            </Link>
          </div>
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
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Platform Header */}
        <div className="nb-panel-white p-8 text-center">
          <div className="text-6xl mb-4">{platformInfo.icon}</div>
          <h1 className="text-4xl font-bold mb-4">{platformInfo.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{platformInfo.description}</p>
          <div className="nb-panel-warning px-6 py-3 inline-block">
            <span className="font-bold">🚧 Under Construction</span>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="nb-panel-accent p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">🌟 What's Coming</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platformInfo.features.map((feature, index) => (
              <div key={index} className="nb-panel-white p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✨</span>
                  <span className="font-bold">{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Development Status */}
        <div className="nb-panel-success p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">🔨 Development Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold">Platform Architecture</span>
              <div className="nb-panel-accent px-3 py-1 text-sm font-bold">In Progress</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold">AI Integration</span>
              <div className="nb-panel-warning px-3 py-1 text-sm font-bold">Planning</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold">User Interface</span>
              <div className="nb-panel-warning px-3 py-1 text-sm font-bold">Design Phase</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold">Beta Testing</span>
              <div className="nb-panel px-3 py-1 text-sm font-bold">Upcoming</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="nb-panel p-8 text-center">
          <h3 className="text-xl font-bold mb-4">Want to be notified when this platform launches?</h3>
          <p className="text-gray-600 mb-6">
            While you wait, explore our Weather Intelligence Platform to see what Kiyan can do!
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/weather-intelligence" className="nb-button-accent px-6 py-3 font-bold">
              🌤️ Try Weather Intelligence
            </Link>
            <Link to="/platform-selection" className="nb-button px-6 py-3 font-bold">
              ← Back to Platforms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}