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
      path: '/weather-intelligence',
      available: true,
      hoverColor: '#a589e8',
      buttonClass: 'nb-button-accent',
      backgroundClass: 'nb-weather-intelligence-bg-animated',
    },
    {
      id: 'weather-betting',
      title: 'Weather Betting Platform',
      description: 'Place bets on weather predictions and compete with other weather enthusiasts.',
      path: '/weather-betting',
      available: true,
      hoverColor: '#66ccff',
      buttonClass: 'nb-betting-button-accent',
      backgroundClass: 'nb-weather-betting-bg-animated',
    },
    {
      id: 'future-innovations',
      title: 'Future Innovations',
      description: 'Discover what\'s coming next in the world of weather technology and AI.',
      path: '/future-platform',
      available: false,
      hoverColor: 'var(--nb-warning)',
      buttonClass: 'nb-button',
      backgroundClass: 'nb-future-innovations-bg-animated',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Overlay Title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
      <div className="absolute top-8 left-1/2 z-30"
     style={{ transform: 'translateX(-50%)' }}>
  <div
    className="bg-[#ffb3ba] border-4 border-black px-8 py-3  shadow-[4px_4px_0_#111]
                text-black text-xl md:text-2xl font-extrabold uppercase tracking-wide"
    
  >
    Choose Your Kiyan
  </div>
  
</div>
        
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
                <div 
                  className={`absolute inset-0 w-full h-full ${platform.backgroundClass}`}
                />
                
                {/* Neobrutalism hover overlay with color */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(to top, ${platform.hoverColor}, ${platform.hoverColor}70, transparent)`
                  }}
                />

                
                {/* Neobrutalism border on hover */}
                <div className="absolute inset-4 border-8 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Platform info - appears on hover with neobrutalism styling */}
                <div className="absolute bottom-8 left-8 right-8 text-black opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <h3 className="text-3xl font-bold mb-4 text-shadow-lg">{platform.title}</h3>
                  <p className="text-lg mb-6 text-shadow-md font-bold">{platform.description}</p>
                  <div className={`${platform.buttonClass} px-6 py-3 font-bold text-lg inline-block`}>
                    Enter Platform →
                  </div>
                </div>
              </Link>
            ) : (
              <div className="w-full h-full relative overflow-hidden">
                <div 
                  className={`absolute inset-0 w-full h-full ${platform.backgroundClass} grayscale`}
                />
                
                {/* Coming soon overlay */}
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  {/* Neobrutalism Coming Soon badge */}
                  <div className="nb-panel-warning px-6 py-3 font-bold text-xl mb-6 transform -rotate-12">
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