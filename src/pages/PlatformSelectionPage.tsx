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
    <div className="min-h-screen flex flex-col relative">
      {/* Overlay Title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
        <h1 className="text-6xl md:text-8xl font-bold text-white text-shadow-lg mb-4">
          Choose Your Kiyan
        </h1>
        <p className="text-xl md:text-2xl text-white text-shadow-md font-medium">
          Select the platform that matches your interests
        </p>
        
        {/* User info in top right */}
        <div className="absolute top-8 right-8 pointer-events-auto">
          <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-white font-bold text-sm">
              Welcome, {user?.name || 'Explorer'}!
              {isGuest && <span className="text-gray-300"> (Guest)</span>}
            </span>
            <button 
              onClick={signOut}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded font-bold text-sm transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Platform Selection Grid - Full Screen */}
      <div className="flex-1 flex">
        {platforms.map((platform) => (
          <div key={platform.id} className="flex-1 h-screen relative group">
            {platform.available ? (
              <Link
                to={platform.path}
                className="block w-full h-full relative overflow-hidden"
              >
                <img
                  src={platform.image}
                  alt={platform.title}
                  className="absolute inset-0 w-full h-full object-cover platform-choice-image transition-all duration-500 group-hover:scale-110"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Platform info - appears on hover */}
                <div className="absolute bottom-8 left-8 right-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <h3 className="text-3xl font-bold mb-4 text-shadow-lg">{platform.title}</h3>
                  <p className="text-lg mb-6 text-shadow-md">{platform.description}</p>
                  <div className="bg-white/20 backdrop-blur-sm border-2 border-white/50 px-6 py-3 rounded-lg font-bold text-lg hover:bg-white/30 transition-colors inline-block">
                    Enter Platform →
                  </div>
                </div>
              </Link>
            ) : (
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src={platform.image}
                  alt={platform.title}
                  className="absolute inset-0 w-full h-full object-cover grayscale"
                />
                
                {/* Coming soon overlay */}
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <div className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold text-xl mb-6 border-4 border-black shadow-lg">
                    🚧 Coming Soon
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white text-shadow-lg text-center">{platform.title}</h3>
                  <p className="text-lg text-gray-300 text-shadow-md text-center max-w-md px-4">{platform.description}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}